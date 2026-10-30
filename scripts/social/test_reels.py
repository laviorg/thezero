import tempfile
import unittest
from pathlib import Path
from unittest import mock

import http_wait
import ledger
import post_api
import reels


class _Resp:
    def __init__(self, status_code=200, content=b"", content_type="video/mp4"):
        self.status_code = status_code
        self.content = content
        self.headers = {"content-type": content_type}


MP4_BYTES = b"\x00\x00\x00\x18ftypisom" + b"\x00" * 32


class PostInstagramReelTest(unittest.TestCase):
    def test_creates_reels_container_with_video_url(self):
        calls = []

        def fake(method, url, token, secrets, **kw):
            calls.append((method, url, kw))
            if url.endswith("/media") and method == "POST":
                return {"id": "c1"}
            if url.endswith("/c1"):
                return {"status_code": "FINISHED"}
            if url.endswith("/media_publish"):
                return {"id": "m1"}
            return {"permalink": "https://www.instagram.com/reel/xyz/"}

        with mock.patch.object(post_api, "_request", side_effect=fake), \
             mock.patch.object(post_api.time, "sleep", lambda s: None):
            out = post_api.post_instagram_reel("t", "u", "https://example.com/v.mp4", "legenda", [])
        self.assertEqual(out, "https://www.instagram.com/reel/xyz/")
        create = calls[0][2]["data"]
        self.assertEqual(create["media_type"], "REELS")
        self.assertEqual(create["video_url"], "https://example.com/v.mp4")
        self.assertEqual(create["caption"], "legenda")

    def test_retries_9007_on_publish(self):
        state = {"publish": 0}

        def fake(method, url, token, secrets, **kw):
            if url.endswith("/media") and method == "POST":
                return {"id": "c1"}
            if url.endswith("/c1"):
                return {"status_code": "FINISHED"}
            if url.endswith("/media_publish"):
                state["publish"] += 1
                if state["publish"] < 2:
                    raise RuntimeError("HTTP 400: Media ID is not available (code 9007)")
                return {"id": "m1"}
            return {"permalink": "https://www.instagram.com/reel/xyz/"}

        with mock.patch.object(post_api, "_request", side_effect=fake), \
             mock.patch.object(post_api.time, "sleep", lambda s: None):
            out = post_api.post_instagram_reel("t", "u", "https://example.com/v.mp4", "legenda", [])
        self.assertEqual(out, "https://www.instagram.com/reel/xyz/")
        self.assertEqual(state["publish"], 2)

    def test_container_error_raises(self):
        def fake(method, url, token, secrets, **kw):
            if url.endswith("/media") and method == "POST":
                return {"id": "c1"}
            return {"status_code": "ERROR", "error": {"message": "vídeo inválido", "code": 352}}

        with mock.patch.object(post_api, "_request", side_effect=fake), \
             mock.patch.object(post_api.time, "sleep", lambda s: None):
            with self.assertRaises(RuntimeError):
                post_api.post_instagram_reel("t", "u", "https://example.com/v.mp4", "legenda", [])

    def test_recent_ig_includes_media_type(self):
        seen = {}

        def fake(method, url, token, secrets, **kw):
            seen.update(kw.get("params") or {})
            return {"data": []}

        with mock.patch.object(post_api, "_request", side_effect=fake):
            post_api.list_recent_ig("t", "u", [])
        self.assertIn("media_type", seen.get("fields", ""))


class LedgerReelTest(unittest.TestCase):
    def test_reel_complete(self):
        self.assertFalse(ledger.reel_complete(None))
        self.assertFalse(ledger.reel_complete({}))
        self.assertFalse(ledger.reel_complete({"ig": "https://x", "threads": "https://y"}))
        self.assertTrue(ledger.reel_complete({"reel": "https://www.instagram.com/reel/xyz/"}))

    def test_entry_complete_ignores_reel(self):
        self.assertFalse(ledger.entry_complete({"reel": "https://www.instagram.com/reel/xyz/"}))


