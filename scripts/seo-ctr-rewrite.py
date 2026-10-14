#!/usr/bin/env python3
"""Reescreve seoTitle/seoDescription em lote (CTR, gancho BR só com fatos já na matéria). Uso: python3 scripts/seo-ctr-rewrite.py"""
import re, sys
from pathlib import Path

CHANGES = {
    "xiaomi-18-pro-max-china": (
        "Xiaomi 18 Pro Max: preço na China e previsão no Brasil",
        "O Xiaomi 18 Pro Max sai na China a partir de 6.999 yuan, com 8.500 mAh e Snapdragon Extreme. Veja o que se sabe sobre preço e data no Brasil."),
    "gemini-hackeou-tres-empresas-teste": (
        "Gemini entrou em 3 empresas em teste, confirma a Google",
        "A Google confirmou que o Gemini acessou sistemas de três empresas reais num teste de cibersegurança. Entenda a falha de isolamento e o que mudou."),
    "minecraft-the-sift-quarta-dimensao-2027": (
        "Minecraft The Sift: data da nova dimensão no Java e Bedrock",
        "The Sift, 1ª dimensão nova do Minecraft em mais de 14 anos, chega ao Java e ao Bedrock em 2027. No Minecraft Dungeons II, ela estreou em 29 de setembro."),
}
ok = True
for slug, (t, d) in CHANGES.items():
    if len(t) > 59 or not (110 <= len(d) <= 160):
        print(f"FORA DO LIMITE {slug}: title={len(t)} desc={len(d)}"); ok = False; continue
    f = Path("content/posts") / f"{slug}.mdx"
    s = f.read_text()
    fm_end = s.index("\n---", 4)
    fm, body = s[:fm_end], s[fm_end:]
    for k, v in (("seoTitle", t), ("seoDescription", d)):
        line = f'{k}: "{v}"'
        fm, n = re.subn(rf"^{k}:.*$", line, fm, count=1, flags=re.M)
        if not n:
            fm = re.sub(r"^(title:.*)$", rf"\1\n{line}", fm, count=1, flags=re.M)
    f.write_text(fm + body)
    print(f"ok {slug}: {len(t)}/{len(d)}")
sys.exit(0 if ok else 1)
