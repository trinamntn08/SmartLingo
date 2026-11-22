# Local learner and API operations

Current operational instructions for this source checkout. For installation and the short command list, start with [README](../README.md). For verified scope and remaining work, use [STATUS](STATUS.md). Ports below are configured defaults, not a claim that a process is currently running. Keys are optional server-process settings; no real `.env` is loaded automatically.

## Choose a language and learn

On a fresh homepage, choose **Learn French** or **Learn Japanese**. Both open the same Today, Learn, Review, Report and Profile screens. **Learn** replaces the former Explore/Practice pair: use **Vocabulary & lessons** for the topic catalogue and complete lessons, **Listening & videos** for comprehension and external resources, and **Speaking** for guided oral practice. Today also has listening and speaking shortcuts. English explanations are directly visible; Japanese adds kana readings within the same cards. These are written reading aids, not word-by-word romaji, IPA or a pronunciation assessment. Basic letter rows show romaji; French words have optional speaker playback but no universal written pronunciation field. The language button (French or Japanese) or **SmartLingo home** returns to the chooser. Your choice persists when browser settings storage is available; each language keeps its own displayed notebook and lesson progress. Private learning backups include both languages.

Use **Learn → Vocabulary & lessons** to choose a topic. Short lessons appear above the searchable vocabulary grid; **All topics** returns to discovery. Use **Review → Add personal word** for your own vocabulary in the selected language, with optional Japanese kana. Device speech/voice-speed settings are shared and language-specific. Japanese also has a free local VOICEVOX fallback when no matching device voice is installed; [Japanese audio setup and credits](JAPANESE_AUDIO.md) explains installation, preview and offline clips. Japanese never uses the French neural voice cache or provider. Optional AI conversation and Azure neural generation remain French-only.

In a shared lesson, study the words, read the dialogue, solve the matching exercise and build a sentence. A correct sentence completes the lesson after the earlier activities. The sentence activity shows the result and **Back to lessons**.

## Listening comprehension, video resources and speaking

For a first Japanese visit, **Today → Start Hiragana** or **Learn → Japanese letters** opens the alphabet path first. Study the five vowels, then the remaining Hiragana rows before Katakana. **Choose another row** opens numbered cards that preview the kana and show current, suggested and studied status; swipe/scroll the row path or use **Previous group / Next group**. Keyboard focus and screen-reader names expose the same progress cues. Each row shows its characters, romaji readings, notes and optional sound. Try every character in Recognition practice, then explicitly **Mark row studied**. Mistakes still count as an attempt; studied does not mean mastered. Only a confirmed save advances the row. **Continue Japanese letters** resumes the first unstudied row after reload; existing learning backups include the row-completion events. Storage errors keep browsing/practice available and use the usual Retry save flow. Freely choose any row or open Vocabulary & lessons at any time. [Alphabet scope and sources](curriculum/japanese-alphabet-sources.md) explains the 92 basic forms and later topics not covered here.

Open **Learn → Listening & videos**, or use Today's **Listening & videos** shortcut. Press **Play sentence** to begin with the current lesson. **Change lesson** opens the lesson chooser. Select the English meaning and use **Check answer** for feedback. **Show transcript** gives text support, and playback failure opens the transcript automatically. Replay, skip or continue at your own pace. The questions use existing authored examples. Answers stay in the current session.

**Browse videos & audio** opens the French or Japanese listening library. Use the level and format filters to find a resource. On phones, open **Filters** to see those options. Expand **Listening notes** for captions, access and a practice suggestion. The 11 French and 5 Japanese recommendations open on their providers and need internet for playback. **Back to practice** returns to the same sentence. See the [dated source/access record](curriculum/listening-resource-sources.md).

Browser Back and Forward move between visited screens and activity steps, including listening sentences. The player also offers **Previous sentence**. You can copy a lesson URL such as `/lesson/fr/fr.essentials.repair/dialogue` or refresh a step to stay there. Answers for temporary practice return during traversal in the same tab. Saved course and lesson progress comes from browser storage. For offline links, update your saved app copy in **Profile → Offline & backups** while online.

Open **Learn → Speaking**, or Today's **Speaking practice** shortcut. Choose a lesson and role, listen to the partner and say your response aloud. English meanings remain visible; Show model reply and Japanese readings offer support. Repeat this role or choose the other side. Guided practice needs no microphone and stores no recordings or oral score. Expand **Optional AI conversation** below guided speaking to use French AI practice. Its explicit sending/transcription controls remain separate. Closing this panel or leaving Speaking clears that temporary conversation and local recording.

