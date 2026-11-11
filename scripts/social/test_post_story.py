import unittest
from unittest.mock import patch

import post_api


class PostStoryTest(unittest.TestCase):
    def test_story_container_uses_stories_media_type(self):
        calls = []

        def fake_request(method, url, token, secrets, **kwargs):
            calls.append((method, url, kwargs))
            if url.endswith("/media") and method == "POST":
                return {"id": "container-1"}
            if url.endswith("/container-1"):
                return {"status_code": "FINISHED"}
            if url.endswith("/media_publish"):
                return {"id": "media-99"}
            if url.endswith("/media-99"):
                return {"permalink": "https://www.instagram.com/stories/hello.the.zero/99/"}
            raise AssertionError(url)

        with patch.object(post_api, "_request", side_effect=fake_request), patch.object(
            post_api, "_publish_with_retry", side_effect=lambda url, token, secrets, data, waits=None: {"id": "media-99"}
        ):
            permalink = post_api.post_instagram_story("token", "123", "https://example.com/story.jpg", ["token"])
        self.assertEqual(permalink, "https://www.instagram.com/stories/hello.the.zero/99/")
        media_call = next(call for call in calls if call[1].endswith("/media"))
        self.assertEqual(media_call[2]["data"]["media_type"], "STORIES")
        self.assertEqual(media_call[2]["data"]["image_url"], "https://example.com/story.jpg")
        self.assertNotIn("caption", media_call[2]["data"])

    def test_scope_error_detection(self):
        self.assertTrue(
            post_api.is_scope_error(
                "HTTP 400: (#10) Application does not have permission for this action"
            )
        )
        self.assertFalse(post_api.is_scope_error("media_publish ainda indisponível"))


if __name__ == "__main__":
    unittest.main()
