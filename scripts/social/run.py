#!/usr/bin/env python3
"""Publica matérias novas no Instagram e no Threads depois do merge na main.

X está cancelado: threads_x vai só para o Threads. O compose_cmd do PR não é
executado; a arte sai de compose_ig_post.py.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from compose_ig_post import compose, write_jpeg
from git_branch import GitPushError, commit_paths, prepare_branch, push_head
from github_api import (
    comment_body,
    comment_exists,
    list_comments,
    post_comment,
    pr_for_commit,
)
from http_wait import ARTICLE_TIMEOUT_S, IMAGE_TIMEOUT_S, assert_meta_can_fetch, wait_until_ready
from ledger import empty_ledger, entry_complete, resolve_existing
from mdx_meta import is_draft_mdx
from package_parse import SLUG_RE, parse_social_package, validate_package
from post_api import list_recent_ig, list_recent_threads, post_instagram, post_threads, refresh_threads_token
from redact import redact

ASSETS_BRANCH = "social-assets"
LEDGER_BRANCH = "social-ledger"
ASSETS_README = """# social-assets

Arte 1:1 gerada por `.github/workflows/social-post.yml`.

Não editar à mão. Instagram e Threads baixam o JPEG:

https://raw.githubusercontent.com/{repo}/social-assets/<slug>.jpg

O PNG ao lado é a mesma arte, antes da compressão JPEG. Esta branch não dispara
o workflow (ele só escuta a `main`).
"""
LEDGER_README = """# social-ledger