## Your dashboard and learning report

After choosing a language, **Today** offers one recommended lesson or Japanese row activity, a compact daily-course entry and secondary learning tools. **Learn** owns topic discovery; topics are no longer repeated across every page. **Report** owns the four saved-activity summaries, weekly chart and every topic's lesson and vocabulary counts. Use its Study topic buttons to return to a topic or Review saved words to open your notebook. **What counts here?** expands the metric definitions.

The four summaries count current lesson sessions completed, distinct vocabulary explicitly studied, notebook entries saved and valid daily-course completions. The weekly chart counts saved lesson attempts, course study/practice/self-review/completion and recognition ratings in your browser's current timezone, Monday through Sunday. Browsing, practice-hint reveals and editing a note do not add practice actions. Repeated immutable event IDs count once; future timestamps/dates are excluded. These describe saved activity and do not assess independent language ability.

Reports refresh after returning from learning, after confirmed writes, on focus and about once a minute. They read existing browser data without changing it. If history cannot be opened, **Retry report** retries the read and the report remains unavailable; no zero history is invented. You can still browse lessons. The report is included in the exported offline app; learning backups continue to contain the source history, with no new report store, account or AI requirement.

## Try the daily-course pilot

Choose French, then **Today → Open daily course**. Two draft days are available: study bilingual sections, save useful words, answer contextual choices and explicitly save a manual self-review. Save each study section before using Next section; **Browse sections** opens direct section navigation and **Choose a study day** opens day selection. Complete study day becomes available after every section is saved. Reopen after reload to resume the saved day/section. Missed calendar dates do not skip content.

**Source credits and licence** shows the exact BCcampus text source, author, copyright, CC BY 4.0 link, changes and exclusions. Study does not fetch that website or require imported media/AI. Optional device speech is separate. Optional written self-review remains only on the current screen; course events, completion and notebook saves persist. Learning backup v4 includes course events and Japanese notebook metadata and accepts earlier v1/v2/v3 files; the normal explicit restore/reload flow applies. New backups require the updated app; older app versions cannot import v4.

These are bundled owner-review drafts, not an imported book, published curriculum or complete A1–B1 course. [Pilot acceptance](plans/0028-open-course-pilot.md), [continuation](plans/0031-daily-course-continuation.md) and [source/rights record](curriculum/open-course-pilot-sources.md) describe the bounded release.

## Try the Japanese route

Choose **Learn Japanese**. Its 13 topic banks, each with 30 distinct entries across five short lessons, appear in the same Learn topic catalogue and short-lesson screens as French, with vocabulary, dialogue, meaning practice and sentence building. **Today → Open daily course** also retains the original daily-course activities and day/section progress. Filter days by level or browse freely; all study text, English support and kana readings are bundled. Completion and explicit next-day navigation remain independent of French.

Shared vocabulary cards show Japanese readings, examples, translations and usage notes directly. Save phrases and find them under **Review**; search includes kana readings and preserves dakuten distinctions. Notes retain editable readings and language. Existing daily-course events remain intact; completion of an old day does not invent completion of the new short-lesson exercises. Japanese speech is optional and uses a device voice, an already saved clip or the free local VOICEVOX service. The separate alphabet path covers basic Hiragana/Katakana; voiced marks, combinations, long vowels, kanji, handwriting and a full script syllabus remain outside its scope. Japanese AI conversation and automatic production assessment remain unimplemented.

**Authorship and review** shows original AI-assisted provenance. No textbook text or media is imported and no third-party licence is claimed over these additions. These short draft units do not constitute complete CEFR-level coverage or certification. Owner and qualified Japanese review are pending. See the [implementation plan](plans/0029-japanese-course-b1.md) and [authorship/level research](curriculum/japanese-course-sources.md). Download the updated exported app through Profile for cold-offline use; ordinary Japanese study needs no API or AI key.

## Run the preview

