import unittest
from unittest import mock

import deploy_watch as dw


class DeployWatchTest(unittest.TestCase):
    def test_needs_redeploy(self):
        self.assertFalse(dw.needs_redeploy([]))
        self.assertTrue(dw.needs_redeploy([{"status": "completed", "conclusion": "failure"}]))
        self.assertFalse(dw.needs_redeploy([{"status": "completed", "conclusion": "success"}]))
        self.assertFalse(dw.needs_redeploy([
            {"status": "in_progress", "conclusion": None},
            {"status": "completed", "conclusion": "failure"},
        ]))

    def test_guard_redeploys_once(self):
        guard = dw.DeployGuard("o/r", "t", [], every=1)
        with mock.patch.object(dw, "latest_runs", return_value=[{"status": "completed", "conclusion": "failure"}]), \
             mock.patch.object(dw, "dispatch", return_value=True) as disp:
            guard(); guard(); guard()
        self.assertEqual(disp.call_count, 1)


if __name__ == "__main__":
    unittest.main()
