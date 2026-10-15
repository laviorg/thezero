import unittest
from unittest import mock

import post_api


class PublishRetryTest(unittest.TestCase):
    def test_retries_9007_then_succeeds(self):
        calls = []

        def fake(method, url, token, secrets, **kw):
            calls.append(1)
            if len(calls) < 3:
                raise RuntimeError("HTTP 400: Media ID is not available (code 9007)")
            return {"id": "123"}

        with mock.patch.object(post_api, "_request", side_effect=fake):
            out = post_api._publish_with_retry("u", "t", [], {}, waits=(0, 0, 0), sleep=lambda s: None)
        self.assertEqual(out, {"id": "123"})
        self.assertEqual(len(calls), 3)

    def test_other_errors_raise_immediately(self):
        with mock.patch.object(post_api, "_request", side_effect=RuntimeError("HTTP 400: invalid token")) as m:
            with self.assertRaises(RuntimeError):
                post_api._publish_with_retry("u", "t", [], {}, waits=(0, 0), sleep=lambda s: None)
        self.assertEqual(m.call_count, 1)

    def test_gives_up_after_waits(self):
        with mock.patch.object(post_api, "_request", side_effect=RuntimeError("code 9007")) as m:
            with self.assertRaises(RuntimeError):
                post_api._publish_with_retry("u", "t", [], {}, waits=(0, 0), sleep=lambda s: None)
        self.assertEqual(m.call_count, 3)


if __name__ == "__main__":
    unittest.main()
