import unittest

from ledger import empty_ledger, entry_complete, resolve_existing


class LedgerTest(unittest.TestCase):
    def test_recent_posts_fill_a_missing_ledger(self):
        url = "https://www.thezero.com.br/noticia/exemplo-de-slug"
        existing = resolve_existing(
            "exemplo-de-slug",
            url,
            empty_ledger(),
            [{"permalink": "https://www.instagram.com/p/abc/", "caption": f"texto\n\n{url}"}],
            [{"permalink": "https://www.threads.net/@hello.the.zero/post/1", "text": f"texto {url}"}],
        )
        self.assertTrue(entry_complete(existing))
        self.assertEqual(existing["ig"], "https://www.instagram.com/p/abc/")

    def test_ledger_wins_when_present(self):
        ledger = {
            "version": 1,
            "posts": {
                "exemplo-de-slug": {
                    "ig": "https://www.instagram.com/p/ledger/",
                    "threads": "https://www.threads.net/p/ledger",
                }
            },
        }
        existing = resolve_existing(
            "exemplo-de-slug",
            "https://www.thezero.com.br/noticia/exemplo-de-slug",
            ledger,
            [{"permalink": "https://www.instagram.com/p/other/", "caption": "/noticia/exemplo-de-slug"}],
            [],
        )
        self.assertEqual(existing["ig"], "https://www.instagram.com/p/ledger/")
        self.assertFalse(entry_complete({"ig": existing["ig"], "threads": ""}))
        self.assertTrue(entry_complete(existing))

    def test_unrelated_caption_does_not_match(self):
        existing = resolve_existing(
            "exemplo-de-slug",
            "https://www.thezero.com.br/noticia/exemplo-de-slug",
            empty_ledger(),
            [{"permalink": "https://www.instagram.com/p/nope/", "caption": "outra matéria"}],
            [],
        )
        self.assertFalse(entry_complete(existing))


if __name__ == "__main__":
    unittest.main()
