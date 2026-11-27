"""Render exact course transcripts with locally installed VOICEVOX CORE and ffmpeg."""

import argparse
import hashlib
import json
import shutil
import subprocess
from pathlib import Path

from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile


def render(synthesizer, text, speed, destination):
    query = synthesizer.create_audio_query(text, 2)
    query.speed_scale = speed
    wav = synthesizer.synthesis(query, 2)
    temporary = destination.with_suffix(".tmp.mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-threads", "1", "-filter_threads", "1", "-f", "wav", "-i", "pipe:0", "-map_metadata", "-1",
                    "-ar", "24000", "-ac", "1", "-b:a", "48k", str(temporary)], input=wav, check=True)
    temporary.replace(destination)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("transcripts", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--manifest", type=Path, help="Write the manifest to a specified path.")
    parser.add_argument("--runtime", required=True)
    parser.add_argument("--dictionary", required=True)
    parser.add_argument("--model", required=True)
    args = parser.parse_args()
    records = json.loads(args.transcripts.read_text(encoding="utf-8"))
    args.output.mkdir(parents=True, exist_ok=True)
    synthesizer = Synthesizer(Onnxruntime.load_once(filename=args.runtime), OpenJtalk(args.dictionary),
                              acceleration_mode="CPU", cpu_num_threads=1)
    with VoiceModelFile.open(args.model) as model:
        synthesizer.load_voice_model(model)
    # Load credited voices from the canonical bundle, including vocabulary that
    # has human audio independently of the synthetic transcript collection.
    bundled = Path(__file__).resolve().parents[2] / "apps/learner/public/japanese-audio"
    credits_path = bundled / "human-recordings.json"
    credits = json.loads(credits_path.read_text(encoding="utf-8"))
    entries = json.loads((bundled / "manifest.json").read_text(encoding="utf-8"))
    manifest = {text: entries[text] for text in credits}
    for entry in manifest.values():
        source = bundled / entry["file"]
        if hashlib.sha256(source.read_bytes()).hexdigest() != entry["sha256"]:
            raise ValueError(f"Invalid credited recording: {source}")
        if args.output.resolve() != bundled:
            shutil.copyfile(source, args.output / source.name)
    if args.output.resolve() != bundled:
        shutil.copyfile(credits_path, args.output / credits_path.name)
    for index, (text, speed) in enumerate(records.items(), 1):
        if text in credits:
            continue
        key = f"{text}\0{speed}"
        identity = hashlib.sha256(key.encode()).hexdigest()[:24]
        name = f"{identity}.mp3"
        destination = args.output / name
        if not destination.exists():
            try:
                render(synthesizer, text, speed, destination)
            except (ValueError, RuntimeError, subprocess.CalledProcessError) as error:
                raise RuntimeError(f"Could not render {text!r}") from error
        manifest[text] = {"file": name, "sha256": hashlib.sha256(destination.read_bytes()).hexdigest(), "speed": speed}
        if index % 25 == 0:
            print(f"Rendered {index} of {len(records)} clips", flush=True)
    (args.manifest or args.output / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(manifest)} entries, including {len(credits)} human recordings")


if __name__ == "__main__":
    main()
