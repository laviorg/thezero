"""Lê o bloco SOCIAL PACKAGE do corpo de um PR.

O formato real é uma lista Markdown com escalares `|` do YAML. O parser também
aceita chave em negrito, cerca de código e o título com ou sem heading.
"""

from __future__ import annotations

import re

KEYS = {
    "slug",
    "url",
    "cover_path",
    "hook",
    "summary",
    "caption_ig",
    "threads_x",
    "compose_cmd",
}
REQUIRED = (
    "slug",
    "url",
    "cover_path",
    "hook",
    "summary",
    "caption_ig",
    "threads_x",
)
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
IG_CAPTION_MAX = 2200
THREADS_TEXT_MAX = 500

_KEY_LINE = re.compile(
    r"^(?P<indent>[ \t]*)(?:[-*+]\s+)?"
    r"(?:\*\*|__)?(?P<key>[A-Za-z][A-Za-z0-9_]*)(?:\*\*|__)?"
    r"\s*:\s*(?:\*\*|__)?\s*(?P<rest>.*)$"
)


def extract_section(text: str, title: str) -> str | None:
    """Devolve o miolo da seção, ou None se o título não aparece numa linha só."""
    if not text:
        return None
    start_re = re.compile(
        rf"^\s*(?:#{{1,6}}\s*)?(?:\*\*|__)?{re.escape(title)}(?:\*\*|__)?\b.*$",
        re.IGNORECASE,
    )
    stop_title = re.compile(
        r"^[ \t]{0,3}(?:#{1,6}\s*)?(?:\*\*|__)?(?:SOCIAL PACKAGE|FACT-CHECK)\b",
        re.IGNORECASE,
    )
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    start = None
    for index, line in enumerate(lines):
        if start_re.match(line.rstrip()):
            start = index
            break
    if start is None:
        return None
    body: list[str] = []
    for line in lines[start + 1 :]:
        if re.match(r"^\s*#{1,2}\s+\S", line):
            break
        if stop_title.match(line) and title.lower() not in line.lower():
            break
        if re.match(r"^\s*<!--", line):
            break
        body.append(line)
    return "\n".join(body)


def parse_fields(section: str) -> dict[str, str]:
    lines = section.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    fields: dict[str, str] = {}
    index = 0
    while index < len(lines):
        match = _KEY_LINE.match(lines[index])
        if not match or match.group("key").lower() not in KEYS:
            index += 1
            continue
        key = match.group("key").lower()
        rest = match.group("rest").strip()
        base_indent = len(match.group("indent").replace("\t", "    "))
        if rest in {"|", ">", "|-", ">-", "|+", ">+"}:
            folded = rest.startswith(">")
            block: list[str] = []
            index += 1
            while index < len(lines):
                nxt = lines[index]
                if nxt.strip() == "":
                    block.append("")
                    index += 1
                    continue
                indent = len(nxt.replace("\t", "    ")) - len(nxt.replace("\t", "    ").lstrip(" "))
                key_match = _KEY_LINE.match(nxt)
                if indent <= base_indent and key_match and key_match.group("key").lower() in KEYS:
                    break
                if indent <= base_indent:
                    break
                block.append(nxt.strip())
                index += 1
            text = "\n".join(block).strip()
            if folded:
                text = re.sub(r"[ \t]*\n[ \t]*", " ", text).strip()
            fields[key] = text
            continue
        if len(rest) >= 2 and rest[0] == rest[-1] and rest[0] in {'"', "'"}:
            rest = rest[1:-1]
        fields[key] = rest.strip()
        index += 1
    return fields


def parse_social_package(text: str) -> dict[str, str] | None:
    """None quando o PR não tem o bloco. Dict (talvez incompleto) quando tem."""
    section = extract_section(text or "", "SOCIAL PACKAGE")
    if section is None:
        return None
    return parse_fields(section)


def validate_package(fields: dict[str, str], expected_slug: str | None = None) -> list[str]:
    errors: list[str] = []
    for key in REQUIRED:
        if not str(fields.get(key, "")).strip():
            errors.append(f"SOCIAL PACKAGE sem {key}.")
    slug = str(fields.get("slug", "")).strip()
    if slug and not SLUG_RE.match(slug):
        errors.append(f"slug inválido: {slug}.")
    if slug and expected_slug and slug != expected_slug:
        errors.append(
            f"SOCIAL PACKAGE slug {slug} não bate com o arquivo {expected_slug}."
        )
    url = str(fields.get("url", "")).strip()
    if slug and url and f"/noticia/{slug}" not in url:
        errors.append("url do SOCIAL PACKAGE não contém /noticia/<slug>.")
    caption = str(fields.get("caption_ig", ""))
    threads = str(fields.get("threads_x", ""))
    if caption and len(caption) > IG_CAPTION_MAX:
        errors.append(
            f"caption_ig tem {len(caption)} caracteres (máximo {IG_CAPTION_MAX})."
        )
    if threads and len(threads) > THREADS_TEXT_MAX:
        errors.append(
            f"threads_x tem {len(threads)} caracteres (máximo {THREADS_TEXT_MAX})."
        )
    return errors
