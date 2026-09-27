#!/usr/bin/env python3
"""Compose The Zero Instagram post art.

Default 1080x1080 (1:1). Optional --size 4x5 for 1080x1350.

Rules:
- Cover as background (cover crop / center)
- Hook + summary over dark scrim
- Logo ONLY logo-the-zero-white.png or logo-the-zero-black.png (alpha)
- SAFE_X / SAFE_BOTTOM large enough for IG chrome + grid crop
- No black plate behind wordmark
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

DIR = Path(__file__).resolve().parent
ASSETS = DIR / "assets"
FONT_DIR = ASSETS / "fonts"
LOGO_WHITE = ASSETS / "logo-the-zero-white.png"
LOGO_BLACK = ASSETS / "logo-the-zero-black.png"

SIZES = {
    "1x1": (1080, 1080),
    "4x5": (1080, 1350),
}


def _font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    candidates = [
        FONT_DIR / name,
        Path("/usr/share/fonts/truetype/dejavu") / name,
        Path("/usr/share/fonts/truetype/liberation")
        / ("LiberationSans-Bold.ttf" if bold else "LiberationSans-Regular.ttf"),
        Path("/usr/share/fonts/truetype/freefont")
        / ("FreeSansBold.ttf" if bold else "FreeSans.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def _wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_w: int) -> list[str]:
    words = text.strip().split()
    if not words:
        return []
    lines: list[str] = []
    cur = words[0]
    for word in words[1:]:
        trial = f"{cur} {word}"
        if draw.textbbox((0, 0), trial, font=font)[2] <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    lines.append(cur)
    return lines


def _cover_fit(cover: Image.Image, width: int, height: int) -> Image.Image:
    img = cover.convert("RGB")
    scale = max(width / img.width, height / img.height)
    resized = (
        int(img.width * scale),
        int(img.height * scale),
    )
    img = img.resize(resized, Image.Resampling.LANCZOS)
    left = (resized[0] - width) // 2
    top = (resized[1] - height) // 2
    return img.crop((left, top, left + width, top + height))


def compose(
    cover_path: Path,
    hook: str,
    summary: str,
    out: Path,
    size: str = "1x1",
) -> Path:
    width, height = SIZES[size]
    # ~12% sides, ~14% bottom — matches Extensões anti-crop lesson
    safe_x = max(130, int(width * 0.12))
    safe_bottom = max(150, int(height * 0.14))
    safe_top = max(80, int(height * 0.08))

    base = _cover_fit(Image.open(cover_path), width, height)
    base = ImageEnhance.Brightness(base).enhance(0.90)

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    start = int(height * 0.35)
    for y in range(start, height):
        t = (y - start) / max(1, height - start)
        alpha = int(50 + 190 * (t ** 1.05))
        draw.line([(0, y), (width, y)], fill=(0, 0, 0, alpha))

    canvas = Image.alpha_composite(base.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(canvas)

    max_text_w = width - 2 * safe_x
    hook_font = _font(50 if size == "1x1" else 54, bold=True)
    sum_font = _font(28 if size == "1x1" else 32, bold=False)

    hook_lines = _wrap(draw, hook, hook_font, max_text_w)
    sum_lines = _wrap(draw, summary, sum_font, max_text_w)

    line_h_hook = 58 if size == "1x1" else 62
    line_h_sum = 36 if size == "1x1" else 40
    block_h = len(hook_lines) * line_h_hook + 14 + len(sum_lines) * line_h_sum

    region = canvas.crop((width - 320, height - safe_bottom - 20, width - safe_x, height - 60))
    gray = region.convert("L")
    histogram = gray.histogram()
    avg = sum(index * count for index, count in enumerate(histogram)) / (gray.width * gray.height)
    logo_path = LOGO_WHITE if avg < 140 else LOGO_BLACK
    if not logo_path.exists():
        raise FileNotFoundError(f"Missing logo: {logo_path}")
    logo = Image.open(logo_path).convert("RGBA")
    target_w = 200
    ratio = target_w / logo.width
    logo = logo.resize((target_w, int(logo.height * ratio)), Image.Resampling.LANCZOS)
    lx = width - safe_x - logo.width
    ly = height - safe_bottom - logo.height
    if ly < safe_top:
        ly = safe_top

    y = ly - 28 - block_h
    y = max(safe_top + int(height * 0.28), y)

    for line in hook_lines:
        draw.text((safe_x + 2, y + 2), line, font=hook_font, fill=(0, 0, 0, 160))
        draw.text((safe_x, y), line, font=hook_font, fill=(255, 255, 255, 255))
        y += line_h_hook
    y += 12
    for line in sum_lines:
        draw.text((safe_x + 1, y + 1), line, font=sum_font, fill=(0, 0, 0, 140))
        draw.text((safe_x, y), line, font=sum_font, fill=(230, 230, 235, 255))
        y += line_h_sum

    canvas.alpha_composite(logo, (lx, ly))

    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    return out


def write_jpeg(png_path: Path, jpg_path: Path) -> Path:
    """JPEG 4:4:4 que a API de conteúdo do Instagram aceita."""
    jpg_path = Path(jpg_path)
    jpg_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(png_path) as image:
        image.convert("RGB").save(
            jpg_path,
            "JPEG",
            quality=92,
            optimize=True,
            subsampling=0,
        )
    return jpg_path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cover", required=True)
    parser.add_argument("--hook", required=True)
    parser.add_argument("--summary", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--size", choices=list(SIZES), default="1x1")
    args = parser.parse_args()
    path = compose(Path(args.cover), args.hook, args.summary, Path(args.out), size=args.size)
    print(path)


if __name__ == "__main__":
    main()
