import base64
import unittest

from nacl.encoding import Base64Encoder
from nacl.public import PrivateKey, SealedBox

from secrets_update import encrypt_secret


class SecretsUpdateTest(unittest.TestCase):
    def test_sealed_box_roundtrip(self):
        private = PrivateKey.generate()
        public_key = private.public_key.encode(Base64Encoder).decode("utf-8")
        token = "threads-token-que-nao-pode-vazar"
        encrypted = encrypt_secret(public_key, token)
        opened = SealedBox(private).decrypt(base64.b64decode(encrypted)).decode("utf-8")
        self.assertEqual(opened, token)
        self.assertNotIn(token, encrypted)


if __name__ == "__main__":
    unittest.main()