Use Node 24.19.0 and npm 11.x, then run from the repository root:

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Expo and choose a language. No API key is required. For French, start with Everyday greetings and politeness; for Japanese, Today recommends Start Hiragana. Study with meanings, examples, translations and explanations visible directly, save a word, and find/edit it under Review. Returning learners resume their previously studied lesson. Restaurant and every other topic remain freely accessible. Attempts and notebook entries are stored in this browser's IndexedDB and survive reload. Use the same hostname/port/browser to return to that storage. Browser data can be cleared or evicted; keep a backup using Profile → Offline & backups → Download learning backup.

Choose a topic in Learn > Vocabulary & lessons; All topics returns to discovery. Click SmartLingo to return home, including from the editor; unsaved editor fields stay available when you reopen it. Learn > Vocabulary & lessons places short lessons above the full vocabulary grid, with target-language/English search (including Japanese readings) and estimated-level filters. Japanese Learn opens Japanese letters by default. Lesson vocabulary also appears together: no Next word sequence. Meanings, fuller everyday examples and explanations stay visible, with compact noun gender markers, a speaker icon beside each word, and Save on each card. Continue to dialogue explicitly records review of the displayed set; browsing alone records no study. The opening greetings bank has 24 expressions across three eight-item lessons; other banks contain 30–35 distinct expressions across five short lessons of 6–8 items.

Vocabulary cards use locally bundled, licensed photographs where a reviewed source matches the word or its situation. Literal photos retain the whole object; contextual images are labelled Situation photo. Other words retain the original drawings or visible text support; abstract practice still uses meaning matching. Study makes no remote photo requests or paid image calls. See [photo coverage and gaps](PHOTO_COVERAGE.md), [photo sources/licences](PHOTO_SOURCES.md), [original illustration records](MEDIA_SOURCES.md) and [curriculum research](CURRICULUM_RESEARCH.md).

Review offers target-language→meaning cards for vocabulary saved in the selected language. Try to recall before revealing, then choose Again, Needed help or Remembered. These are manual recognition ratings, not a proficiency assessment. Independent due-day recall follows a 1/3/7/14/30-day calendar schedule; help returns the item tomorrow. Early or repeated same-day recall does not advance the schedule. Editing a note starts fresh practice for that revision while preserving prior ratings. Ratings survive reload and are included in backups.

Use Review → Add personal word to save your own French or Japanese, English meaning and optional example without an API. Japanese also offers optional word/example kana readings. Search notebook finds target text, readings, English and examples; French search tolerates accents/case while Japanese preserves dakuten distinctions. Clearing a search restores all saved entries; hiding an entry does not discard an unsaved edit. Personal entries join the existing review and private backup flows.

Optional, in a second terminal:

```sh
npm run dev:api
```

The local API listens at `http://127.0.0.1:3001` with `/health`, `/lessons`, `/lessons/fr.restaurant.customer`, and `/published-lessons`. It seeds drafts into ignored `data/smartlingo.sqlite`. The learner uses bundled/cached lessons and remains usable while this API is stopped. Host overrides are limited to loopback; LAN access/authentication is not implemented.

For editing, open the learner at `http://localhost:8081` (development) or `http://localhost:8082` (exported preview), choose Profile → Curriculum tools → Open curriculum editor (or `/editor`), select a lesson, edit its fields, and save a draft revision. Existing `/#editor` links open the same workspace. Preview the saved revision, inspect the answer keys and provenance, then explicitly confirm your review before publishing. Preview practice is temporary and does not change learner progress. Fields cover headings/outcome, topic, learner role, estimated level, vocabulary support, existing dialogue roles/French lines/English translations, and grammar. Vocabulary target words, pictures, exercises and dialogue line count/order stay fixed in this slice. Blank required fields prevent saving.

Estimated content levels are Foundations, A1 and A2; they do not measure learner proficiency. Bundled drafts include all three levels. Estimated duration is editable from 1 to 60 whole minutes. A published topic change moves that lesson into the new topic bank when you explicitly load publications. Match the learner role name to the relevant dialogue speaker labels; those labels are edited separately.

Word notes may be empty, and noun gender can be changed separately. Five reviewed lessons are draft revision 4, fifty-five earlier lessons remain revision 3 and sixty earlier additions plus three new greeting lessons remain revision 1. The [vocabulary audit](CURRICULUM_REDUNDANCY_AUDIT.md) replaces 16 redundant introduction slots with useful routine/paperwork expressions; their old canonical senses remain taught elsewhere with unchanged IDs and payloads. API startup appends seed updates only above explicitly fingerprinted, untouched historical drafts; owner edits, publications and newer revisions stay intact. The greeting opening adds new draft IDs without changing prior lesson revisions. Existing notebook examples and review history are preserved.

