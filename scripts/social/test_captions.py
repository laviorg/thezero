import unittest

from captions import (
    finalize_ig_caption,
    finalize_threads_text,
    finalize_x_text,
    has_banned_phrase,
    lead_from_package,
    looks_smashed,
)


PKG = {
    "slug": "anatel-pgmc-iot-contratos-multirrede",
    "url": "https://www.thezero.com.br/noticia/anatel-pgmc-iot-contratos-multirrede",
    "hook": "IoT: contratos até 2030",
    "summary": "Anatel protege contratos elegíveis e limita restrições à multirrede. Não é roaming grátis.",
    "caption_ig": (
        "Anatel anunciou10nov revisãoPGMC para máquinas conectadas. Contratos elegíveis.\n\n"
        "https://www.thezero.com.br/noticia/anatel-pgmc-iot-contratos-multirrede"
    ),
    "threads_x": (
        "AnatelrevêPGMC: protege contratos elegíveisM2M/IoTaté2030.\n\n"
        "https://www.thezero.com.br/noticia/anatel-pgmc-iot-contratos-multirrede"
    ),
}


class CaptionsTest(unittest.TestCase):
    def test_smashed_package_falls_back_to_hook_summary(self):
        self.assertTrue(looks_smashed(PKG["caption_ig"]))
        caption = finalize_ig_caption(PKG)
        self.assertIn("IoT: contratos até 2030", caption)
        self.assertIn("Anatel protege contratos elegíveis", caption)
        self.assertTrue(caption.strip().endswith(PKG["url"]))
        self.assertNotIn("revisãoPGMC", caption)
        self.assertNotIn("anunciou10nov", caption)

    def test_clean_caption_is_kept(self):
        package = {
            **PKG,
            "caption_ig": (
                "A Anatel protege contratos de IoT elegíveis até 2030 no Brasil.\n\n"
                + PKG["url"]
            ),
        }
        self.assertEqual(
            finalize_ig_caption(package),
            "A Anatel protege contratos de IoT elegíveis até 2030 no Brasil.\n\n" + PKG["url"],
        )

    def test_clickbait_and_ai_mentions_are_rejected(self):
        self.assertTrue(has_banned_phrase("Você não vai acreditar no que a Anatel fez"))
        self.assertTrue(has_banned_phrase("Texto gerado por IA no Instinct"))
        package = {
            **PKG,
            "caption_ig": "Você não vai acreditar: a Anatel mudou o PGMC.\n\n" + PKG["url"],
        }
        caption = finalize_ig_caption(package)
        self.assertNotIn("não vai acreditar", caption.lower())
        self.assertIn(PKG["url"], caption)

    def test_x_budget_counts_url_as_23(self):
        package = {
            **PKG,
            "threads_x": "",
            "summary": "B" * 400,
        }
        text = finalize_x_text(package)
        # URL no fim; o corpo respeita 280 com a URL valendo 23.
        self.assertTrue(text.endswith(PKG["url"]))
        body, _, url = text.rpartition("\n\n")
        self.assertEqual(url, PKG["url"])
        self.assertLessEqual(len(body) + 23 + 2, 280)

    def test_lead_from_package(self):
        self.assertTrue(lead_from_package(PKG).startswith("IoT: contratos até 2030."))


if __name__ == "__main__":
    unittest.main()
