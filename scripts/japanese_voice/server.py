"""Small loopback adapter for VOICEVOX CORE; not the full VOICEVOX engine.

Only the three endpoints used by SmartLingo are exposed. Speech stays in memory.
Models/runtime/dictionary are installed separately by setup.py, never bundled.
"""
import json
import math
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parents[2]
INSTALL = ROOT / "data" / "japanese-voice"
VOICE = "四国めたん"
RATES = (0.7, 0.85, 1.0)


def valid_text(value):
    return (isinstance(value, str) and 1 <= len(value.strip()) <= 500
            and not any(ord(c) < 32 or ord(c) == 127 for c in value))


def create_server(synthesize, address=("127.0.0.1", 50021)):
    """Inject inference so protocol/error/security tests never load a model."""
    inference_lock = threading.Lock()

    class Handler(BaseHTTPRequestHandler):
        # No request paths, text or engine exceptions are logged.
        def log_message(self, *_args):
            pass

        def setup(self):
            super().setup()
            self.connection.settimeout(5)

        def send(self, status, value, content_type="application/json"):
            body = json.dumps(value, ensure_ascii=False).encode("utf-8") if content_type == "application/json" else value
            try:
                self.send_response(status)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Cache-Control", "no-store")
                self.send_header("Connection", "close")
                self.end_headers()
                self.wfile.write(body)
            except (BrokenPipeError, ConnectionResetError, TimeoutError):
                pass

        def allowed(self):
            host = self.headers.get("Host", "")
            if host != f"127.0.0.1:{self.server.server_port}" or self.headers.get("Origin") is not None:
                self.send(403, {"error": "Local API access required"})
                return False
            return True

        def do_GET(self):
            if not self.allowed():
                return
            if self.path != "/speakers":
                self.send(404, {"error": "Not found"})
                return
            self.send(200, [{"name": VOICE, "styles": [{"name": "Normal", "id": 2}]}])

        def do_POST(self):
            if not self.allowed():
                return
            try:
                if len(self.path) > 8192 or self.headers.get("Transfer-Encoding") is not None:
                    raise ValueError()
                parsed = urlsplit(self.path)
                params = parse_qs(parsed.query, strict_parsing=True)
                if params.get("speaker") != ["2"]:
                    raise ValueError()
                if parsed.path == "/audio_query":
                    if set(params) != {"speaker", "text"} or len(params["text"]) != 1 or not valid_text(params["text"][0]):
                        raise ValueError()
                    # The compact adapter analyses text at synthesis time. The opaque
                    # text field passes through the Node adapter alongside speedScale.
                    self.send(200, {"accent_phrases": [], "speedScale": 1, "smartlingoText": params["text"][0].strip()})
                    return
                if parsed.path != "/synthesis":
                    self.send(404, {"error": "Not found"})
                    return
                raw_length = self.headers.get("Content-Length", "")
                if (set(params) != {"speaker"} or not raw_length.isdecimal()
                        or not 1 <= int(raw_length) <= 8192
                        or self.headers.get("Content-Type", "").split(";")[0] != "application/json"):
                    raise ValueError()
                query = json.loads(self.rfile.read(int(raw_length)))
                if (not isinstance(query, dict) or set(query) != {"accent_phrases", "speedScale", "smartlingoText"}
                        or query["accent_phrases"] != [] or not valid_text(query["smartlingoText"])
                        or type(query["speedScale"]) not in (int, float)
                        or not math.isfinite(query["speedScale"]) or query["speedScale"] not in RATES):
                    raise ValueError()
            except (ValueError, KeyError, UnicodeError, TimeoutError):
                self.send(400, {"error": "Invalid Japanese speech request"})
                return
            if not inference_lock.acquire(blocking=False):
                self.send(429, {"error": "Japanese voice is busy"})
                return
            try:
                wav = synthesize(query["smartlingoText"].strip(), query["speedScale"])
                if not isinstance(wav, bytes) or not 44 <= len(wav) <= 5 * 1024 * 1024:
                    raise ValueError()
                self.send(200, wav, "audio/wav")
            except Exception:
                self.send(503, {"error": "Japanese synthesis could not complete"})
            finally:
                inference_lock.release()

    server = ThreadingHTTPServer(address, Handler)
    server.daemon_threads = True
    return server


def main():
    from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

    core = INSTALL / "core"
    runtime = core / "voicevox_onnxruntime-win-x64-1.17.3" / "lib" / "voicevox_onnxruntime.dll"
    synth = Synthesizer(Onnxruntime.load_once(filename=str(runtime)),
                        OpenJtalk(str(core / "dict" / "open_jtalk_dic_utf_8-1.11")),
                        acceleration_mode="CPU", cpu_num_threads=2)
    with VoiceModelFile.open(str(core / "models" / "0.vvm")) as model:
        synth.load_voice_model(model)

    def speak(text, rate):
        query = synth.create_audio_query(text, 2)
        query.speed_scale = rate
        return synth.synthesis(query, 2)

    with create_server(speak) as server:
        print("Japanese voice ready at http://127.0.0.1:50021 — VOICEVOX:四国めたん", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    try:
        main()
    except Exception:
        raise SystemExit("Japanese voice could not start. Run npm run setup:japanese-voice; check port 50021 is free.")
