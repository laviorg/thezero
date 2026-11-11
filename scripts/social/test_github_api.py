import unittest

from github_api import comment_body, comment_exists


class GithubApiTest(unittest.TestCase):
    def test_comment_is_stable_and_has_no_token_slot(self):
        body = comment_body(
            "exemplo-de-slug",
            "https://www.instagram.com/p/abc/",
            "https://www.threads.net/@hello.the.zero/post/1",
        )
        self.assertIn("## SOCIAL POSTED", body)
        self.assertIn("slug: exemplo-de-slug", body)
        self.assertNotIn("token", body.lower())
        comments = [{"body": "outra coisa"}, {"body": body}]
        self.assertTrue(
            comment_exists(
                comments,
                "exemplo-de-slug",
                "https://www.instagram.com/p/abc/",
                "https://www.threads.net/@hello.the.zero/post/1",
            )
        )
        self.assertFalse(
            comment_exists(
                comments,
                "outro",
                "https://www.instagram.com/p/abc/",
                "https://www.threads.net/@hello.the.zero/post/1",
            )
        )

    def test_comment_includes_story_when_present(self):
        body = comment_body(
            "exemplo-de-slug",
            "https://www.instagram.com/p/abc/",
            "https://www.threads.net/@hello.the.zero/post/1",
            "https://www.instagram.com/stories/hello.the.zero/1/",
        )
        self.assertIn("story: https://www.instagram.com/stories/hello.the.zero/1/", body)
        self.assertTrue(
            comment_exists(
                [{"body": body}],
                "exemplo-de-slug",
                "https://www.instagram.com/p/abc/",
                "https://www.threads.net/@hello.the.zero/post/1",
                "https://www.instagram.com/stories/hello.the.zero/1/",
            )
        )
        # comentário antigo, sem story, ainda conta como publicado no feed
        old = comment_body(
            "exemplo-de-slug",
            "https://www.instagram.com/p/abc/",
            "https://www.threads.net/@hello.the.zero/post/1",
        )
        self.assertTrue(
            comment_exists(
                [{"body": old}],
                "exemplo-de-slug",
                "https://www.instagram.com/p/abc/",
                "https://www.threads.net/@hello.the.zero/post/1",
            )
        )


if __name__ == "__main__":
    unittest.main()
