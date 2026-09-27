"""Publica no Instagram e no Threads. Não há comando de X.

O image_url precisa ser público. Quem chama este módulo entrega a URL
(raw.githubusercontent.com da branch social-assets).
"""

from __future__ import annotations

import time

import requests

from redact import redact

GRAPH = "https://graph.facebook.com/v21.0"
THREADS = "https://graph.threads.net/v1.0"
REFRESH_URL = "https://graph.threads.net/refresh_access_token"

_SECRET_KEYS = {"access_token", "token", "encrypted_value", "refresh_token"}


def _public(data):
    if isinstance(data, dict):
        cleaned = {}
        for key, value in data.items():
            if key.lower() in _SECRET_KEYS:
                cleaned[key] = "[REDACTED]"
            else:
                cleaned[key] = _public(value)
        return cleaned
    if isinstance(data, list):
        return [_public(item) for item in data]
    return data


def _error_text(data, secrets: list[str]) -> str:
    payload = data
    if isinstance(data, dict) and isinstance(data.get("error"), dict):
        err = data["error"]
        message = err.get("message") or err.get("type") or "erro da API"
        code = err.get("code")
        text = f"{message} (code {code})" if code else str(message)
        return redact(text, secrets)
    try:
        import json

        text = json.dumps(_public(payload), ensure_ascii=False)[:500]
    except TypeError:
        text = str(type(payload))
    return redact(text, secrets)


def _request(method: str, url: str, token: str, secrets: list[str], **kwargs):
    try:
        response = requests.request(method, url, timeout=60, **kwargs)
    except requests.RequestException as exc:
        raise RuntimeError(redact(str(exc), secrets)) from None
    try:
        data = response.json()
    except ValueError as exc:
        raise RuntimeError(
            redact(f"HTTP {response.status_code} sem JSON em {url.split('?')[0]}", secrets)
        ) from exc
    if response.status_code >= 400 or (isinstance(data, dict) and "error" in data and "id" not in data and "access_token" not in data):
        raise RuntimeError(f"HTTP {response.status_code}: {_error_text(data, secrets)}")
    return data


def refresh_threads_token(token: str, secrets: list[str] | None = None) -> str:
    """Renova o token de longa duração. Devolve o token novo. Não loga o valor."""
    known = list(secrets or [])
    if token and token not in known:
        known.append(token)
    try:
        response = requests.get(
            REFRESH_URL,
            params={"grant_type": "th_refresh_token", "access_token": token},
            timeout=60,
        )
    except requests.RequestException as exc:
        raise RuntimeError(redact(f"falha de rede ao renovar THREADS_TOKEN: {exc}", known)) from None
    try:
        data = response.json()
    except ValueError:
        raise RuntimeError(f"renovação do THREADS_TOKEN devolveu HTTP {response.status_code} sem JSON")
    fresh = data.get("access_token") if isinstance(data, dict) else None
    if not fresh or not isinstance(fresh, str):
        raise RuntimeError(f"falha ao renovar THREADS_TOKEN: {_error_text(data, known)}")
    return fresh


def _poll_status(url: str, token: str, secrets: list[str], field: str, done: set[str]) -> None:
    last = ""
    for _ in range(30):
        data = _request(
            "GET",
            url,
            token,
            secrets,
            params={"fields": field, "access_token": token},
        )
        status = str(data.get(field) or "")
        last = status or last
        if status in done:
            return
        if status == "ERROR":
            raise RuntimeError(f"container com erro: {_error_text(data, secrets)}")
        time.sleep(3)
    raise RuntimeError(f"container não ficou pronto (último status: {last or 'vazio'})")


def _permalink(url: str, token: str, secrets: list[str]) -> str:
    last_error = "permalink vazio"
    for _ in range(5):
        data = _request(
            "GET",
            url,
            token,
            secrets,
            params={"fields": "permalink", "access_token": token},
        )
        permalink = str(data.get("permalink") or "").strip()
        if permalink:
            return permalink
        last_error = _error_text(data, secrets)
        time.sleep(2)
    raise RuntimeError(f"publicação sem permalink: {last_error}")


def post_instagram(token: str, user_id: str, image_url: str, caption: str, secrets: list[str]) -> str:
    container = _request(
        "POST",
        f"{GRAPH}/{user_id}/media",
        token,
        secrets,
        data={"image_url": image_url, "caption": caption, "access_token": token},
    )
    container_id = container.get("id")
    if not container_id:
        raise RuntimeError(f"container do Instagram falhou: {_error_text(container, secrets)}")
    _poll_status(
        f"{GRAPH}/{container_id}",
        token,
        secrets,
        "status_code",
        {"FINISHED", "PUBLISHED"},
    )
    published = _request(
        "POST",
        f"{GRAPH}/{user_id}/media_publish",
        token,
        secrets,
        data={"creation_id": container_id, "access_token": token},
    )
    media_id = published.get("id")
    if not media_id:
        raise RuntimeError(f"publish do Instagram falhou: {_error_text(published, secrets)}")
    return _permalink(f"{GRAPH}/{media_id}", token, secrets)


def post_threads(token: str, user_id: str, image_url: str, text: str, secrets: list[str]) -> str:
    container = _request(
        "POST",
        f"{THREADS}/{user_id}/threads",
        token,
        secrets,
        data={
            "media_type": "IMAGE",
            "image_url": image_url,
            "text": text,
            "access_token": token,
        },
    )
    container_id = container.get("id")
    if not container_id:
        raise RuntimeError(f"container do Threads falhou: {_error_text(container, secrets)}")
    _poll_status(
        f"{THREADS}/{container_id}",
        token,
        secrets,
        "status",
        {"FINISHED", "PUBLISHED"},
    )
    published = _request(
        "POST",
        f"{THREADS}/{user_id}/threads_publish",
        token,
        secrets,
        data={"creation_id": container_id, "access_token": token},
    )
    media_id = published.get("id")
    if not media_id:
        raise RuntimeError(f"publish do Threads falhou: {_error_text(published, secrets)}")
    return _permalink(f"{THREADS}/{media_id}", token, secrets)


def list_recent_ig(token: str, user_id: str, secrets: list[str], limit: int = 50) -> list[dict]:
    data = _request(
        "GET",
        f"{GRAPH}/{user_id}/media",
        token,
        secrets,
        params={
            "fields": "permalink,timestamp,caption",
            "limit": str(limit),
            "access_token": token,
        },
    )
    rows = data.get("data") if isinstance(data, dict) else None
    return rows if isinstance(rows, list) else []


def list_recent_threads(token: str, user_id: str, secrets: list[str], limit: int = 50) -> list[dict]:
    data = _request(
        "GET",
        f"{THREADS}/{user_id}/threads",
        token,
        secrets,
        params={
            "fields": "permalink,timestamp,text",
            "limit": str(limit),
            "access_token": token,
        },
    )
    rows = data.get("data") if isinstance(data, dict) else None
    return rows if isinstance(rows, list) else []
