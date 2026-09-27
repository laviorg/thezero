#!/usr/bin/env python3
"""Renova o token de longa duração do Threads e, se houver PAT, grava o secret.

Actions não reescreve secrets com o GITHUB_TOKEN. GH_PAT_SECRETS é um PAT do
dono com permissão de escrever secrets. O valor novo nunca vai para o log.
"""

from __future__ import annotations

import os
import sys

from post_api import refresh_threads_token
from redact import redact
from secrets_update import update_repo_secret


def summary(text: str, secrets: list[str]) -> None:
    clean = redact(text, secrets)
    print(clean, flush=True)
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with open(path, "a", encoding="utf-8") as handle:
            handle.write(clean.rstrip() + "\n")


def main() -> int:
    secrets: list[str] = []
    token = os.environ.get("THREADS_TOKEN", "").strip()
    pat = os.environ.get("GH_PAT_SECRETS", "").strip()
    repo = os.environ.get("REPO") or os.environ.get("GITHUB_REPOSITORY") or ""
    if token:
        secrets.append(token)
    if pat:
        secrets.append(pat)
    if not token:
        summary("THREADS_TOKEN não está definido.", secrets)
        return 1
    if not repo:
        summary("REPO não está definido.", secrets)
        return 1
    try:
        fresh = refresh_threads_token(token, secrets)
    except RuntimeError as exc:
        summary(str(exc), secrets)
        return 1
    if fresh not in secrets:
        secrets.append(fresh)
    summary("THREADS_TOKEN renovado para esta execução.", secrets)
    if not pat:
        print(
            "::warning::GH_PAT_SECRETS ausente. O secret THREADS_TOKEN do repositório não foi atualizado.",
            flush=True,
        )
        summary(
            "GH_PAT_SECRETS não está definido. O token novo ficou só na memória desta execução "
            "e o secret THREADS_TOKEN não foi estendido. Crie o PAT e rode de novo. "
            "Sem isso o token guardado vence em até 60 dias.",
            secrets,
        )
        return 1
    try:
        update_repo_secret(repo, pat, "THREADS_TOKEN", fresh, secrets)
    except RuntimeError as exc:
        summary(str(exc), secrets)
        return 1
    summary("THREADS_TOKEN gravado de volta no secret do repositório.", secrets)
    return 0


if __name__ == "__main__":
    sys.exit(main())
