"""Redige segredos antes de qualquer log. Nunca imprime token."""

from __future__ import annotations

import re
from urllib.parse import quote

_ASSIGNMENT = re.compile(
    r"(access_token|refresh_token|client_secret|encrypted_value|ghp_|github_pat_)([=:\s]+)(\S+)",
    re.IGNORECASE,
)
_BEARER = re.compile(r"(bearer\s+)\S+", re.IGNORECASE)
_AUTH_HEADER = re.compile(r"(AUTHORIZATION:\s*bearer\s+)\S+", re.IGNORECASE)


def redact(text: str, secrets: list[str] | None = None) -> str:
    if not text:
        return ""
    out = text
    for secret in secrets or []:
        if not secret or len(secret) < 6:
            continue
        out = out.replace(secret, "[REDACTED]")
        encoded = quote(secret, safe="")
        if encoded and encoded != secret:
            out = out.replace(encoded, "[REDACTED]")
    out = _ASSIGNMENT.sub(r"\1\2[REDACTED]", out)
    out = _BEARER.sub(r"\1[REDACTED]", out)
    out = _AUTH_HEADER.sub(r"\1[REDACTED]", out)
    return out
