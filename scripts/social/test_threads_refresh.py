import io
import unittest
from contextlib import redirect_stdout

from github_api import _headers
from run import threads_token_for_run


class ThreadsRefreshTest(unittest.TestCase):
    def test_failure_keeps_current_token_and_hides_it(self):
        def boom(token, secrets):
            raise RuntimeError(f"token muito novo: {token}")

        out = io.StringIO()
        with redirect_stdout(out):
            got = threads_token_for_run("tok-atual-123", [], refresh=boom)
        self.assertEqual(got, "tok-atual-123")
        self.assertNotIn("tok-atual-123", out.getvalue())
        self.assertIn("::warning::", out.getvalue())

    def test_success_returns_fresh_and_registers_secret(self):
        secrets: list[str] = []
        out = io.StringIO()
        with redirect_stdout(out):
            got = threads_token_for_run("velho", secrets, refresh=lambda t, s: "novo-456")
        self.assertEqual(got, "novo-456")
        self.assertIn("novo-456", secrets)
        self.assertNotIn("novo-456", out.getvalue())


class HeadersTest(unittest.TestCase):
    def test_no_auth_header_without_token(self):
        self.assertNotIn("Authorization", _headers(""))
        self.assertEqual(_headers("x")["Authorization"], "Bearer x")


if __name__ == "__main__":
    unittest.main()
