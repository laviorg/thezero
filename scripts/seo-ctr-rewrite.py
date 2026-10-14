#!/usr/bin/env python3
"""Reescreve seoTitle/seoDescription em lote (CTR, gancho BR só com fatos já na matéria). Uso: python3 scripts/seo-ctr-rewrite.py"""
import re, sys
from pathlib import Path

CHANGES = {
    "ps5-slim-vale-a-pena-2026-brasil": (
        "PS5 Slim vale a pena em 2026? Preço no Brasil e para quem",
        "O PS5 Slim com leitor custa R$ 5.099,90 sugeridos no Brasil desde abril de 2026. Veja quando ainda vale e quando o Digital faz mais sentido."),
    "ios-27-quais-iphones-e-como-atualizar": (
        "iOS 27: lista de iPhones compatíveis e como atualizar",
        "O iOS 27 chega do iPhone 11 e do SE de 2ª geração até o 18 Pro. Veja a lista completa, o que fica de fora da Siri AI e o passo a passo para atualizar."),
    "openai-pausa-modelos-capazes-furo-dns": (
        "OpenAI pausa modelos mais capazes após agente furar o DNS",
        "Relatório da OpenAI diz que um agente furou o DNS, o alarme veio 11 min depois e o corte automático falhou. A pausa dos modelos com ferramenta continua."),
    "beats-360-almofada-trocavel-sem-preco-br": (
        "Beats 360: preço no Brasil, US$ 349,99 e almofada trocável",
        "O Beats 360 custa US$ 349,99 nos EUA e troca a almofada. Os R$ 1.800 que circulam são conversão de câmbio: a Apple Brasil ainda não tem preço oficial."),
    "one-ui-9-quais-galaxy-e-como-atualizar": (
        "One UI 9: quais Galaxy recebem no Brasil e como atualizar",
        "A Samsung começou a One UI 9 pelo Galaxy S26 e diz que o Brasil recebe em breve. Veja quais Galaxy entram, o que já tem a estável e como atualizar."),
    "retroid-pocket-5-custo-beneficio": (
        "Retroid Pocket 5 vale a pena? Preço para importar ao Brasil",
        "O Retroid Pocket 5 sai na casa dos US$ 219 fora frete, com Snapdragon 865 e OLED de 5,5 polegadas. Veja o que roda, até Switch leve, e quanto pesa importar."),
    "ea-sports-fc-27-vale-a-pena": (
        "EA Sports FC 27 vale a pena? Preço em reais por plataforma",
        "EA Sports FC 27 Standard a partir de R$ 299 na Steam e no Switch e R$ 349 no PS5, Xbox e Switch 2. Veja as diferenças entre edições e plataformas."),
    "gpd-win-mini-7-ryzen": (
        "GPD Win Mini: Ryzen e tela de 7 pol. no Brasil, importado",
        "O GPD Win Mini é um PC portátil Ryzen em concha, com tela de 7 polegadas a 120 Hz e cerca de 555 g. No Brasil só chega importado: veja para quem vale."),
    "motorola-vs-samsung-intermediario": (
        "Motorola ou Samsung intermediário: qual comprar no Brasil",
        "Samsung intermediário atualiza por mais tempo e acerta a câmera; Motorola carrega mais rápido e muitas vezes custa menos. Compare e veja qual comprar no Brasil."),
    "iphone-18-pro-brasil-hoje-preco": (
        "iPhone 18 Pro: preço no Brasil a partir de R$ 11.999",
        "O iPhone 18 Pro chega ao Brasil a partir de R$ 11.999 (256 GB) e o Pro Max 2 TB vai a R$ 21.999. Veja preços por versão e o que mudou na câmera."),
    "pixel-no-brasil-quando-importar": (
        "Google Pixel no Brasil: vale a pena importar em 2026?",
        "O Google não vende Pixel no Brasil. Veja quando importar ainda compensa: imposto da remessa, bandas, eSIM e a falta de assistência local."),
    "nothing-phone-brasil-preco-updates": (
        "Nothing Phone no Brasil: Anatel, updates e garantia",
        "A Nothing ainda não vende celular oficialmente no Brasil. Homologação na Anatel não é lançamento: veja o que muda em updates e garantia no importado."),
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
