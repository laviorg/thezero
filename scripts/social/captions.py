"""Legendas para Instagram, Threads e (no box) X.

A regra: abrir com o que muda para o leitor no Brasil (preço em R$,
disponibilidade, quem é afetado), depois o link. Sem caça-clique e
sem mencionar IA, Instinct ou automação.
"""

from __future__ import annotations

import re

CLICKBAIT_RE = re.compile(
    r"(você\s+n[aã]o\s+vai\s+acreditar|voce\s+nao\s+vai\s+acreditar|"
    r"you\s+won'?t\s+believe|o\s+que\s+aconteceu\s+a\s+seguir|"
    r"vai\s+te\s+chocar|prepare-se\s+para|"
    r"n[aã]o\s+v[aá]\s+acreditar)",
    re.IGNORECASE,
)
AI_MENTION_RE = re.compile(
    r"(\binstinct\b|gerad[oa]s?\s+por\s+ia|escrit[oa]s?\s+por\s+ia|"
    r"cloud\s+agent|automatizad[oa]s?\s+pelo|"
    r"intelig[eê]ncia\s+artificial\s+escreveu)",
    re.IGNORECASE,
)
# "revisãoPGMC", "anunciou10nov": falta espaço no meio da palavra.
SMASHED_CAMEL_RE = re.compile(r"[a-záéíóúâêôãõç]{3,}[A-ZÁÉÍÓÚÂÊÔÃÕÇ]")
SMASHED_MID_DIGIT_RE = re.compile(r"[A-Za-záéíóúâêôãõç][0-9]+[A-Za-záéíóúâêôãõç]")

IG_CAPTION_MAX = 2200
THREADS_TEXT_MAX = 500
X_TEXT_MAX = 280
X_URL_WEIGHT = 23


def looks_smashed(text: str) -> bool:
    if not text:
        return False
    tokens = [tok for tok in text.split() if "://" not in tok and not tok.startswith("www.")]
    blob = " ".join(tokens)
    return bool(SMASHED_CAMEL_RE.search(blob) or SMASHED_MID_DIGIT_RE.search(blob))


def has_banned_phrase(text: str) -> bool:
    if not text:
        return False
    return bool(CLICKBAIT_RE.search(text) or AI_MENTION_RE.search(text))


def article_url(package: dict[str, str]) -> str:
    url = str(package.get("url") or "").strip()
    slug = str(package.get("slug") or "").strip()
    if url:
        return url
    if slug:
        return f"https://www.thezero.com.br/noticia/{slug}"
    return ""


def lead_from_package(package: dict[str, str]) -> str:
    hook = " ".join(str(package.get("hook") or "").split()).strip()
    summary = " ".join(str(package.get("summary") or "").split()).strip()
    parts: list[str] = []
    if hook:
        parts.append(hook.rstrip(".") + ".")
    if summary and summary.rstrip(".") != hook.rstrip("."):
        parts.append(summary)
    return " ".join(parts).strip()


def _ensure_url(text: str, url: str) -> str:
    text = text.strip()
    if not url:
        return text
    if url in text:
        return text
    if text:
        return f"{text}\n\n{url}"
    return url


def _trim_keep_url(text: str, url: str, max_len: int, url_weight: int | None = None) -> str:
    text = _ensure_url(text, url)
    if len(text) <= max_len:
        return text
    weight = url_weight if url_weight is not None else len(url)
    # Remove a URL do orçamento visível e recoloca no fim.
    body = text
    if url:
        body = body.replace(url, "").strip()
    budget = max_len - (weight + 2)
    if budget < 16:
        return url[:max_len] if url else text[:max_len]
    if len(body) > budget:
        body = body[: budget - 1].rstrip(" ,;:-") + "…"
    return f"{body}\n\n{url}" if url else body


def _usable_source(text: str, url: str) -> bool:
    text = (text or "").strip()
    if not text:
        return False
    if has_banned_phrase(text) or looks_smashed(text):
        return False
    return True


def finalize_ig_caption(package: dict[str, str]) -> str:
    url = article_url(package)
    source = str(package.get("caption_ig") or "")
    if _usable_source(source, url):
        return _trim_keep_url(source, url, IG_CAPTION_MAX)
    return _trim_keep_url(lead_from_package(package), url, IG_CAPTION_MAX)


def finalize_threads_text(package: dict[str, str]) -> str:
    url = article_url(package)
    source = str(package.get("threads_x") or "")
    if _usable_source(source, url):
        return _trim_keep_url(source, url, THREADS_TEXT_MAX)
    return _trim_keep_url(lead_from_package(package), url, THREADS_TEXT_MAX)


def finalize_x_text(package: dict[str, str]) -> str:
    """Texto do X: a URL conta 23 caracteres, independente do comprimento real."""
    url = article_url(package)
    source = str(package.get("threads_x") or "")
    if _usable_source(source, url):
        body = source
    else:
        body = lead_from_package(package)
    if url:
        body = body.replace(url, "").strip()
    # Sem pergunta caça-clique no fim.
    sentences = re.split(r"(?<=[.!?…])\s+", body)
    kept = [s for s in sentences if not s.rstrip().endswith("?")]
    body = " ".join(kept).strip() if kept else (sentences[0].rstrip("?").rstrip() + "." if sentences else body)
    budget = X_TEXT_MAX - X_URL_WEIGHT - 2
    if len(body) > budget:
        body = body[: budget - 1].rstrip(" ,;:-") + "…"
    return f"{body}\n\n{url}" if url else body
