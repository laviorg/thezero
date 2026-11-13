import unittest

from mdx_meta import frontmatter_value, is_draft_mdx


class MdxMetaTest(unittest.TestCase):
    def test_draft_true(self):
        self.assertTrue(is_draft_mdx("---\ntitle: \"x\"\ndraft: true\n---\ncorpo\n"))
        self.assertTrue(is_draft_mdx('---\ndraft: "true"\n---\n'))

    def test_published(self):
        self.assertFalse(is_draft_mdx("---\ntitle: \"x\"\ndraft: false\n---\n"))
        self.assertFalse(is_draft_mdx("---\ntitle: \"x\"\n---\n"))

    def test_frontmatter_value(self):
        raw = '---\ntitle: "Adobe promete Acrobat no Gmail e Drive"\nexcerpt: Folha.\ndraft: false\n---\ncorpo\n'
        self.assertEqual(
            frontmatter_value(raw, "title"),
            "Adobe promete Acrobat no Gmail e Drive",
        )
        self.assertEqual(frontmatter_value(raw, "excerpt"), "Folha.")
        self.assertEqual(frontmatter_value(raw, "missing"), "")
        self.assertEqual(frontmatter_value("sem frontmatter", "title"), "")


if __name__ == "__main__":
    unittest.main()
