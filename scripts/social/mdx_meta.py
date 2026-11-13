"""Leitura mínima do frontmatter para decidir se a matéria entra no ar."""

from __future__ import annotations

import re

_DRAFT = re.compile(r"^draft:\s*(?:true|[\"']true[\"'])\s*$", re.MULTILINE)


def is_draft_mdx(text: str) -> bool:
    if not text.startswith("---"):
        return False
    end = text.find("\n---", 3)
    frontmatter = text[3:end] if end != -1 else text
    return _DRAFT.search(frontmatter) is not None


def frontmatter_value(text: str, key: str) -> str:
    """Devolve o escalar de uma chave do frontmatter, ou string vazia."""
    if not text.startswith("---"):
        return ""
    end = text.find("\n---", 3)
    if end == -1:
        return ""
    frontmatter = text[3:end]
    match = re.search(rf"^{re.escape(key)}:\s*(.*)$", frontmatter, re.MULTILINE)
    if not match:
        return ""
    value = match.group(1).strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        value = value[1:-1]
    return value.strip()

