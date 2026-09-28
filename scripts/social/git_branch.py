"""Empurra arquivos para uma branch que não é a main.

Autentica como o actions/checkout: http.extraheader com
"AUTHORIZATION: basic base64(x-access-token:<token>)". O GitHub não aceita
"bearer" no git por HTTPS (o git cai no prompt de usuário e falha). O header
vai por GIT_CONFIG_* no ambiente, nunca na linha de comando nem na URL.
"""

from __future__ import annotations

import base64
import os
import subprocess
from pathlib import Path

from redact import redact

BOT_NAME = "github-actions[bot]"
BOT_EMAIL = "41898282+github-actions[bot]@users.noreply.github.com"


class GitPushError(RuntimeError):
    pass


_MASKED: set[str] = set()


def basic_credential(token: str) -> str:
    """base64("x-access-token:<token>"), o mesmo formato do actions/checkout."""
    return base64.b64encode(f"x-access-token:{token}".encode("utf-8")).decode("ascii")


def auth_env(token: str, secrets: list[str]) -> dict[str, str]:
    """Variáveis GIT_CONFIG_* com o header. Registra o base64 como segredo."""
    if not token:
        return {}
    encoded = basic_credential(token)
    for value in (token, encoded):
        if value not in secrets:
            secrets.append(value)
    if os.environ.get("GITHUB_ACTIONS") == "true" and encoded not in _MASKED:
        # O runner já mascara o GITHUB_TOKEN, mas não a forma base64.
        print(f"::add-mask::{encoded}", flush=True)
        _MASKED.add(encoded)
    return {
        "GIT_CONFIG_COUNT": "1",
        "GIT_CONFIG_KEY_0": "http.https://github.com/.extraheader",
        "GIT_CONFIG_VALUE_0": f"AUTHORIZATION: basic {encoded}",
    }


def _git(args: list[str], cwd: Path, token: str, secrets: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    command = ["git", *args]
    env = os.environ.copy()
    for key in [k for k in env if k.startswith("GIT_CONFIG_")]:
        env.pop(key)
    env.update(auth_env(token, secrets))
    env.pop("GIT_TRACE", None)
    env.pop("GIT_CURL_VERBOSE", None)
    env["GIT_TERMINAL_PROMPT"] = "0"
    env["GIT_AUTHOR_NAME"] = BOT_NAME
    env["GIT_AUTHOR_EMAIL"] = BOT_EMAIL
    env["GIT_COMMITTER_NAME"] = BOT_NAME
    env["GIT_COMMITTER_EMAIL"] = BOT_EMAIL
    proc = subprocess.run(
        command,
        cwd=cwd,
        text=True,
        capture_output=True,
        env=env,
        check=False,
    )
    if check and proc.returncode != 0:
        detail = redact((proc.stderr or "") + (proc.stdout or ""), [*secrets, token, basic_credential(token)])
        raise GitPushError(detail.strip() or f"git falhou: {' '.join(args[:3])}")
    return proc


def prepare_branch(repo: str, branch: str, token: str, secrets: list[str], dest: Path) -> str:
    """Clona a branch em dest. Devolve 'existing' ou 'missing'."""
    dest.mkdir(parents=True, exist_ok=True)
    if not (dest / ".git").exists():
        _git(["init", "-q"], dest, token, secrets)
    url = f"https://github.com/{repo}.git"
    remote_ref = f"refs/remotes/origin/{branch}"
    fetched = _git(
        ["fetch", "--depth", "1", url, f"+refs/heads/{branch}:{remote_ref}"],
        dest,
        token,
        secrets,
        check=False,
    )
    if fetched.returncode == 0:
        _git(["checkout", "-q", "-B", branch, f"origin/{branch}"], dest, token, secrets)
        return "existing"
    detail = (fetched.stderr or "") + (fetched.stdout or "")
    missing = "couldn't find remote ref" in detail or "fatal: couldn't find remote ref" in detail
    if missing:
        _git(["checkout", "-q", "-B", branch], dest, token, secrets)
        return "missing"
    raise GitPushError(redact(detail, [*secrets, token, basic_credential(token)]).strip() or "fetch da branch falhou")


def commit_paths(dest: Path, token: str, secrets: list[str], message: str, paths: list[str]) -> bool:
    _git(["add", "--", *paths], dest, token, secrets)
    dirty = _git(["diff", "--cached", "--quiet"], dest, token, secrets, check=False)
    if dirty.returncode == 0:
        return False
    _git(["commit", "-q", "-m", message], dest, token, secrets)
    return True


def push_head(dest: Path, repo: str, branch: str, token: str, secrets: list[str]) -> None:
    url = f"https://github.com/{repo}.git"
    _git(["push", url, f"HEAD:refs/heads/{branch}"], dest, token, secrets)
