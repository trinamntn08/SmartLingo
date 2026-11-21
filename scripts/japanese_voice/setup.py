"""Explicit Windows x64 CPU voice installation, with pinned official artifacts.

Requires Python 3.12+. Downloads about 90 MB, then uses roughly 200 MB locally.
No administrator access, system Python packages, credentials or paid services.
See docs/JAPANESE_AUDIO.md for sources, voice terms and alternative engines.
"""
import hashlib
import os
import platform
import shutil
import struct
import subprocess
import sys
import tarfile
import urllib.request
import venv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INSTALL = ROOT / "data" / "japanese-voice"
CORE_RELEASE = "https://github.com/VOICEVOX/voicevox_core/releases/download/0.17.1/"
ARTIFACTS = (
    ("voicevox_core-0.17.1-cp310-abi3-win_amd64.whl", CORE_RELEASE,
     "faaac91e7b19c32d60fcbd4f38b91681e576ec3de01330aa3f37c33ae05db6d1", 2022868),
    ("voicevox_onnxruntime-win-x64-1.17.3.tgz",
     "https://github.com/VOICEVOX/onnxruntime-builder/releases/download/voicevox_onnxruntime-1.17.3/",
     "32b07e7c6c59030434b54eb0255912510942faf193c7a14e0e1a168db5796265", 4650448),
    ("open_jtalk_dic_utf_8-1.11.tar.gz", "https://github.com/r9y9/open_jtalk/releases/download/v1.11.1/",
     "fe6ba0e43542cef98339abdffd903e062008ea170b04e7e2a35da805902f382a", 23646843),
    ("0.vvm", "https://github.com/VOICEVOX/voicevox_vvm/releases/download/0.17.1/",
     "ecd35374d4182cd883cba5040376f7f888cc6ba248b1c2f4cea07cdb34bb1318", 59308488),
    ("TERMS.txt", "https://raw.githubusercontent.com/VOICEVOX/voicevox_vvm/0.17.1/",
     "9c0caf98b31ef82e3686e8fca39d53c85965059d2206be3c83efc3751d32c83a", 15990),
)


def file_hash(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def download(directory, artifact):
    name, base, digest, expected_size = artifact
    destination = directory / name
    if destination.is_file() and destination.stat().st_size == expected_size and file_hash(destination) == digest:
        print("Verified cached " + name, flush=True)
        return destination
    print("Downloading " + name, flush=True)
    partial = destination.with_name(name + ".part")
    total = 0
    request = urllib.request.Request(base + name, headers={"User-Agent": "SmartLingo-local-voice-setup"})
    with urllib.request.urlopen(request, timeout=30) as response, partial.open("wb") as target:
        while chunk := response.read(1024 * 1024):
            total += len(chunk)
            if total > expected_size:
                raise ValueError("Unexpected artifact size: " + name)
            target.write(chunk)
    if total != expected_size or file_hash(partial) != digest:
        raise ValueError("Artifact integrity check failed: " + name)
    partial.replace(destination)
    return destination


def main():
    if sys.version_info < (3, 12) or sys.platform != "win32" or struct.calcsize("P") != 8 or platform.machine().lower() not in ("amd64", "x86_64"):
        raise RuntimeError("Compact setup requires Windows x64 and Python 3.12+. Other systems can run the official VOICEVOX engine.")
    print("Installing free synthetic Japanese voice: VOICEVOX: Shikoku Metan (style 2).", flush=True)
    print("Voice terms and required credit: https://zunko.jp/con_ongen_kiyaku.html", flush=True)
    print("Runtime/model terms: https://github.com/VOICEVOX/voicevox_vvm/blob/0.17.1/TERMS.txt", flush=True)
    downloads = INSTALL / "downloads"
    downloads.mkdir(parents=True, exist_ok=True)
    artifacts = [download(downloads, item) for item in ARTIFACTS]
    core = INSTALL / "core"
    (core / "dict").mkdir(parents=True, exist_ok=True)
    (core / "models").mkdir(parents=True, exist_ok=True)
    # Known hashes plus the data filter prevent archive path/link escapes.
    with tarfile.open(artifacts[1]) as archive:
        archive.extractall(core, filter="data")
    with tarfile.open(artifacts[2]) as archive:
        archive.extractall(core / "dict", filter="data")
    shutil.copyfile(artifacts[3], core / "models" / "0.vvm")
    shutil.copyfile(artifacts[4], core / "models" / "TERMS.txt")
    environment = INSTALL / "venv"
    if not (environment / "Scripts" / "python.exe").is_file():
        venv.EnvBuilder(with_pip=True).create(environment)
    python = environment / "Scripts" / "python.exe"
    # CORE's wheel is self-contained: no unpinned transitive/PyPI installs.
    subprocess.run([str(python), "-X", "utf8", "-m", "pip", "install", "--disable-pip-version-check", "--no-deps", str(artifacts[0])],
                   check=True, env={**os.environ, "PYTHONUTF8": "1"})
    print("Japanese voice installed. Start npm run dev:japanese-voice, then npm run dev:api.", flush=True)


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, RuntimeError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error))
