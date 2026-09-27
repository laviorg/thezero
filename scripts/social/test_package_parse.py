import unittest

from package_parse import parse_social_package, validate_package


BODY = """
<!-- CURSOR_AGENT_PR_BODY_BEGIN -->
Matéria de domingo.

## SOCIAL PACKAGE
- slug: china-rtx-pro-5500-alibaba-bytedance
- url: https://www.thezero.com.br/noticia/china-rtx-pro-5500-alibaba-bytedance
- cover_path: public/images/posts/china-rtx-pro-5500-alibaba-bytedance/cover.jpg
- hook: China pede a Alibaba e ByteDance a RTX PRO 5500 de 84 GB
- summary: O pedido está na The Information. A Reuters não checou.
- caption_ig: |
  A The Information diz que a China pediu a RTX PRO 5500.

  https://www.thezero.com.br/noticia/china-rtx-pro-5500-alibaba-bytedance
- threads_x: |
  A China pediu a RTX PRO 5500. A Reuters não confirmou.

  https://www.thezero.com.br/noticia/china-rtx-pro-5500-alibaba-bytedance
- compose_cmd: |
  python3 scripts/social/compose_ig_post.py --cover public/images/posts/china-rtx-pro-5500-alibaba-bytedance/cover.jpg --hook "China pede" --summary "A Reuters não checou." --out social-out/china.png --size 1x1
<!-- CURSOR_AGENT_PR_BODY_END -->
"""


class PackageParseTest(unittest.TestCase):
    def test_real_layout(self):
        fields = parse_social_package(BODY)
        self.assertIsNotNone(fields)
        assert fields is not None
        self.assertEqual(fields["slug"], "china-rtx-pro-5500-alibaba-bytedance")
        self.assertIn("A The Information diz", fields["caption_ig"])
        self.assertIn("https://www.thezero.com.br/noticia/china-rtx-pro-5500-alibaba-bytedance", fields["caption_ig"])
        self.assertNotIn("CURSOR_AGENT", fields["compose_cmd"])
        self.assertEqual(validate_package(fields, fields["slug"]), [])

    def test_bold_keys_and_title(self):
        text = """**SOCIAL PACKAGE**
- **slug:** exemplo-de-slug
- **url:** https://www.thezero.com.br/noticia/exemplo-de-slug
- **cover_path:** public/images/posts/exemplo-de-slug/cover.jpg
- **hook:** Frase curta
- **summary:** Resumo curto
- **caption_ig:** Legenda https://www.thezero.com.br/noticia/exemplo-de-slug
- **threads_x:** Texto https://www.thezero.com.br/noticia/exemplo-de-slug
"""
        fields = parse_social_package(text)
        self.assertIsNotNone(fields)
        assert fields is not None
        self.assertEqual(fields["slug"], "exemplo-de-slug")
        self.assertEqual(fields["hook"], "Frase curta")
        self.assertEqual(validate_package(fields, "exemplo-de-slug"), [])

    def test_missing_section(self):
        self.assertIsNone(parse_social_package("só o texto da matéria"))

    def test_section_present_but_incomplete(self):
        fields = parse_social_package("## SOCIAL PACKAGE\n- slug: exemplo-de-slug\n")
        self.assertIsNotNone(fields)
        assert fields is not None
        errors = validate_package(fields, "exemplo-de-slug")
        self.assertTrue(any("caption_ig" in error for error in errors))

    def test_slug_mismatch_and_length(self):
        fields = {
            "slug": "outro-slug",
            "url": "https://www.thezero.com.br/noticia/outro-slug",
            "cover_path": "public/images/posts/outro-slug/cover.jpg",
            "hook": "hook",
            "summary": "summary",
            "caption_ig": "c",
            "threads_x": "t" * 501,
        }
        errors = validate_package(fields, "exemplo-de-slug")
        self.assertTrue(any("não bate" in error for error in errors))
        self.assertTrue(any("threads_x" in error for error in errors))

    def test_stops_before_fact_check(self):
        text = """## SOCIAL PACKAGE
- slug: exemplo-de-slug
- hook: Frase

## FACT-CHECK
- claim: 84 GB | source: https://www.nvidia.com/rtx | ok
"""
        fields = parse_social_package(text)
        self.assertIsNotNone(fields)
        assert fields is not None
        self.assertNotIn("claim", fields)
        self.assertEqual(fields["hook"], "Frase")


if __name__ == "__main__":
    unittest.main()
