"""Decide se um slug já foi publicado. O arquivo em si vive na branch social-ledger."""

from __future__ import annotations


def empty_ledger() -> dict:
    return {"version": 1, "posts": {}}


def entry_complete(entry: dict | None) -> bool:
    if not entry:
        return False
    return bool(str(entry.get("ig") or "").strip()) and bool(str(entry.get("threads") or "").strip())


def text_matches_article(text: str, slug: str, article_url: str) -> bool:
    if not text:
        return False
    if article_url and article_url in text:
        return True
    needle = f"/noticia/{slug}"
    return needle in text


def find_permalink(posts: list[dict], slug: str, article_url: str, field: str) -> str:
    for post in posts:
        if text_matches_article(str(post.get(field) or ""), slug, article_url):
            permalink = str(post.get("permalink") or "").strip()
            if permalink:
                return permalink
    return ""


def resolve_existing(
    slug: str,
    article_url: str,
    ledger: dict,
    ig_posts: list[dict],
    threads_posts: list[dict],
) -> dict:
    """Junta o ledger com a checagem das publicações recentes."""
    posts = ledger.get("posts") if isinstance(ledger, dict) else None
    current = {}
    if isinstance(posts, dict) and isinstance(posts.get(slug), dict):
        current = dict(posts[slug])
    if not str(current.get("ig") or "").strip():
        found = find_permalink(ig_posts, slug, article_url, "caption")
        if found:
            current["ig"] = found
    if not str(current.get("threads") or "").strip():
        found = find_permalink(threads_posts, slug, article_url, "text")
        if found:
            current["threads"] = found
    current["slug"] = slug
    if article_url:
        current["article_url"] = article_url
    return current
