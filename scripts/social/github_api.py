"""Consulta PRs e comenta o permalink. Não imprime o token."""

from __future__ import annotations

import requests

from redact import redact

MARKER = "## SOCIAL POSTED"


def _headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "thezero-social-post",
    }


def _json(response: requests.Response, token: str, secrets: list[str]):
    if response.status_code >= 300:
        raise RuntimeError(
            redact(f"GitHub HTTP {response.status_code} em {response.url.split('?')[0]}", [*secrets, token])
        )
    try:
        return response.json()
    except ValueError as exc:
        raise RuntimeError(redact(f"GitHub sem JSON (HTTP {response.status_code})", [*secrets, token])) from exc


def pulls_for_commit(repo: str, sha: str, token: str, secrets: list[str]) -> list[dict]:
    url = f"https://api.github.com/repos/{repo}/commits/{sha}/pulls"
    try:
        response = requests.get(url, headers=_headers(token), timeout=30)
    except requests.RequestException as exc:
        raise RuntimeError(redact(f"falha ao buscar PR do commit: {exc}", [*secrets, token])) from None
    if response.status_code == 404:
        return []
    data = _json(response, token, secrets)
    return data if isinstance(data, list) else []


def search_merged_pr(repo: str, sha: str, token: str, secrets: list[str]) -> dict | None:
    query = f"repo:{repo} is:pr sha:{sha}"
    try:
        response = requests.get(
            "https://api.github.com/search/issues",
            headers=_headers(token),
            params={"q": query, "per_page": 5},
            timeout=30,
        )
    except requests.RequestException as exc:
        raise RuntimeError(redact(f"falha na busca de PR: {exc}", [*secrets, token])) from None
    if response.status_code >= 300:
        return None
    items = response.json().get("items") if response.headers.get("content-type", "").startswith("application/json") else None
    if not isinstance(items, list) or not items:
        return None
    number = items[0].get("number")
    if not number:
        return None
    try:
        pr = requests.get(
            f"https://api.github.com/repos/{repo}/pulls/{number}",
            headers=_headers(token),
            timeout=30,
        )
    except requests.RequestException as exc:
        raise RuntimeError(redact(f"falha ao ler o PR: {exc}", [*secrets, token])) from None
    if pr.status_code >= 300:
        return None
    data = pr.json()
    return data if isinstance(data, dict) else None


def pr_for_commit(repo: str, sha: str, token: str, secrets: list[str]) -> dict | None:
    pulls = pulls_for_commit(repo, sha, token, secrets)
    if pulls:
        merged = [item for item in pulls if item.get("merged_at")]
        return (merged or pulls)[0]
    return search_merged_pr(repo, sha, token, secrets)


def comment_body(slug: str, ig: str, threads: str) -> str:
    return f"{MARKER}\nslug: {slug}\nig: {ig}\nthreads: {threads}\n"


def comment_exists(comments: list[dict], slug: str, ig: str, threads: str) -> bool:
    for comment in comments:
        body = str(comment.get("body") or "")
        if MARKER in body and f"slug: {slug}" in body and ig in body and threads in body:
            return True
    return False


def list_comments(repo: str, number: int, token: str, secrets: list[str]) -> list[dict]:
    url = f"https://api.github.com/repos/{repo}/issues/{number}/comments"
    try:
        response = requests.get(url, headers=_headers(token), params={"per_page": 100}, timeout=30)
    except requests.RequestException as exc:
        raise RuntimeError(redact(f"falha ao listar comentários: {exc}", [*secrets, token])) from None
    data = _json(response, token, secrets)
    return data if isinstance(data, list) else []


def post_comment(repo: str, number: int, body: str, token: str, secrets: list[str]) -> None:
    url = f"https://api.github.com/repos/{repo}/issues/{number}/comments"
    try:
        response = requests.post(url, headers=_headers(token), json={"body": body}, timeout=30)
    except requests.RequestException as exc:
        raise RuntimeError(redact(f"falha ao comentar no PR: {exc}", [*secrets, token])) from None
    _json(response, token, secrets)
