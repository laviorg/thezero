#!/usr/bin/env python3
"""Compose The Zero Instagram post art, layout v2.

Mudanças em relação ao compositor original:
- Fundo de marca escuro com gradiente + brilho azul discreto (foto não cobre mais a tela toda).
- Foto em card com cantos arredondados, sombra suave e borda fina.
- Tipografia Noto Sans (ExtraBold título / Regular resumo) com fallback DejaVu.
- Pílula de categoria (azul da marca) opcional; sem etiqueta amarela "FOTO DE DIVULGAÇÃO"
  (removida a pedido de Nicholas, 2026-11-26 22:23; cautelas de imagem sintética seguem na legenda).
- Crédito discreto da imagem (opcional, parâmetro --credit).
- Feed passa a 4:5 (1080x1350); 1:1 e 9:16 continuam suportados.
- Story: CTA em pílula + URL com quebra por caractere (corrige overflow lateral).
- Logo sempre o branco oficial (fundo sempre escuro por construção).

CLI compatível com o compositor anterior: --cover --hook --summary --out --size --footer,
mais opcionais --credit --category --date.
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

def resolve_cover_source(cover_path):
    """Capa travada (cover_locked): usa o original sem marca `cover.src.*` ao lado,
    se existir. Ver docs/cover-lock.md."""
    p = Path(cover_path)
    for ext in (".webp", ".jpg", ".jpeg", ".png"):
        src = p.with_name(p.stem + ".src" + ext)
        if src.exists():
            return src
    return p

DIR = Path(__file__).resolve().parent
ASSETS = DIR / "assets"
FONT_DIR = ASSETS / "fonts"
LOGO_WHITE = ASSETS / "logo-the-zero-white.png"
LOGO_BLACK = ASSETS / "logo-the-zero-black.png"

SIZES = {
    "1x1": (1080, 1080),
    "4x5": (1080, 1350),
    "9x16": (1080, 1920),
}

# Paleta aprovada (alinhada ao site, src/app/globals.css)
BG_TOP = (10, 11, 16)
BG_BOTTOM = (6, 7, 10)
BLUE = (37, 99, 235)       # #2563EB — marca
BLUE_SOFT = (96, 140, 250)
WHITE = (250, 250, 250)
MUTE = (170, 176, 190)
FAINT = (120, 126, 142)
YELLOW = (250, 204, 21)    # apenas CTA
INK = (20, 20, 20)

TYPE = {
    # hook = título, summary = resumo, pill = categoria, small = crédito/rodapé
    "1x1": {"hook": 56, "summary": 30, "pill": 28, "small": 26, "cta": 30,
            "hook_lh": 68, "sum_lh": 40, "photo_h": 340},
    "4x5": {"hook": 64, "summary": 33, "pill": 30, "small": 26, "cta": 30,
            "hook_lh": 78, "sum_lh": 46, "photo_h": 560},
    "9x16": {"hook": 70, "summary": 36, "pill": 32, "small": 26, "cta": 34,
             "hook_lh": 84, "sum_lh": 50, "photo_h": 620},
}

_WEIGHTS = {
    "Black": ("NotoSans-Black.ttf", "DejaVuSans-Bold.ttf"),
    "ExtraBold": ("NotoSans-ExtraBold.ttf", "DejaVuSans-Bold.ttf"),
    "Bold": ("NotoSans-Bold.ttf", "DejaVuSans-Bold.ttf"),
    "SemiBold": ("NotoSans-SemiBold.ttf", "DejaVuSans-Bold.ttf"),
    "Medium": ("NotoSans-Medium.ttf", "DejaVuSans.ttf"),
    "Regular": ("NotoSans-Regular.ttf", "DejaVuSans.ttf"),
}

def font(size: int, weight: str = "Bold"):
    for name in _WEIGHTS.get(weight, _WEIGHTS["Bold"]):
        for base in (FONT_DIR, Path("/usr/share/fonts/truetype/noto"),
                     Path("/usr/share/fonts/truetype/dejavu")):
            p = base / name
            if p.exists():
                return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()

def _tracked_w(d, text, f, tracking=2):
    if not text:
        return 0
    return sum(d.textlength(c, font=f) for c in text) + tracking * (len(text) - 1)

def _tracked(d, xy, text, f, fill, tracking=2):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill)
        x += d.textlength(ch, font=f) + tracking

def pill(d, xy, text, f, fill, fg, pad=(22, 10), tracking=2):
    x, y = xy
    tw = _tracked_w(d, text, f, tracking)
    asc, desc = f.getmetrics()
    w_box = int(tw + pad[0] * 2)
    h_box = asc + desc + pad[1] * 2
    d.rounded_rectangle([x, y, x + w_box, y + h_box], radius=h_box // 2, fill=fill)
    _tracked(d, (x + pad[0], y + pad[1] + asc // 8), text, f, fg, tracking)
    return w_box, h_box

def wrap(d, t, f, maxw):
    out, cur = [], ""
    for w_ in t.split():
        x = (cur + " " + w_).strip()
        if d.textlength(x, font=f) > maxw and cur:
            out.append(cur); cur = w_
        else:
            cur = x
    if cur:
        out.append(cur)
    return out

def wrap_hard(d, t, f, maxw):
    """Wrap all text, including an unbroken URL, without dropping characters."""
    lines, cur = [], ""
    for word in t.split():
        trial = (cur + " " + word).strip()
        if d.textlength(trial, font=f) <= maxw:
            cur = trial
            continue
        if cur:
            lines.append(cur)
            cur = ""
        for ch in word:
            if d.textlength(cur + ch, font=f) > maxw and cur:
                lines.append(cur)
                cur = ""
            cur += ch
    if cur:
        lines.append(cur)
    return lines


def fit_block(d, text, maxw, maxh, start, minimum, weight, hard=False):
    """Fail rather than silently truncate editorial text."""
    for size in range(start, minimum - 1, -1):
        f = font(size, weight)
        lines = wrap_hard(d, text, f, maxw) if hard else wrap(d, text, f, maxw)
        lh = int(size * 1.23)
        if all(d.textlength(line, font=f) <= maxw for line in lines) and len(lines) * lh <= maxh:
            return f, lines, lh
    raise ValueError("Texto não cabe com leitura segura; encurte o texto editorialmente")

def _vgrad(size, top, bottom):
    w, h = size
    base = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(1, h - 1)
        base.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return base.resize((w, h))

def _glow(size, color=BLUE, alpha=70, pos=(0.88, 0.05), radius=0.55):
    w, h = size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = int(w * pos[0]), int(h * pos[1])
    r = int(min(w, h) * radius)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))
    return layer.filter(ImageFilter.GaussianBlur(min(w, h) // 4))

def _cover_fit(cover, width, height):
    img = cover.convert("RGB")
    scale = max(width / img.width, height / img.height)
    img = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
    left = (img.width - width) // 2
    top = (img.height - height) // 2
    return img.crop((left, top, left + width, top + height))

def _photo_card(base, photo, box, radius=32):
    x, y, w, h = box
    sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([x, y + 14, x + w, y + h + 14], radius=radius, fill=(0, 0, 0, 170))
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(24)))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w, h], radius=radius, fill=255)
    base.paste(_cover_fit(photo, w, h), (x, y), mask)
    ImageDraw.Draw(base).rounded_rectangle([x, y, x + w, y + h], radius=radius,
                                           outline=(255, 255, 255, 30), width=2)

def compose(
    cover_path: Path,
    hook: str,
    summary: str,
    out: Path,
    size: str = "4x5",
    footer: str | None = None,
    credit: str | None = None,
    category: str | None = None,
    date: str | None = None,
) -> Path:
    if size not in SIZES:
        raise ValueError(f"tamanho inválido: {size}")
    typo = TYPE[size]
    width, height = SIZES[size]
    vertical = size == "9x16"

    safe_x = 64
    top_y = 150 if vertical else 60
    max_text_w = width - 2 * safe_x

    canvas = _vgrad((width, height), BG_TOP, BG_BOTTOM).convert("RGBA")
    canvas.alpha_composite(_glow((width, height), pos=(0.88, 0.05 if not vertical else 0.02)))

    logo_img = Image.open(LOGO_WHITE).convert("RGBA")
    lw = 240 if vertical else 230
    logo_img = logo_img.resize((lw, int(logo_img.height * lw / logo_img.width)), Image.Resampling.LANCZOS)
    canvas.paste(logo_img, (safe_x, top_y), logo_img)

    probe = Image.new("RGBA", (8, 8))
    d = ImageDraw.Draw(probe)
    if date and not vertical:
        df = font(26, "SemiBold")
        ImageDraw.Draw(canvas).text((width - safe_x - d.textlength(date, font=df), top_y + 28),
                                    date, font=df, fill=FAINT)
    d = ImageDraw.Draw(canvas)

    # foto em card
    photo_y = top_y + (150 if vertical else 110)
    photo_h = typo["photo_h"]
    photo = Image.open(resolve_cover_source(cover_path))
    _photo_card(canvas, photo, (safe_x, photo_y, width - 2 * safe_x, photo_h))
    d = ImageDraw.Draw(canvas)

    y = photo_y + photo_h + (70 if vertical else 62)
    if category:
        pill(d, (safe_x, y), category.upper(), font(typo["pill"]), BLUE + (255,), WHITE,
             pad=(26, 10))
        y += font(typo["pill"]).getmetrics()[0] + font(typo["pill"]).getmetrics()[1] + 20 + 34

    # Reserve footer space first, then fit every word of hook and summary.
    text_bottom = height - (360 if vertical else 140)
    available = text_bottom - y
    fitted = None
    for hs in range(typo["hook"], 35, -1):
        hf = font(hs, "ExtraBold")
        hl = wrap(d, hook, hf, max_text_w)
        lh = int(hs * 1.22)
        if any(d.textlength(line, font=hf) > max_text_w for line in hl):
            continue
        for ss in range(typo["summary"], 21, -1):
            sf = font(ss, "Regular")
            sl = wrap(d, summary, sf, max_text_w)
            sh = int(ss * 1.32)
            if any(d.textlength(line, font=sf) > max_text_w for line in sl):
                continue
            if len(hl) * lh + 16 + len(sl) * sh <= available:
                fitted = hf, hl, lh, sf, sl, sh
                break
        if fitted:
            break
    if not fitted:
        raise ValueError("Título e resumo não cabem; encurte editorialmente, sem cortar palavras")
    hf, hl, lh, sf, sl, sh = fitted
    for line in hl:
        d.text((safe_x, y), line, font=hf, fill=WHITE)
        y += lh
    y += 16
    for line in sl:
        d.text((safe_x, y), line, font=sf, fill=MUTE)
        y += sh

    if vertical:
        cy = height - 330
        if footer:
            pill(d, (safe_x, cy), "LINK NA BIO", font(typo["cta"]), YELLOW + (255,), INK,
                 pad=(30, 14))
            uf, ul, uh = fit_block(d, str(footer), max_text_w, 95, 30, 22, "Medium", hard=True)
            uy = cy + 96
            for line in ul:
                d.text((safe_x, uy), line, font=uf, fill=BLUE_SOFT)
                uy += uh
        if credit:
            cf, cl, ch = fit_block(d, credit, max_text_w, 65, typo["small"], 20, "Regular", hard=True)
            for i, line in enumerate(cl):
                d.text((safe_x, height - 130 + i * ch), line, font=cf, fill=MUTE)
    else:
        d.line([safe_x, height - 110, width - safe_x, height - 110], fill=(255, 255, 255, 26), width=2)
        d.text((safe_x, height - 78), "thezero.com.br", font=font(30, "Bold"), fill=BLUE_SOFT)
        if credit:
            cf, cl, ch = fit_block(d, credit, 630, 70, typo["small"], 20, "Regular", hard=True)
            for i, line in enumerate(cl):
                d.text((width - safe_x - d.textlength(line, font=cf), height - 78 + i * ch),
                       line, font=cf, fill=MUTE)

    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    return out

def write_jpeg(png_path: Path, jpg_path: Path) -> Path:
    """JPEG 4:4:4 que a API de conteúdo do Instagram aceita."""
    jpg_path = Path(jpg_path)
    jpg_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(png_path) as image:
        image.convert("RGB").save(jpg_path, "JPEG", quality=92, optimize=True, subsampling=0)
    return jpg_path

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cover", required=True)
    parser.add_argument("--hook", required=True)
    parser.add_argument("--summary", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--size", choices=list(SIZES), default="4x5")
    parser.add_argument("--footer", default="", help="URL exibida sob o CTA (arte 9:16).")
    parser.add_argument("--credit", default="", help="Crédito discreto da imagem (ex.: 'Foto: Autor / Fonte').")
    parser.add_argument("--category", default="", help="Rótulo da pílula de categoria (ex.: GAMES).")
    parser.add_argument("--date", default="", help="Data curta no topo direito do feed (ex.: 26 NOV 2026).")
    args = parser.parse_args()
    print(compose(
        Path(args.cover), args.hook, args.summary, Path(args.out),
        size=args.size,
        footer=args.footer or None,
        credit=args.credit or None,
        category=args.category or None,
        date=args.date or None,
    ))

if __name__ == "__main__":
    main()
