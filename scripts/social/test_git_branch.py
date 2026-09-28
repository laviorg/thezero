import base64
import os
import unittest
from unittest import mock

import git_branch
from redact import redact


class GitAuthTest(unittest.TestCase):
    def test_basic_credential_matches_actions_checkout(self):
        encoded = git_branch.basic_credential("tok-123456")
        self.assertEqual(base64.b64decode(encoded).decode(), "x-access-token:tok-123456")

    def test_auth_env_uses_basic_header_and_registers_secrets(self):
        secrets: list[str] = []
        with mock.patch.dict(os.environ, {"GITHUB_ACTIONS": ""}):
            env = git_branch.auth_env("tok-123456", secrets)
        encoded = git_branch.basic_credential("tok-123456")
        self.assertEqual(env["GIT_CONFIG_KEY_0"], "http.https://github.com/.extraheader")
        self.assertEqual(env["GIT_CONFIG_VALUE_0"], f"AUTHORIZATION: basic {encoded}")
        self.assertNotIn("bearer", env["GIT_CONFIG_VALUE_0"].lower())
        self.assertIn("tok-123456", secrets)
        self.assertIn(encoded, secrets)

    def test_token_never_on_command_line(self):
        captured = {}

        def fake_run(command, **kwargs):
            captured["command"] = command
            captured["env"] = kwargs["env"]
            return mock.Mock(returncode=0, stdout="", stderr="")

        with mock.patch.object(git_branch.subprocess, "run", side_effect=fake_run):
            git_branch._git(["status"], ".", "tok-123456", [])
        self.assertEqual(captured["command"], ["git", "status"])
        self.assertTrue(captured["env"]["GIT_CONFIG_VALUE_0"].startswith("AUTHORIZATION: basic "))
        self.assertEqual(captured["env"]["GIT_TERMINAL_PROMPT"], "0")

    def test_error_output_is_redacted(self):
        encoded = git_branch.basic_credential("tok-123456")

        def fake_run(command, **kwargs):
            return mock.Mock(returncode=1, stdout="", stderr=f"erro AUTHORIZATION: basic {encoded} tok-123456")

        with mock.patch.object(git_branch.subprocess, "run", side_effect=fake_run):
            with self.assertRaises(git_branch.GitPushError) as ctx:
                git_branch._git(["fetch"], ".", "tok-123456", [])
        self.assertNotIn("tok-123456", str(ctx.exception))
        self.assertNotIn(encoded, str(ctx.exception))

    def test_redact_hides_basic_header(self):
        self.assertNotIn("abc123secret", redact("AUTHORIZATION: basic abc123secret"))


if __name__ == "__main__":
    unittest.main()