Registro para não publicar a mesma matéria duas vezes.
O workflow `social-post.yml` lê e grava `ledger.json`.
Não editar à mão, salvo para destravar um slug com permalink errado.
"""


def article_url(slug: str) -> str:
    return f"https://www.thezero.com.br/noticia/{slug}"


def raw_asset(repo: str, filename: str) -> str:
    return f"https://raw.githubusercontent.com/{repo}/{ASSETS_BRANCH}/{filename}"


def note(text: str, secrets: list[str]) -> None:
    print(redact(text, secrets), flush=True)


def write_summary(lines: list[str], secrets: list[str]) -> None:
    text = redact("\n".join(lines).rstrip() + "\n", secrets)
    print(text, flush=True)
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    with open(path, "a", encoding="utf-8") as handle:
        handle.write(text)


def require_env(name: str, secrets: list[str]) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"Secret {name} não está definido.")
    if value not in secrets:
        secrets.append(value)
    return value


def repo_root() -> Path:
    out = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip()
    return Path(out)


def git_lines(args: list[str]) -> list[str]:
    out = subprocess.check_output(["git", *args], text=True)
    return [line.strip() for line in out.splitlines() if line.strip()]


def commits_in_push(before: str, after: str) -> list[str]:
    if not after:
        after = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
    if not before or set(before) <= {"0"}:
        return [after]
    found = git_lines(["rev-list", "--reverse", f"{before}..{after}"])
    return found or [after]


def added_posts(commit: str) -> list[str]:
    lines = git_lines(
        [
            "diff-tree",
            "--no-commit-id",
            "--name-only",
            "--diff-filter=A",
            "-r",
            commit,
            "--",
            "content/posts",
        ]
    )
    return [line for line in lines if line.endswith((".mdx", ".md"))]


def commit_that_added(path: str) -> str:
    found = subprocess.check_output(
        ["git", "log", "-1", "--diff-filter=A", "--format=%H", "--", path],
        text=True,
    ).strip()
    if not found:
        raise RuntimeError(f"não achei o commit que adicionou {path}.")
    return found


def slug_of(path: str) -> str:
    return Path(path).name.removesuffix(".mdx").removesuffix(".md")


def discover(root: Path) -> list[dict]:
    event = os.environ.get("EVENT_NAME") or os.environ.get("GITHUB_EVENT_NAME") or "push"
    if event == "workflow_dispatch":
        slug = (os.environ.get("INPUT_SLUG") or "").strip()
        if not SLUG_RE.match(slug):
            raise RuntimeError(f"slug inválido: {slug}.")
        path = root / "content" / "posts" / f"{slug}.mdx"
        if not path.is_file():
            alt = root / "content" / "posts" / f"{slug}.md"
            path = alt if alt.is_file() else path
        if not path.is_file():
            raise RuntimeError(f"não há {path.relative_to(root)} na main.")
        rel = str(path.relative_to(root))
        return [{"slug": slug, "path": rel, "commit": commit_that_added(rel), "manual": True}]

    before = os.environ.get("BEFORE") or os.environ.get("GITHUB_EVENT_BEFORE") or ""
    after = os.environ.get("AFTER") or os.environ.get("GITHUB_SHA") or ""
    found: dict[str, dict] = {}
    for commit in commits_in_push(before, after):
        for rel in added_posts(commit):
            slug = slug_of(rel)
            if (root / rel).is_file():
                found[slug] = {"slug": slug, "path": rel, "commit": commit, "manual": False}
    return list(found.values())


def resolve_cover(root: Path, cover_path: str) -> Path:
    raw = cover_path.strip().strip('"').strip("'")
    if raw.startswith(("http://", "https://")):
        raise RuntimeError("cover_path remoto não é suportado.")
    rel = Path(raw.lstrip("/"))
    if rel.is_absolute() or ".." in rel.parts:
        raise RuntimeError("cover_path inválido.")
    abs_path = (root / rel).resolve()
    if not abs_path.is_relative_to(root.resolve()) or not abs_path.is_file():
        raise RuntimeError(f"capa não encontrada: {raw}")
    return abs_path


def _with_branch(repo: str, branch: str, token: str, secrets: list[str], mutate) -> None:
    last: Exception | None = None
    for _ in range(3):
        dest = Path(tempfile.mkdtemp(prefix=f"{branch}-"))
        try:
            state = prepare_branch(repo, branch, token, secrets, dest)
            changed = mutate(dest, state)
            if changed:
                push_head(dest, repo, branch, token, secrets)
            return
        except GitPushError as exc:
            last = exc
        finally:
            shutil.rmtree(dest, ignore_errors=True)
    raise RuntimeError(f"não consegui atualizar a branch {branch}: {last}")


def load_ledger(repo: str, token: str, secrets: list[str]) -> dict:
    dest = Path(tempfile.mkdtemp(prefix="social-ledger-read-"))
    try:
        state = prepare_branch(repo, LEDGER_BRANCH, token, secrets, dest)
        path = dest / "ledger.json"
        if state == "missing" or not path.is_file():
            return empty_ledger()
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, dict) or not isinstance(data.get("posts"), dict):
            return empty_ledger()
        return data
    finally:
        shutil.rmtree(dest, ignore_errors=True)


def save_ledger(repo: str, token: str, secrets: list[str], slug: str, fields: dict) -> None:
    def mutate(dest: Path, state: str) -> bool:
        path = dest / "ledger.json"
        if path.is_file():
            data = json.loads(path.read_text(encoding="utf-8"))
        else:
            data = empty_ledger()
        if not isinstance(data.get("posts"), dict):
            data["posts"] = {}
        entry = data["posts"].get(slug)
        if not isinstance(entry, dict):
            entry = {}
        for key, value in fields.items():
            if value not in (None, ""):
                entry[key] = value
        entry["slug"] = slug
        entry["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        data["posts"][slug] = entry
        data["version"] = 1
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        paths = ["ledger.json"]
        readme = dest / "README.md"
        if state == "missing" or not readme.is_file():
            readme.write_text(LEDGER_README, encoding="utf-8")
            paths.append("README.md")
        return commit_paths(dest, token, secrets, f"ledger: {slug}", paths)

    _with_branch(repo, LEDGER_BRANCH, token, secrets, mutate)


def publish_assets(repo: str, token: str, secrets: list[str], slug: str, png: Path, jpg: Path) -> None:
    def mutate(dest: Path, state: str) -> bool:
        shutil.copyfile(png, dest / f"{slug}.png")
        shutil.copyfile(jpg, dest / f"{slug}.jpg")
        paths = [f"{slug}.png", f"{slug}.jpg"]
        readme = dest / "README.md"
        if state == "missing" or not readme.is_file():
            readme.write_text(ASSETS_README.format(repo=repo), encoding="utf-8")
            paths.append("README.md")
        return commit_paths(dest, token, secrets, f"social: {slug}", paths)

    _with_branch(repo, ASSETS_BRANCH, token, secrets, mutate)


def ensure_comment(repo: str, token: str, secrets: list[str], number: int | None, slug: str, ig: str, threads: str) -> str:
    if not number:
        return "publicado sem PR associado para comentar."
    if not ig or not threads:
        return ""
    body = comment_body(slug, ig, threads)
    comments = list_comments(repo, number, token, secrets)
    if comment_exists(comments, slug, ig, threads):
        return "comentário já estava no PR."
    post_comment(repo, number, body, token, secrets)
    return f"comentário publicado no PR #{number}."


def render_art(root: Path, cover: Path, hook: str, summary: str, slug: str) -> tuple[Path, Path]:
    out_dir = Path(os.environ.get("SOCIAL_OUT_DIR") or (root / "social-out"))
    out_dir.mkdir(parents=True, exist_ok=True)
    png = compose(cover, hook, summary, out_dir / f"{slug}.png", size="1x1")
    jpg = write_jpeg(png, out_dir / f"{slug}.jpg")
    return png, jpg


def threads_token_for_run(current: str, secrets: list[str], refresh=None) -> str:
    """Tenta renovar o THREADS_TOKEN. Se falhar (inclusive token com menos de
    24 h), avisa sem expor o valor e segue com o token atual."""
    refresh = refresh or refresh_threads_token
    if current and current not in secrets:
        secrets.append(current)
    try:
        fresh = refresh(current, secrets)
    except Exception as exc:  # noqa: BLE001 — renovação nunca derruba a publicação
        note(
            f"::warning::não renovei o THREADS_TOKEN ({exc}). Sigo com o token atual.",
            secrets,
        )
        return current
    if not fresh or not isinstance(fresh, str):
        note("::warning::renovação do THREADS_TOKEN sem token novo. Sigo com o token atual.", secrets)
        return current
    if fresh not in secrets:
        secrets.append(fresh)
    note("THREADS_TOKEN renovado para esta execução.", secrets)
    return fresh


def lookup_pr(repo: str, commit: str, token: str, secrets: list[str]) -> dict | None:
    return pr_for_commit(repo, commit, token, secrets)


def process(root: Path, repo: str, item: dict, secrets: list[str], tokens: dict, ledger: dict, recent: dict) -> dict:
    slug = item["slug"]
    if not SLUG_RE.match(slug):
        return {
            "slug": slug,
            "status": "failed",
            "ig": "",
            "threads": "",
            "detail": f"slug inválido: {slug}.",
            "pr": None,
            "image": "",
        }
    manual = bool(item["manual"])
    outcome = {
        "slug": slug,
        "status": "skipped",
        "ig": "",
        "threads": "",
        "detail": "",
        "pr": None,
        "image": "",
    }
    try:
        mdx_path = root / item["path"]
        text = mdx_path.read_text(encoding="utf-8")
        if is_draft_mdx(text):
            outcome["detail"] = "rascunho (draft); a URL pública não existe."
            return outcome

        pr = lookup_pr(repo, item["commit"], tokens["github"], secrets)
        body = str(pr.get("body") or "") if pr else ""
        number = pr.get("number") if isinstance(pr, dict) else None
        outcome["pr"] = number
        package = parse_social_package(body)
        if package is None:
            outcome["detail"] = "sem SOCIAL PACKAGE."
            outcome["status"] = "failed" if manual else "skipped"
            return outcome
        errors = validate_package(package, slug)
        if errors:
            outcome["status"] = "failed"
            outcome["detail"] = " ".join(errors)
            return outcome

        url = article_url(slug)
        existing = resolve_existing(slug, url, ledger, recent.get("ig") or [], recent.get("threads") or [])
        outcome["ig"] = str(existing.get("ig") or "")
        outcome["threads"] = str(existing.get("threads") or "")
        stored = ledger.get("posts", {}).get(slug) if isinstance(ledger.get("posts"), dict) else None
        if (
            os.environ.get("SOCIAL_DRY_RUN") != "1"
            and entry_complete(existing)
            and not entry_complete(stored if isinstance(stored, dict) else None)
        ):
            save_ledger(
                repo,
                tokens["github"],
                secrets,
                slug,
                {
                    "article_url": url,
                    "ig": outcome["ig"],
                    "threads": outcome["threads"],
                    "pr": number or "",
                    "commit": item["commit"],
                },
            )

        if not entry_complete(existing):
            cover = resolve_cover(root, package["cover_path"])
            png, jpg = render_art(root, cover, package["hook"], package["summary"], slug)
            if os.environ.get("SOCIAL_DRY_RUN") == "1":
                outcome["status"] = "skipped"
                outcome["detail"] = f"dry-run: {png} {jpg}"
                return outcome
            publish_assets(repo, tokens["github"], secrets, slug, png, jpg)
            image_url = raw_asset(repo, f"{slug}.jpg")
            outcome["image"] = image_url
            wait_until_ready(image_url, "jpeg", IMAGE_TIMEOUT_S, secrets)
            assert_meta_can_fetch(image_url, secrets)
            wait_until_ready(url, "article", ARTICLE_TIMEOUT_S, secrets)

            fields = {
                "article_url": url,
                "image_jpg": image_url,
                "image_png": raw_asset(repo, f"{slug}.png"),
                "pr": number or "",
                "commit": item["commit"],
            }
            if not outcome["ig"]:
                outcome["ig"] = post_instagram(
                    tokens["meta"],
                    tokens["ig_user"],
                    image_url,
                    package["caption_ig"].strip(),
                    secrets,
                )
                fields["ig"] = outcome["ig"]
                save_ledger(repo, tokens["github"], secrets, slug, fields)
            if not outcome["threads"]:
                outcome["threads"] = post_threads(
                    tokens["threads"],
                    tokens["threads_user"],
                    image_url,
                    package["threads_x"].strip(),
                    secrets,
                )
                fields["threads"] = outcome["threads"]
                save_ledger(repo, tokens["github"], secrets, slug, fields)
            ledger.setdefault("posts", {})[slug] = {**existing, **fields, "ig": outcome["ig"], "threads": outcome["threads"]}

        if os.environ.get("SOCIAL_DRY_RUN") == "1":
            return outcome

        note_text = ensure_comment(
            repo,
            tokens["github"],
            secrets,
            number if isinstance(number, int) else None,
            slug,
            outcome["ig"],
            outcome["threads"],
        )
        outcome["status"] = "posted"
        outcome["detail"] = note_text
        if number and "comentário publicado" not in note_text and "já estava" not in note_text:
            outcome["status"] = "failed"
            outcome["detail"] = note_text or "não consegui comentar no PR."
        if not number:
            outcome["detail"] = "publicado, mas não achei o PR para comentar."
            outcome["status"] = "failed"
        return outcome
    except Exception as exc:  # noqa: BLE001
        outcome["status"] = "failed"
        outcome["detail"] = redact(str(exc), secrets)
        return outcome



def summary_lines(outcomes: list[dict]) -> list[str]:
    lines = ["## Social", ""]
    if not outcomes:
        lines.append("Nenhuma matéria nova neste push.")
        return lines
    for item in outcomes:
        ig = item["ig"] or "—"
        threads = item["threads"] or "—"
        lines.append(f"### {item['slug']}")
        lines.append(f"- status: {item['status']}")
        lines.append(f"- ig: {ig}")
        lines.append(f"- threads: {threads}")
        if item.get("image"):
            lines.append(f"- image: {item['image']}")
        if item.get("detail"):
            lines.append(f"- detalhe: {item['detail']}")
        lines.append("")
    return lines


def main() -> int:
    secrets: list[str] = []
    dry = "--dry-run" in sys.argv or os.environ.get("SOCIAL_DRY_RUN") == "1"
    if dry:
        os.environ["SOCIAL_DRY_RUN"] = "1"
    root = repo_root()
    os.chdir(root)
    outcomes: list[dict] = []
    try:
        articles = discover(root)
        if not articles:
            write_summary(summary_lines([]), secrets)
            return 0
        if dry:
            # Dry-run só lê o GitHub. GITHUB_TOKEN é opcional (sem ele, chamada anônima).
            dry_github = os.environ.get("GITHUB_TOKEN", "").strip()
            if dry_github:
                secrets.append(dry_github)
            tokens = {"github": dry_github, "meta": "", "ig_user": "", "threads": "", "threads_user": ""}
            recent = {"ig": [], "threads": []}
            ledger = empty_ledger()
            for item in articles:
                try:
                    outcomes.append(process(root, os.environ.get("REPO") or "laviorg/thezero", item, secrets, tokens, ledger, recent))
                except Exception as exc:  # noqa: BLE001 — vira linha do resumo, já redigida
                    outcomes.append(
                        {
                            "slug": item["slug"],
                            "status": "failed",
                            "ig": "",
                            "threads": "",
                            "detail": redact(str(exc), secrets),
                            "image": "",
                        }
                    )
            write_summary(summary_lines(outcomes), secrets)
            return 1 if any(item["status"] == "failed" for item in outcomes) else 0

        repo = os.environ.get("REPO") or os.environ.get("GITHUB_REPOSITORY") or ""
        if not repo:
            raise RuntimeError("REPO não está definido.")
        github_token = require_env("GITHUB_TOKEN", secrets)
        tokens = {"github": github_token, "meta": "", "ig_user": "", "threads": "", "threads_user": ""}
        # Meta só entra se houver pacote válido ainda não publicado. Push sem
        # SOCIAL PACKAGE (ou com ledger completo) não exige os secrets.
        ledger = load_ledger(repo, github_token, secrets)
        needs_network = False
        prepared: list[tuple[dict, dict | None, str]] = []
        for item in articles:
            pr = lookup_pr(repo, item["commit"], github_token, secrets)
            body = str(pr.get("body") or "") if pr else ""
            package = parse_social_package(body)
            text = (root / item["path"]).read_text(encoding="utf-8")
            prepared.append((item, pr, body))
            if is_draft_mdx(text) or package is None or validate_package(package, item["slug"]):
                continue
            stored = ledger.get("posts", {}).get(item["slug"]) if isinstance(ledger.get("posts"), dict) else None
            if not entry_complete(stored if isinstance(stored, dict) else None):
                needs_network = True

        recent = {"ig": [], "threads": []}
        if needs_network:
            tokens["meta"] = require_env("META_PAGE_TOKEN", secrets)
            tokens["ig_user"] = require_env("IG_USER_ID", secrets)
            tokens["threads_user"] = require_env("THREADS_USER_ID", secrets)
            current_threads = require_env("THREADS_TOKEN", secrets)
            tokens["threads"] = threads_token_for_run(current_threads, secrets)
            try:
                recent["ig"] = list_recent_ig(tokens["meta"], tokens["ig_user"], secrets)
            except RuntimeError as exc:
                note(f"não consegui listar o Instagram recente: {exc}", secrets)
            try:
                recent["threads"] = list_recent_threads(tokens["threads"], tokens["threads_user"], secrets)
            except RuntimeError as exc:
                note(f"não consegui listar o Threads recente: {exc}", secrets)

        for item, _pr, _body in prepared:
            try:
                outcomes.append(process(root, repo, item, secrets, tokens, ledger, recent))
            except Exception as exc:  # noqa: BLE001
                outcomes.append(
                    {
                        "slug": item["slug"],
                        "status": "failed",
                        "ig": "",
                        "threads": "",
                        "detail": redact(str(exc), secrets),
                        "image": "",
                    }
                )
    except Exception as exc:  # noqa: BLE001
        write_summary(["## Social", "", redact(str(exc), secrets)], secrets)
        return 1

    write_summary(summary_lines(outcomes), secrets)
    if any(item["status"] == "failed" for item in outcomes):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
