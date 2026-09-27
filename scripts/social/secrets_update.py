"""Grava THREADS_TOKEN com a API de secrets do GitHub (sealed box libsodium)."""

from __future__ import annotations

import base64

import requests
from nacl import encoding, public

from redact import redact


def encrypt_secret(public_key: str, secret_value: str) -> str:
    key = public.PublicKey(public_key.encode("utf-8"), encoding.Base64Encoder())
    sealed = public.SealedBox(key).encrypt(secret_value.encode("utf-8"))
    return base64.b64encode(sealed).decode("utf-8")


def update_repo_secret(repo: str, pat: str, name: str, value: str, secrets: list[str]) -> None:
    known = [*secrets, pat, value]
    headers = {
        "Authorization": f"Bearer {pat}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "thezero-social-post",
    }
    key_url = f"https://api.github.com/repos/{repo}/actions/secrets/public-key"
    try:
        key_response = requests.get(key_url, headers=headers, timeout=30)
    except requests.RequestException as exc:
        raise RuntimeError(redact(f"falha ao ler a chave pública de secrets: {exc}", known)) from None
    if key_response.status_code >= 300:
        raise RuntimeError(
            redact(
                f"falha ao ler a chave pública de secrets: HTTP {key_response.status_code}",
                known,
            )
        )
    key = key_response.json()
    encrypted = encrypt_secret(key["key"], value)
    put_url = f"https://api.github.com/repos/{repo}/actions/secrets/{name}"
    try:
        put = requests.put(
            put_url,
            headers=headers,
            json={"encrypted_value": encrypted, "key_id": key["key_id"]},
            timeout=30,
        )
    except requests.RequestException as exc:
        raise RuntimeError(redact(f"falha ao gravar o secret {name}: {exc}", known)) from None
    if put.status_code not in {201, 204}:
        raise RuntimeError(
            redact(f"falha ao gravar o secret {name}: HTTP {put.status_code}", known)
        )
