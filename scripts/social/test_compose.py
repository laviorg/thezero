import tempfile
import unittest
from pathlib import Path

from PIL import Image

from compose_ig_post import FONT_DIR, LOGO_BLACK, LOGO_WHITE, compose, write_jpeg


class ComposeTest(unittest.TestCase):
    def test_assets_exist(self):
        self.assertTrue(LOGO_WHITE.is_file())
        self.assertTrue(LOGO_BLACK.is_file())
        self.assertTrue((FONT_DIR / "DejaVuSans.ttf").is_file())
        self.assertTrue((FONT_DIR / "DejaVuSans-Bold.ttf").is_file())

    def test_square_png_and_jpeg(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            cover = root / "cover.png"
            Image.new("RGB", (1600, 900), (20, 40, 80)).save(cover)
            png = compose(
                cover,
                "China pede a RTX PRO 5500 de 84 GB",
                "O pedido está na The Information. A Reuters não checou.",
                root / "out.png",
                size="1x1",
            )
            with Image.open(png) as image:
                self.assertEqual(image.size, (1080, 1080))
                self.assertEqual(image.format, "PNG")
            jpg = write_jpeg(png, root / "out.jpg")
            data = jpg.read_bytes()
            self.assertTrue(data.startswith(b"\xff\xd8\xff"))
            with Image.open(jpg) as image:
                self.assertEqual(image.size, (1080, 1080))

    def test_four_by_five(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            cover = root / "cover.png"
            Image.new("RGB", (800, 800), (240, 240, 240)).save(cover)
            png = compose(cover, "Hook", "Resumo", root / "out.png", size="4x5")
            with Image.open(png) as image:
                self.assertEqual(image.size, (1080, 1350))

    def test_story_nine_by_sixteen(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            cover = root / "cover.png"
            Image.new("RGB", (1200, 800), (20, 40, 80)).save(cover)
            png = compose(
                cover,
                "IoT: contratos até 2030",
                "Anatel protege contratos elegíveis no Brasil.",
                root / "story.png",
                size="9x16",
                footer="Link na bio\nwww.thezero.com.br/noticia/exemplo",
            )
            with Image.open(png) as image:
                self.assertEqual(image.size, (1080, 1920))
                self.assertEqual(image.format, "PNG")
            jpg = write_jpeg(png, root / "story.jpg")
            with Image.open(jpg) as image:
                self.assertEqual(image.size, (1080, 1920))

    def test_default_feed_is_four_by_five(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            Image.new("RGB", (1600, 900), "white").save(p / "cover.png")
            result = compose(p / "cover.png", "Título com acentuação", "Resumo completo", p / "out.png")
            with Image.open(result) as image:
                self.assertEqual(image.size, (1080, 1350))

    def test_url_wrap_preserves_every_character(self):
        from compose_ig_post import font, wrap_hard
        from PIL import ImageDraw
        d = ImageDraw.Draw(Image.new("RGB", (1080, 1920)))
        f = font(30)
        url = "thezero.com.br/noticia/" + "longo-com-acentos-ação-" * 5
        lines = wrap_hard(d, url, f, 952)
        self.assertEqual("".join(lines), url)
        self.assertTrue(all(d.textlength(line, font=f) <= 952 for line in lines))

    def test_fit_block_fails_instead_of_losing_words(self):
        from compose_ig_post import fit_block
        from PIL import ImageDraw
        d = ImageDraw.Draw(Image.new("RGB", (100, 100)))
        with self.assertRaises(ValueError):
            fit_block(d, "muito texto " * 100, 50, 10, 30, 22, "Regular")

    def test_long_title_never_silently_truncates(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            Image.new("RGB", (1200, 800), "black").save(p / "cover.png")
            with self.assertRaises(ValueError):
                compose(p / "cover.png", "palavra " * 400, "resumo", p / "out.png")

    def test_fallback_font_without_noto(self):
        from unittest.mock import patch
        import compose_ig_post as art
        with tempfile.TemporaryDirectory() as tmp, patch.object(art, "FONT_DIR", Path(tmp)):
            self.assertTrue(art.font(24).getbbox("ação")[2] > 0)

    def test_locked_cover_prefers_clean_original(self):
        from compose_ig_post import resolve_cover_source
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            (p / "cover.jpg").touch()
            (p / "cover.src.webp").touch()
            self.assertEqual(resolve_cover_source(p / "cover.jpg"), p / "cover.src.webp")

    def test_runtime_passes_four_by_five_and_credit(self):
        import run as publisher
        from unittest.mock import patch
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            Image.new("RGB", (1200, 800), "white").save(p / "cover.png")
            with patch.object(publisher, "compose", wraps=compose) as renderer:
                result = publisher.render_art(p, p / "cover.png", "Título", "Resumo", "sample", credit="Autor / Fonte", category="games", date="2026-11-26")
                self.assertEqual(renderer.call_args.kwargs["size"], "4x5")
                self.assertEqual(renderer.call_args.kwargs["credit"], "Autor / Fonte")
            with Image.open(result[0]) as image:
                self.assertEqual(image.size, (1080, 1350))

    def test_runtime_story_has_single_cta(self):
        import run as publisher
        from unittest.mock import patch
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            Image.new("RGB", (1200, 800), "white").save(p / "cover.png")
            with patch.object(publisher, "compose", wraps=compose) as renderer:
                publisher.render_story_art(p, p / "cover.png", "Título", "Resumo", "sample", "https://www.thezero.com.br/noticia/sample", credit="Autor / Fonte")
                self.assertEqual(renderer.call_args.kwargs["footer"], "thezero.com.br/noticia/sample")
                self.assertEqual(renderer.call_args.kwargs["credit"], "Autor / Fonte")

    def test_date_uses_portuguese_month(self):
        import run as publisher
        self.assertEqual(publisher.social_date('---\ndate: "2026-11-26T12:00:00-03:00"\n---\n'), "26 NOV 2026")
        self.assertEqual(publisher.social_date('---\ndate: "invalid"\n---\n'), "")


if __name__ == "__main__":
    unittest.main()
