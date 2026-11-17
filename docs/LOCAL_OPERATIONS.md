# Local learner and API operations

Current operational instructions for this source checkout. For installation and the short command list, start with [README](../README.md). For verified scope and remaining work, use [STATUS](STATUS.md). Ports below are configured defaults, not a claim that a process is currently running. Keys are optional server-process settings; no real `.env` is loaded automatically.

## Try the daily-course pilot

In the current learner build, open **Today → Open daily course**. One draft day is available: study its bilingual sections, save useful words, answer three choices and explicitly save a manual self-review. Save each study section before using Next section; you may browse any section directly. Complete study day becomes available after every section is saved. Reopen the course after reload to resume the saved section. Missed calendar dates do not skip content.

**Source credits and licence** shows the exact BCcampus text source, author, copyright, CC BY 4.0 link, changes and exclusions. Study does not fetch that website or require imported media/AI. Optional device speech is separate. Optional written self-review remains only on the current screen; course events, completion and notebook saves persist. Learning backup v3 includes course events and accepts earlier v1/v2 files; the normal explicit restore/reload flow applies.

This is one bundled owner-review draft, not an imported book, published curriculum or complete A1–B1 course. [Pilot acceptance](plans/0028-open-course-pilot.md) and [source/rights record](curriculum/open-course-pilot-sources.md) describe the bounded release.

## Run the preview

Use Node 24.19.0 and npm 11.x, then run from the repository root:

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Expo. No API key is required. Start with Everyday greetings and politeness, with meanings, examples, translations and explanations visible directly, save a word, and find/edit it under Review. Returning learners resume their previously studied lesson. Restaurant and every other topic remain freely accessible. Attempts and notebook entries are stored in this browser's IndexedDB and survive reload. Use the same hostname/port/browser to return to that storage. Browser data can be cleared or evicted; keep a backup using Profile → Download learning backup.

Choose any topic directly from the left-hand sidebar on desktop or the horizontal topic list on phones. Click SmartLingo to return home, including from the editor; unsaved editor fields stay available when you reopen it. Explore shows the vocabulary grid before optional short lessons, with French/English search and Foundations/A1/A2 filters. Lesson vocabulary also appears together: no Next word sequence. Meanings, fuller everyday examples and explanations stay visible, with compact noun gender markers, a speaker icon beside each word, and Save on each card. Continue to dialogue explicitly records review of the displayed set; browsing alone records no study. The opening greetings bank has 24 expressions across three eight-item lessons; other banks contain 30–35 distinct expressions across five short lessons of 6–8 items.

Vocabulary cards use locally bundled, licensed photographs where a reviewed source matches the word or its situation. Literal photos retain the whole object; contextual images are labelled Situation photo. Other words retain the original drawings or visible text support; abstract practice still uses meaning matching. Study makes no remote photo requests or paid image calls. See [photo coverage and gaps](PHOTO_COVERAGE.md), [photo sources/licences](PHOTO_SOURCES.md), [original illustration records](MEDIA_SOURCES.md) and [curriculum research](CURRICULUM_RESEARCH.md).

Review offers French→meaning cards for saved vocabulary. Try to recall before revealing, then choose Again, Needed help or Remembered. These are manual recognition ratings, not a proficiency assessment. Independent due-day recall follows a 1/3/7/14/30-day calendar schedule; help returns the item tomorrow. Early or repeated same-day recall does not advance the schedule. Editing a note starts fresh practice for that revision while preserving prior ratings. Ratings survive reload and are included in backups.

Use Review → Add personal word to save your own French, English meaning and optional example without an API. Search notebook finds French, English and examples without accents or exact capitalisation. Clearing a search restores all saved entries; hiding an entry does not discard an unsaved edit. Personal entries join the existing review and private backup flows.

Optional, in a second terminal:

```sh
npm run dev:api
```

The local API listens at `http://127.0.0.1:3001` with `/health`, `/lessons`, `/lessons/fr.restaurant.customer`, and `/published-lessons`. It seeds drafts into ignored `data/smartlingo.sqlite`. The learner uses bundled/cached lessons and remains usable while this API is stopped. Host overrides are limited to loopback; LAN access/authentication is not implemented.

For editing, open the learner at `http://localhost:8081` (development) or `http://localhost:8082` (exported preview), choose Profile → Open curriculum editor (or `/#editor`), select a lesson, edit its fields, and save a draft revision. Preview the saved revision, inspect the answer keys and provenance, then explicitly confirm your review before publishing. Preview practice is temporary and does not change learner progress. Fields cover headings/outcome, topic, learner role, estimated level, vocabulary support, existing dialogue roles/French lines/English translations, and grammar. Vocabulary target words, pictures, exercises and dialogue line count/order stay fixed in this slice. Blank required fields prevent saving.

Estimated content levels are Foundations, A1 and A2; they do not measure learner proficiency. Bundled drafts include all three levels. Estimated duration is editable from 1 to 60 whole minutes. A published topic change moves that lesson into the new topic bank when you explicitly load publications. Match the learner role name to the relevant dialogue speaker labels; those labels are edited separately.

