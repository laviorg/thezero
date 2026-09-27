import unittest

from mdx_meta import is_draft_mdx


class MdxMetaTest(unittest.TestCase):
    def test_draft_true(self):
        self.assertTrue(is_draft_mdx("---\ntitle: \"x\"\ndraft: true\n---\ncorpo\n"))
        self.assertTrue(is_draft_mdx('---\ndraft: "true"\n---\n'))

    def test_published(self):
        self.assertFalse(is_draft_mdx("---\ntitle: \"x\"\ndraft: false\n---\n"))
        self.assertFalse(is_draft_mdx("---\ntitle: \"x\"\n---\n"))


if __name__ == "__main__":
    unittest.main()
