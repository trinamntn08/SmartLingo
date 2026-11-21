"""Protocol tests use fake inference: no model downloads, GPU or paid calls."""
import http.client
import json
import threading
import unittest
from urllib.parse import urlencode
from server import create_server


class VoiceProtocolTests(unittest.TestCase):
    def setUp(self):
        self.calls = []
        self.entered = threading.Event()
        self.release = threading.Event()
        self.block = False
        self.fail = False

        def inference(text, rate):
            self.calls.append((text, rate))
            if self.fail:
                raise ValueError("private spoken text must never be echoed")
            if self.block:
                self.entered.set()
                self.release.wait(2)
            return b"RIFF" + bytes(40)

        self.server = create_server(inference, ("127.0.0.1", 0))
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.release.set()
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(2)

    def request(self, method, path, body=None, headers=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=3)
        try:
            connection.request(method, path, body, headers or {})
            response = connection.getresponse()
            return response.status, response.getheader("Content-Type"), response.read()
        finally:
            connection.close()

    def query(self):
        status, _, body = self.request("POST", "/audio_query?" + urlencode({"speaker": "2", "text": "こんにちは。"}))
        self.assertEqual(status, 200)
        return json.loads(body)

    def synthesize(self, query):
        return self.request("POST", "/synthesis?speaker=2", json.dumps(query), {"Content-Type": "application/json"})

    def test_voice_metadata_and_real_inference_boundary(self):
        status, _, body = self.request("GET", "/speakers")
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(body)[0]["name"], "四国めたん")
        query = self.query()
        self.assertEqual(self.calls, [])
        query["speedScale"] = 0.7
        status, mime, _ = self.synthesize(query)
        self.assertEqual((status, mime), (200, "audio/wav"))
        self.assertEqual(self.calls, [("こんにちは。", 0.7)])

    def test_rejects_browser_origins_foreign_hosts_wrong_voice_and_invalid_requests(self):
        self.assertEqual(self.request("GET", "/speakers", headers={"Origin": "http://localhost:8082"})[0], 403)
        self.assertEqual(self.request("GET", "/speakers", headers={"Host": "evil.invalid"})[0], 403)
        self.assertEqual(self.request("POST", "/audio_query?speaker=3&text=hello")[0], 400)
        self.assertEqual(self.request("POST", "/audio_query?" + urlencode({"speaker": "2", "text": "a" * 501}))[0], 400)
        self.assertEqual(self.request("POST", "/synthesis?speaker=2", "{}", {"Content-Type": "text/plain"})[0], 400)
        query = self.query()
        for value in [True, 0, float("nan"), 2]:
            query["speedScale"] = value
            self.assertEqual(self.synthesize(query)[0], 400)
        self.assertEqual(self.calls, [])

    def test_competing_inference_rejected_and_failure_sanitized(self):
        query = self.query()
        self.block = True
        results = []
        pending = threading.Thread(target=lambda: results.append(self.synthesize(query)))
        pending.start()
        self.assertTrue(self.entered.wait(2))
        self.assertEqual(self.synthesize(query)[0], 429)
        self.release.set()
        pending.join(3)
        self.assertEqual(results[0][0], 200)
        self.fail = True
        status, mime, body = self.synthesize(query)
        self.assertEqual((status, mime), (503, "application/json"))
        self.assertNotIn(b"private", body)


if __name__ == "__main__":
    unittest.main()