Return to Profile → Curriculum tools → Load published lessons to save published revisions into this browser. Later draft changes stay separate. Previous attempts/notebook entries remain recorded when a new revision arrives. A newer revision starts its own lesson progress. Editor requests require the exact local browser origin and a guarded JSON request; this is local origin protection, not account authentication or public-hosting access control.

Profile → Offline & backups also supports learning backup/restore. Download a private, unencrypted file containing attempts, manual review ratings, notebook entries and cached published lessons (not server drafts/credentials/recordings). Choose a backup to inspect counts/date, confirm the merge policy, then restore and reload learning. Existing personal notes win; duplicate events stay single; immutable conflicts abort the whole restore. Only supported UTF-8 backups up to 5 MB are accepted. Current version 4 exports include both languages, Japanese reading metadata, course events and alphabet row-study events alongside ratings. Version 1/2/3 files remain importable; no missing history is invented. Older apps cannot import version 4. Server curriculum has separate local snapshot commands below.

Device speech is optional, synthetic, and depends on an installed voice matching the selected language; Japanese can alternatively use saved clips or the free local engine. Text is always available. Optional text/recorded-input AI conversation and explicit saved neural speech are implemented; see setup below. Per-topic downloads, the complete curriculum editor and independently assessed production/listening remain planned. This branch has no Android build commands; Android test-APK work is on the separate branch described in [repository state](REPOSITORY_STATE.md).

Profile → Audio & pronunciation → French audio lists this browser's French voices, lets you choose Slow/Gentle/Normal speed, and offers an explicit device sample preview. Automatic selection prefers France French on the device; it is not a voice-quality ranking. If the saved device voice is unavailable, another French voice is used. Profile → Audio & pronunciation → Neural French audio is a separate explicit Azure audition/save flow described below. Choices stay in this browser and are separate from learning backups. [Current voice options](VOICE_OPTIONS.md) records the investigation and listening limits. Ordinary speaker playback never generates paid speech.

## Optional saved neural French audio

The owner prefers natural, calm French with no gender preference. Profile → Audio & pronunciation → Neural French audio offers Denise and Henri (France French), a gentle slower-neutral pace or normal pace, an editable short sample and explicit **Generate and save (may use credits)**. Actual quality still needs listening; no real provider audition was made during development.

Configure `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` in the API process environment using your Azure Speech resource's matching key/region, then deliberately start/restart the local API with `npm run dev:api`. Do not put credentials in the browser or a committed file; no real `.env` file is loaded automatically. `.env.example` documents the optional settings. Ordinary study and device voices work without Azure configuration. The standard exported preview uses `http://localhost:8082`. The API accepts exact localhost/127.0.0.1 origins on ports 8081, 8082 and 8084; 8084 is an optional alternate origin, not a required review build. Restart the intended API instance after configuration or code changes.

Generate sends the displayed French text to Azure and saves verified audio locally. It accepts up to 500 characters. **Play saved sample** reuses it. Enable **Use saved neural audio** to let ordinary speaker buttons use the exact saved text/voice/pace; missing or damaged clips use device/text fallback. Beside a speaker, **Audio options** opens a dialog to explicitly generate/save that phrase. Changing text, voice or pace needs its own clip. An unchanged clip can be reused across lesson revisions. Browsing, availability checks and normal playback never generate audio or spend provider credits.

Saved browser clips replay after reload and offline once the app itself has been downloaded under Learn offline. App downloads do not generate/download a speech library automatically. Browser audio storage needs CacheStorage, Web Crypto and Web Locks; unsupported/quota/corrupt storage shows a recoverable message. Explicit uncertain retries retain their request ID; a confirmed ended attempt requires another deliberate generation, and failed attempts may count. A local write failure can retry the verified response without another API call.

The server retains generated clips and their French text in the separate ignored `data/generated-speech.sqlite` (or `SMARTLINGO_SPEECH_DATABASE_PATH`). It has a versioned schema, durable daily reserved attempts (default 40, configurable 1–200), one leased generation at a time, 30-day request replay retention, 10,000 request rows and 512 clips/64 MiB decoded audio capacity. Limits refuse new generation before spending rather than silently evicting/regenerating. Counters describe local reserved attempts, not provider billing. Server cache hits survive restart and can be retrieved without generation credentials. Provider processing is governed separately by the Azure account.

