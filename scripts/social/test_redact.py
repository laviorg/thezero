import unittest

from redact import redact


class RedactTest(unittest.TestCase):
    def test_strips_token_from_url_and_bearer(self):
        secret = "EAA-super-secret-token-value"
        text = (
            "GET https://graph.facebook.com/v21.0/me?access_token=EAA-super-secret-token-value "
            "Authorization: Bearer EAA-super-secret-token-value"
        )
        cleaned = redact(text, [secret])
        self.assertNotIn(secret, cleaned)
        self.assertNotIn("EAA-super-secret-token-value", cleaned)
        self.assertIn("[REDACTED]", cleaned)

    def test_does_not_blank_unrelated_text(self):
        self.assertEqual(redact("slug exemplo", []), "slug exemplo")


if __name__ == "__main__":
    unittest.main()
