"""Espera a matéria e a imagem responderem 200 antes de publicar."""

from __future__ import annotations

import time
from urllib.parse import urlparse

import requests

from redact import redact

ARTICLE_TIMEOUT_S = 15 * 60
IMAGE_TIMEOUT_S = 3 * 60
POLL_INTERVAL_S = 20
META_CRAWLER_UA = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"


def _jpeg(response: requests.Response) -> bool:
    if response.status_code != 200:
        return False
    if not response.content.startswith(b"\xff\xd8\xff"):
        return False
    ctype = response.headers.get("content-type", "").split(";")[0].strip().lower()
    return ctype.startswith("image/") or ctype in {"application/octet-stream", "binary/octet-stream"}


def _article(response: requests.Response) -> bool:
    if response.status_code != 200:
        return False
    host = (urlparse(response.url).hostname or "").lower()
    return host == "www.thezero.com.br"


def wait_until_ready(url: str, kind: str, timeout_s: int, secrets: list[str]) -> None:
    deadline = time.monotonic() + timeout_s
    last = "sem resposta"
    while True:
        try:
            response = requests.get(
                url,
                timeout=25,
                allow_redirects=True,
                headers={"User-Agent": "TheZeroSocial/1.0"},
            )
            ready = _jpeg(response) if kind == "jpeg" else _article(response)
            if ready:
                return
            ctype = response.headers.get("content-type", "").split(";")[0].strip()
            last = f"HTTP {response.status_code} {ctype}".strip()
        except requests.RequestException as exc:
            last = redact(str(exc), secrets)
        print(f"aguardando {url} ({last})", flush=True)
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            raise RuntimeError(f"timeout de {timeout_s}s esperando {url}: {last}")
        time.sleep(min(POLL_INTERVAL_S, remaining))


def assert_meta_can_fetch(url: str, secrets: list[str]) -> None:
    try:
        response = requests.get(
            url,
            timeout=30,
            allow_redirects=True,
            headers={"User-Agent": META_CRAWLER_UA},
        )
    except requests.RequestException as exc:
        raise RuntimeError(redact(f"crawler da Meta não baixou a imagem: {exc}", secrets)) from None
    if not _jpeg(response):
        ctype = response.headers.get("content-type", "").split(";")[0].strip()
        raise RuntimeError(
            f"crawler da Meta não baixou a imagem ({response.status_code} {ctype})"
        )