Word notes may be empty, and noun gender can be changed separately. Five reviewed lessons are draft revision 4, fifty-five earlier lessons remain revision 3 and sixty earlier additions plus three new greeting lessons remain revision 1. The [vocabulary audit](CURRICULUM_REDUNDANCY_AUDIT.md) replaces 16 redundant introduction slots with useful routine/paperwork expressions; their old canonical senses remain taught elsewhere with unchanged IDs and payloads. API startup appends seed updates only above explicitly fingerprinted, untouched historical drafts; owner edits, publications and newer revisions stay intact. The greeting opening adds new draft IDs without changing prior lesson revisions. Existing notebook examples and review history are preserved.

Return to Profile → Load published lessons to save published revisions into this browser. Later draft changes stay separate. Previous attempts/notebook entries remain recorded when a new revision arrives. A newer revision starts its own lesson progress. Editor requests require the exact local browser origin and a guarded JSON request; this is local origin protection, not account authentication or public-hosting access control.

Profile also supports learning backup/restore. Download a private, unencrypted file containing attempts, manual review ratings, notebook entries and cached published lessons (not server drafts/credentials/recordings). Choose a backup to inspect counts/date, confirm the merge policy, then restore and reload learning. Existing personal notes win; duplicate events stay single; immutable conflicts abort the whole restore. Only supported UTF-8 backups up to 5 MB are accepted. Version 2 exports include ratings; version 1 files remain importable with no invented review history. Server curriculum has separate local snapshot commands below.

Device speech is optional, synthetic, and depends on an installed French browser/device voice. Text is always available. Optional text/recorded-input AI conversation and explicit saved neural speech are implemented; see setup below. Per-topic downloads, the complete curriculum editor, production/listening review and mobile packages remain planned.

Profile → French audio lists this browser's French voices, lets you choose Slow/Gentle/Normal speed, and offers an explicit device sample preview. Automatic selection prefers France French on the device; it is not a voice-quality ranking. If the saved device voice is unavailable, another French voice is used. Profile → Neural French audio is a separate explicit Azure audition/save flow described below. Choices stay in this browser and are separate from learning backups. [Current voice options](VOICE_OPTIONS.md) records the investigation and listening limits. Ordinary speaker playback never generates paid speech.

## Optional saved neural French audio

The owner prefers natural, calm French with no gender preference. Profile → Neural French audio offers Denise and Henri (France French), a gentle slower-neutral pace or normal pace, an editable short sample and explicit **Generate and save (may use credits)**. Actual quality still needs listening; no real provider audition was made during development.

Configure `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` in the API process environment using your Azure Speech resource's matching key/region, then deliberately start/restart the local API with `npm run dev:api`. Do not put credentials in the browser or a committed file; no real `.env` file is loaded automatically. `.env.example` documents the optional settings. Ordinary study and device voices work without Azure configuration. The standard exported preview uses `http://localhost:8082`. The API accepts exact localhost/127.0.0.1 origins on ports 8081, 8082 and 8084; 8084 is an optional alternate origin, not a required review build. Restart the intended API instance after configuration or code changes.

Generate sends the displayed French text to Azure and saves verified audio locally. It accepts up to 500 characters. **Play saved sample** reuses it. Enable **Use saved neural audio** to let ordinary speaker buttons use the exact saved text/voice/pace; missing or damaged clips use device/text fallback. Beside a speaker, **Audio options** opens a dialog to explicitly generate/save that phrase. Changing text, voice or pace needs its own clip. An unchanged clip can be reused across lesson revisions. Browsing, availability checks and normal playback never generate audio or spend provider credits.

Saved browser clips replay after reload and offline once the app itself has been downloaded under Learn offline. App downloads do not generate/download a speech library automatically. Browser audio storage needs CacheStorage, Web Crypto and Web Locks; unsupported/quota/corrupt storage shows a recoverable message. Explicit uncertain retries retain their request ID; a confirmed ended attempt requires another deliberate generation, and failed attempts may count. A local write failure can retry the verified response without another API call.

The server retains generated clips and their French text in the separate ignored `data/generated-speech.sqlite` (or `SMARTLINGO_SPEECH_DATABASE_PATH`). It has a versioned schema, durable daily reserved attempts (default 40, configurable 1–200), one leased generation at a time, 30-day request replay retention, 10,000 request rows and 512 clips/64 MiB decoded audio capacity. Limits refuse new generation before spending rather than silently evicting/regenerating. Counters describe local reserved attempts, not provider billing. Server cache hits survive restart and can be retrieved without generation credentials. Provider processing is governed separately by the Azure account.

**Remove saved browser audio** asks for confirmation and clears only this browser's clips; it leaves a small removal marker, preserves learner history/app downloads/unrelated caches, and does not remove the separate server cache. Speech caches are private, unencrypted and excluded from both learning-backup files and curriculum snapshots. No raw microphone recording is stored by this synthetic-audio feature. Actual Azure/voice quality, phone/Safari/native and screen-reader checks remain open. [Decision and boundaries](decisions/0018-explicit-cached-neural-speech.md).

## Test the offline-ready preview