**Remove saved browser audio** asks for confirmation and clears only this browser's clips; it leaves a small removal marker, preserves learner history/app downloads/unrelated caches, and does not remove the separate server cache. Speech caches are private, unencrypted and excluded from both learning-backup files and curriculum snapshots. No raw microphone recording is stored by this synthetic-audio feature. Actual Azure/voice quality, phone/Safari/native and screen-reader checks remain open. [Decision and boundaries](decisions/0018-explicit-cached-neural-speech.md).

## Test the offline-ready preview

Use `http://localhost:8082` as the single local review preview. Keep the same hostname, port and browser profile so the learner keeps access to existing notebook entries, progress and downloads.

Run `npm run build:web` from the review checkout for each new version. It replaces the export in `apps/learner/dist`. Once the build finishes, refresh the existing tab. A preview already serving that directory reads the updated files from disk, so it can keep running. Start `npm run preview:web` on the same address if the preview is stopped. The initial setup uses both commands.

```sh
npm run build:web
npm run preview:web
```

Verify that the served `/offline-manifest.json` build ID matches `apps/learner/dist/offline-manifest.json` and check the change at the same review address. If a listener is serving another workspace or a test fixture, identify it before switching the review service.

In Profile → Offline & backups → Learn offline, choose **Download for offline use** or **Update offline copy** and wait for **Ready for offline use**. This saves the app, bundled draft lessons and pictures included in that export (French and Japanese short lessons, daily-course text and basic Japanese letters). You can then disconnect or stop both local servers and reload at the same address. Loaded publications, saved vocabulary, progress and manual review use the existing browser storage. Learn offline does not generate speech or install voices/VOICEVOX. Saved French neural clips and Japanese clips use separate browser caches; previously uncached Japanese speech needs a device voice or the API plus local engine. Device speech may need a connection. Use the browser menu's Install/Add to Home Screen option if it is available; offline readiness is shown separately.

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

Video/audio resources are now directly in **Learn > Listening & videos**, with French and Japanese libraries described above. Changing learning sections clears any temporary French conversation and recording.

In **Learn > Speaking**, expand **Optional AI conversation** below guided speaking. Choose a lesson context and start a temporary conversation. Send a message to receive French, its English translation, gentle feedback and an optional phrase to save in your notebook. English help is available with a message. Speaker buttons use your French audio settings.

For microphone input, also configure `OPENAI_TRANSCRIPTION_MODEL` on the server. Record French captures up to thirty seconds locally. Stop recording releases the microphone; **Transcribe recording** explicitly sends the clip to OpenAI and may use API credits. Review/edit the resulting text before a separate **Send message** action. Discard, Stop conversation and leaving Speaking clear temporary clips. Recording requires a supported browser and microphone permission; typing remains available if permission is denied. Clips are limited to two MiB; SmartLingo does not write them to disk or include them in backups. Provider processing/retention is separate from local temporary storage.

The local API needs `OPENAI_API_KEY` and `OPENAI_TEXT_MODEL` in its process environment. Choose a model your API account supports with the Responses API and Structured Outputs, then start `npm run dev:api`. The app never asks for or stores the key. No real `.env` file is loaded automatically; `.env.example` documents configuration. Restarting an already running API is required to load new environment settings.

Only explicit message sending or recording transcription calls OpenAI. Session creation, availability checks, recording locally, device replay and notebook saving do not. Text, selected context and explicitly submitted clips are processed externally; avoid private details. Conversations are temporary and are discarded when you leave practice, reload or stop. Explicitly saved phrases remain in your browser notebook. Provider retention is governed separately by your API account settings; conversation requests use `store:false`, which is not a zero-retention guarantee.

The API bounds session turns, reserves a daily attempt for each conversation or transcription call, permits one active call, and times out/cancels pending work. A manual retry keeps the request ID to recover an uncertain response. A confirmed failed attempt permits a fresh explicit send, which can use additional credits. Failed calls can consume allowance. Displayed attempts and provider-reported conversation token totals are local operational counters, not billing totals; transcription tokens are not reported here. Counters reset when the API restarts. Ordinary lessons remain available without AI configuration or network access. Real provider/model quality, microphones and audible voice still require owner testing.
