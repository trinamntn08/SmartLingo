# French voice options

Checked 2026-11-15. This is a technical comparison, not a listening assessment. No paid generation, provider credentials, recordings or owner learner data were used.

Owner preference: natural, calm French with no gender preference. The follow-up implements an explicit Azure audition/save flow for Denise/Henri with gentle neutral pacing, not a declared voice-quality winner. It caches verified clips for offline replay and keeps ordinary playback free of generation calls. [Setup and privacy boundaries](../README.md#optional-saved-neural-french-audio), [decision](decisions/0018-explicit-cached-neural-speech.md). Actual provider quality remains unverified without the owner's listening test.

## Improvement available now

Profile's French audio panel lists the French voices that this browser exposes, allows an explicit voice choice, offers Slow (0.7×), Gentle (0.85×) and Normal (1×), and plays a bilingual sample only on Preview. Existing lesson, notebook and AI reply speaker buttons use the same setting. Preview can be stopped; changing settings stops current speech. Browser speech errors retain visible lesson text.

The previous implementation chose the first French voice returned. Automatic selection now prefers local `fr-FR`, then another `fr-FR`, then another local French voice, then the first remaining French voice. This is a locality/locale policy, not a quality ranking. Explicit selection takes priority. If that voice disappears, playback falls back and Profile explains the temporary replacement; the saved choice can return when the voice does.

Settings use the separate versioned `smartlingo.audio-preferences.v1` browser localStorage key. They contain only voice identity and speed, are not learner history, and are not included in learner backups. Blocked storage retains the setting for the current visit and shows that persistence failed. Different browser origins/profiles have separate settings. Native audio remains future work.

## Browser constraints

The voice list comes from the current device/browser; SmartLingo cannot install or manufacture a better voice. The panel handles delayed discovery and subsequent `voiceschanged` events, and includes manual refresh. An empty list keeps text study usable and suggests installing French speech in device settings. [MDN getVoices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices), [MDN voiceschanged](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event).

The browser's `localService` flag distinguishes device from remote synthesis. Device speech may work offline after installation; remote speech can require connectivity and transmit spoken text to its service. App asset downloads do not include voices. This flag does not certify sound quality, offline readiness, or a provider's data policy. [MDN localService](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService).

Windows-specific check by the primary: Microsoft lists French natural Narrator voices Henri and Denise and documents on-device use after download. Those are Narrator capabilities; the documentation does not establish that a browser exposes the same voices through Web Speech. Do not promise that installing a Narrator voice changes SmartLingo. Refresh the app's actual voice list to see what is available; no Windows voice or setting was installed/changed during this task. [Microsoft supported languages/voices](https://support.microsoft.com/en-au/accessibility/windows/narrator/appendix-a-supported-languages-and-voices), [Narrator natural voice preview/offline behaviour](https://support.microsoft.com/en-us/accessibility/windows/narrator/complete-guide-to-narrator).

## Available engines and further audition candidates

| Option | What to audition | Network, cost and integration |
| --- | --- | --- |
| Browser device voices | Every available France-French voice, at Gentle and Normal speed. No universal best name can be inferred across devices. | Implemented now. No SmartLingo paid generation or AI key. Availability and offline behaviour depend on the device. |
| Azure Speech | Implemented audition candidates: `fr-FR-DeniseNeural`, `fr-FR-HenriNeural`. HD `fr-FR-Vivienne:DragonHDLatestNeural` / `fr-FR-Remy:DragonHDLatestNeural` remain future candidates. No asserted quality order. | A server REST adapter and verified cache are now implemented for Denise/Henri. Azure configuration and explicit network generation are required for a new clip. Neural synthesis is billed per character; exact rates vary, so no numeric clip-cost quote is asserted. |
| OpenAI audio | For new implementation, evaluate the currently recommended `gpt-realtime-2.1-mini` Realtime workflow. Do not begin a new dependency on legacy `/v1/audio/speech` models. | Requires server credentials, paid network generation and a different API workflow. Current list prices per million tokens: text input $0.60, text output $2.40; audio input $10, audio output $20. An end-to-end clip cost must include actual session usage; these are not per-minute prices. |

Azure's current catalogue lists the above French voices; capabilities/availability vary by region and voice. Its overview distinguishes neural and HD voices. [Azure language/voice support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts), [Azure speech overview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech), [Azure pricing](https://azure.microsoft.com/en-us/pricing/details/speech/).

OpenAI's current guide states that `tts-1`, `tts-1-hd`, and `gpt-4o-mini-tts` shut down on January 6, 2027. The recommended replacement is not accepted by `/v1/audio/speech`. Legacy documentation lists French support but notes its built-in voices are optimized for English; its general voice recommendations do not establish French teaching quality. Synthetic speech must be disclosed. [OpenAI text-to-speech guide](https://developers.openai.com/api/docs/guides/text-to-speech), [deprecations](https://developers.openai.com/api/docs/deprecations), [current pricing](https://developers.openai.com/api/docs/pricing).

Recommendation: first audition the available device voices. If none is satisfactory, compare a small Azure France-French sample set with OpenAI's current audio workflow before choosing an adapter. This is an engineering recommendation based on locale choices and integration requirements; no provider is claimed to sound better without listening.

## Listening acceptance and later provider expansion

Use the same samples for each candidate: “Bonjour ! Je voudrais un café, s’il vous plaît.”; “L’addition, s’il vous plaît.”; “Nous avons un rendez-vous à neuf heures.”; “Il y a deux euros et cinquante centimes.” Compare natural metropolitan French, liaison, numbers, pace and clarity on the intended desktop and phone. Have the owner or a competent French speaker approve the result; product labels and marketing claims are insufficient evidence.

The implemented Azure journey keeps permanent credentials server-side, requires explicit bounded generation, retains device/text fallback, and caches by version/provider/text/language/format/voice/pace identity. Saved verified clips replay offline without another paid call; a saved clip is not automatically owner-approved teaching audio. Provider processing is distinct from local server/browser retention. Additional providers, HD voices, bulk packs and a real quality comparison remain future work.

## Verification

The original adapter tests remain. New deterministic tests cover French locale/locality preference, explicit choice, missing voice fallback, delayed list availability, selected locale and speed, storage reload/corruption/denial, synchronous engine failure, and listener cleanup without replacing another subscriber. Real audible quality, OS voice installation and physical-phone/offline voice behaviour still need listening checks.