```sh
npm run build:web
npm run preview:web
```

Open `http://localhost:8082`. In Profile → Learn offline, choose Download for offline use and wait for Ready for offline use. This saves the app, bundled draft lessons and pictures included in that export (123 lessons in a fresh build of the current source). An already running older preview may contain fewer lessons/features until rebuilt. You can then disconnect or stop both local servers and reload at the same address. Loaded publications, saved vocabulary, progress and manual review use the existing browser storage. Learn offline does not generate or include voices; explicitly saved neural clips use their separate browser cache, while device speech may need a connection. Use the browser menu's Install/Add to Home Screen option if it is available; offline readiness is shown separately.

Port 8082 has separate browser storage from development on 8081. To bring existing learning across, download a private learning backup from the old address, then explicitly restore it in Profile at the new address. Do not clear the old browser data to make that transfer.

Profile shows download size, saved complete-copy size, progress, status and retry/update/removal controls. Updates retain previous complete copies for older tabs; removing downloaded assets clears all those app copies while preserving notebook, practice/review events and loaded publications. Interrupted staging files are cleaned on retry/removal; sizes describe complete-copy files and exclude staging/browser overhead. Keep a separate private learning backup because browser storage may be evicted.

This local route requires a browser with service workers, Web Locks and a secure localhost context. Expo development does not offer offline downloads. Actual phone/Safari installation and offline voice quality are unverified; this is not a public/LAN deployment.

## Back up and recover server curriculum

From the repository root:

```sh
npm run backup:curriculum
```

This prints the path of a new private SQLite snapshot under `data/backups/` and counts of lessons/stored revisions/publications. It includes every server curriculum revision, including unpublished edits, and can run while the API is open. It does not include browser learning data, `.env` files, recordings or credentials. Keep an off-device copy separately; local snapshots are unencrypted and ignored by Git. Use `--source PATH` and/or `--destination NEW.sqlite` to choose files explicitly.

To recover a backup, use its printed filename and choose a new destination:

```sh
npm run restore:curriculum -- --source "data/backups/YOUR-BACKUP.sqlite" --destination "data/recovered.sqlite"
```

Recovery validates SQLite integrity, the supported schema and every historical lesson revision, then writes a separate file. It refuses existing destinations and never replaces the running database. Source snapshots remain unchanged. The filesystem must support hard links; unsupported/invalid inputs fail without replacing files.

To use the recovered copy, stop the API instance you intend to switch, then set its database path before starting it. In PowerShell:

```powershell
$env:SMARTLINGO_DATABASE_PATH = 'data/recovered.sqlite'
npm run dev:api
```

The configured file must already exist and pass validation. Relative paths resolve from this repository root even when npm starts the API workspace. Normal startup seed preservation still applies; actual publications and owner edits remain intact. Keep the original database and snapshot separately. After stopping that API, `Remove-Item Env:SMARTLINGO_DATABASE_PATH` returns later starts to the default database. No real `.env` file is loaded automatically. Use `npm run backup:curriculum -- --help` or the restore equivalent for command help.

## Optional AI French practice

Open **Practice** to choose a lesson context and start a temporary French conversation. Send a message to receive French, its English translation, gentle feedback and an optional phrase to save in your editable notebook. English help is available with a message. Speaker buttons replay through the existing French device voice.

For microphone input, also configure `OPENAI_TRANSCRIPTION_MODEL` on the server. Record French captures up to thirty seconds locally. Stop recording releases the microphone; **Transcribe recording** explicitly sends the clip to OpenAI and may use API credits. Review/edit the resulting text before a separate **Send message** action. Discard, Stop conversation and leaving Practice clear temporary clips. Recording requires a supported browser and microphone permission; typing remains available if permission is denied. Clips are limited to two MiB; SmartLingo does not write them to disk or include them in backups. Provider processing/retention is separate from local temporary storage.

The local API needs `OPENAI_API_KEY` and `OPENAI_TEXT_MODEL` in its process environment. Choose a model your API account supports with the Responses API and Structured Outputs, then start `npm run dev:api`. The app never asks for or stores the key. No real `.env` file is loaded automatically; `.env.example` documents configuration. Restarting an already running API is required to load new environment settings.

Only explicit message sending or recording transcription calls OpenAI. Session creation, availability checks, recording locally, device replay and notebook saving do not. Text, selected context and explicitly submitted clips are processed externally; avoid private details. Conversations are temporary and are discarded when you leave practice, reload or stop. Explicitly saved phrases remain in your browser notebook. Provider retention is governed separately by your API account settings; conversation requests use `store:false`, which is not a zero-retention guarantee.

The API bounds session turns, reserves a daily attempt for each conversation or transcription call, permits one active call, and times out/cancels pending work. A manual retry keeps the request ID to recover an uncertain response. A confirmed failed attempt permits a fresh explicit send, which can use additional credits. Failed calls can consume allowance. Displayed attempts and provider-reported conversation token totals are local operational counters, not billing totals; transcription tokens are not reported here. Counters reset when the API restarts. Ordinary lessons remain available without AI configuration or network access. Real provider/model quality, microphones and audible voice still require owner testing.