class Mp4CheckTest(unittest.TestCase):
    def test_http_wait_mp4(self):
        self.assertTrue(http_wait._mp4(_Resp(200, MP4_BYTES, "video/mp4")))
        self.assertTrue(http_wait._mp4(_Resp(200, MP4_BYTES, "application/octet-stream")))
        self.assertFalse(http_wait._mp4(_Resp(404, MP4_BYTES, "video/mp4")))
        self.assertFalse(http_wait._mp4(_Resp(200, b"\xff\xd8\xff\xe0" + b"\x00" * 32, "image/jpeg")))
        self.assertFalse(http_wait._mp4(_Resp(200, MP4_BYTES, "text/html")))

    def test_is_mp4_and_check_reel_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            good = Path(tmp) / "short.mp4"
            good.write_bytes(MP4_BYTES)
            self.assertTrue(reels.is_mp4(good))
            reels.check_reel_file(good)
            bad = Path(tmp) / "short.txt"
            bad.write_text("não é vídeo", encoding="utf-8")
            self.assertFalse(reels.is_mp4(bad))
            with self.assertRaises(RuntimeError):
                reels.check_reel_file(bad)
            with self.assertRaises(RuntimeError):
                reels.check_reel_file(Path(tmp) / "ausente.mp4")


class ReelAssetExistsTest(unittest.TestCase):
    def test_200_means_exists(self):
        fake = lambda url, **kw: _Resp(200)
        self.assertTrue(reels.reel_asset_exists("https://example.com/v.mp4", [], head=fake))

    def test_404_means_missing(self):
        fake = lambda url, **kw: _Resp(404)
        self.assertFalse(reels.reel_asset_exists("https://example.com/v.mp4", [], head=fake))

    def test_network_error_means_missing(self):
        import requests

        def fake(url, **kw):
            raise requests.RequestException("sem rede")

        self.assertFalse(reels.reel_asset_exists("https://example.com/v.mp4", [], head=fake))

    def test_raw_url_shape(self):
        self.assertEqual(
            reels.reel_raw_url("laviorg/thezero", "meu-slug.mp4"),
            "https://github.com/laviorg/thezero/releases/download/social-reels/meu-slug.mp4",
        )


class _ApiResp:
    def __init__(self, status_code=200, payload=None):
        self.status_code = status_code
        self._payload = payload if payload is not None else {}
        self.text = "{}" if payload is None else str(payload)

    def json(self):
        return self._payload


class ReleaseHostingTest(unittest.TestCase):
    def test_ensure_release_reuses_existing(self):
        def fake_get(url, **kw):
            return _ApiResp(200, {"id": 77})

        with mock.patch.object(reels.requests, "get", side_effect=fake_get):
            self.assertEqual(reels.ensure_release("laviorg/thezero", "t", []), 77)

    def test_ensure_release_creates_prerelease_when_missing(self):
        posted = {}

        def fake_get(url, **kw):
            return _ApiResp(404)

        def fake_api(method, url, token, secrets, **kw):
            posted.update(kw.get("json") or {})
            return _ApiResp(201, {"id": 88})

        with mock.patch.object(reels.requests, "get", side_effect=fake_get), \
             mock.patch.object(reels, "_api", side_effect=fake_api):
            self.assertEqual(reels.ensure_release("laviorg/thezero", "t", []), 88)
        self.assertEqual(posted.get("tag_name"), "social-reels")
        self.assertTrue(posted.get("prerelease"))

    def test_publish_replaces_same_name_asset(self):
        calls = []

        def fake_api(method, url, token, secrets, **kw):
            calls.append((method, url.split("?")[0]))
            if method == "GET":
                return _ApiResp(200, [{"id": 5, "name": "meu-slug.mp4"}])
            return _ApiResp(200, {})

        with tempfile.TemporaryDirectory() as tmp:
            mp4 = Path(tmp) / "short.mp4"
            mp4.write_bytes(MP4_BYTES)
            credits = Path(tmp) / "credits.txt"
            credits.write_text("Foto: Autor, fonte, CC BY 4.0", encoding="utf-8")
            with mock.patch.object(reels, "ensure_release", return_value=9), \
                 mock.patch.object(reels, "_api", side_effect=fake_api):
                url = reels.publish_reel_asset("laviorg/thezero", "t", [], "meu-slug", mp4, credits)
        methods = [m for m, _ in calls]
        # mp4: lista+apaga+sobe; credits: lista (sem homônimo) +sobe
        self.assertEqual(methods, ["GET", "DELETE", "POST", "GET", "POST"])
        self.assertTrue(url.endswith("/releases/download/social-reels/meu-slug.mp4"))

    def test_fetch_reel_credits(self):
        class R:
            status_code = 200
            text = "Foto: Autor, fonte, CC BY 4.0"

        self.assertEqual(reels.fetch_reel_credits("u", [], get=lambda *a, **k: R()), R.text)
        self.assertIsNone(reels.fetch_reel_credits("u", [], get=lambda *a, **k: _ApiResp(404)))


if __name__ == "__main__":
    unittest.main()
