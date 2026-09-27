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
