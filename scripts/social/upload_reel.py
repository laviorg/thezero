#!/usr/bin/env python3
"""Sobe o MP4 de um Short como asset da release social-reels.

Uso:
    GITHUB_TOKEN=<token do repo> python3 scripts/social/upload_reel.py \
        --slug <slug-da-materia> --file /caminho/para/short.mp4

Depois do upload, dispare o workflow social-post com o mesmo slug (Actions ->
social-post -> Run workflow -> slug). O run.py encontra o MP4 e publica o
Reels no Instagram com a legenda caption_ig do SOCIAL PACKAGE da matéria.
O token precisa de permissão de conteúdo no repo (criar release e assets).
Créditos no formato TASL (creativecommons.org): autor, fonte (URL) e licença de cada imagem.
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from package_parse import SLUG_RE
from reels import publish_reel_asset


def main() -> int:
    parser = argparse.ArgumentParser(description="Sobe o MP4 do Short para virar Reels.")
    parser.add_argument("--slug", required=True, help="slug da matéria (content/posts/<slug>.mdx)")
    parser.add_argument("--file", required=True, help="caminho local do MP4 do Short")
    parser.add_argument(
        "--credits-file",
        help="texto dos créditos das imagens (TASL: autor, fonte, licença); vira <slug>.credits.txt e entra na legenda do Reels",
    )
    parser.add_argument("--repo", default=os.environ.get("REPO") or "laviorg/thezero")
    args = parser.parse_args()
    if not SLUG_RE.match(args.slug):
        print(f"slug inválido: {args.slug}", file=sys.stderr)
        return 2
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    if not token:
        print("GITHUB_TOKEN não está definido.", file=sys.stderr)
        return 2
    secrets = [token]
    credits = Path(args.credits_file) if args.credits_file else None
    if credits is None:
        print("aviso: sem --credits-file o Reels NÃO será publicado (a legenda exige créditos no texto).", file=sys.stderr)
    elif not credits.is_file():
        print(f"créditos não encontrados: {credits}", file=sys.stderr)
        return 2
    try:
        url = publish_reel_asset(args.repo, token, secrets, args.slug, Path(args.file), credits)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    print(f"vídeo disponível em {url}")
    print("agora dispare o workflow social-post com esse slug para publicar o Reels.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
