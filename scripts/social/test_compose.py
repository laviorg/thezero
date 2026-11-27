import tempfile
import unittest
from pathlib import Path

from PIL import Image

from compose_ig_post import FONT_DIR, LOGO_BLACK, LOGO_WHITE, compose, write_jpeg, _wrap_footer, _font


class ComposeTest(unittest.TestCase):
    def test_photo_shading_has_no_hard_horizontal_edge(self):
        # A flat cover makes any artificial horizontal seam measurable.
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            cover = root / "white.png"
            Image.new("RGB", (1600, 1600), "white").save(cover)
            for size in ("1x1", "4x5", "9x16"):
                with self.subTest(size=size):
                    out = compose(cover, "", "", root / (size + ".png"), size=size)
                    with Image.open(out) as im:
                        values = [im.getpixel((0, y))[0] for y in range(im.height)]
                        self.assertLessEqual(max(abs(b - a) for a, b in zip(values, values[1:])), 2)
                        self.assertEqual(values[int(im.height * 0.15)], values[0])
                        self.assertGreaterEqual(values[0], 225)
                        self.assertLessEqual(values[int(im.height * 0.65)], 100)
                        self.assertLessEqual(values[-1], 16)
                        self.assertTrue(all(b <= a for a, b in zip(values, values[1:])))

    def test_long_url_is_preserved_and_stays_inside_safe_width(self):
        from PIL import ImageDraw
        probe = ImageDraw.Draw(Image.new("RGB", (1080, 1920)))
        url = "thezero.com.br/noticia/grave-mistakes-lancamento-pc-portugues"
        lines = _wrap_footer(probe, url, _font(34), 820)
        self.assertGreater(len(lines), 1)
        self.assertEqual("".join(lines), url)
        self.assertTrue(all(probe.textlength(line, font=_font(34)) <= 820 for line in lines))

    def test_huge_footer_fails_instead_of_cutting_or_overlapping(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            cover = root / "cover.png"
            Image.new("RGB", (1600, 900), "white").save(cover)
            with self.assertRaises(ValueError):
                compose(cover, "Título", "Resumo", root / "out.png", size="9x16", footer="x" * 20000)

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


if __name__ == "__main__":
    unittest.main()
