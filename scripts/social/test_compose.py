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


if __name__ == "__main__":
    unittest.main()
