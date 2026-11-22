# Focused listening and library

Status: completed

Owner: primary agent

## Outcome

Listening & videos opens on one centered exercise. The play control is the first obvious action. Learners can show the transcript, answer, replay or move on. A compact lesson action opens the lesson list on demand. Browse videos & audio opens a dedicated library, and returning resumes the sentence with its answer state.

## Relevant context

The [learner plan](../../PROJECT_PLAN.md#8-screens-and-visual-direction) calls for one main activity, accessible controls and calm typography. Both languages share the player and the existing [listening question and resource decisions](../decisions/0029-unified-learning-hub.md). The library uses explicit external links and [documented resource metadata](../curriculum/listening-resource-sources.md).

## Steps and ownership

1. The player UI builder owns `ListeningComprehension.tsx`. Center the player, give audio precedence and put lesson selection behind an action. Support transcript and playback states with the existing audio service.
2. The library UI builder owns `ListeningResources.tsx`. Present filters and scannable resource rows. Put practice, captions and access details behind optional notes.
3. The primary owns the Learn hub, the practice/library switch, browser and offline verification, and the checkpoint. Both builders use the inherited client model and reasoning effort. An independent reviewer inspects the integrated flow.

## Validation

Run repository and application checks, the French and Japanese browser journeys and listening cold-offline tests. Inspect the default player, lesson list and library at desktop and narrow sizes. Verify keyboard focus, continued practice after browsing, transcript fallback, and no network requests to external providers while browsing.

Passed repository checks, 277 tooling/application tests, 16 focused Chromium cases on the final export and two cold-offline cases. Directly checked the existing preview at 320, 390 and 1,440 px. Browser tests simulate speech or make it unavailable to exercise fallback. Actual audio quality remains an owner check.

## Progress and decisions

Practice stays mounted while the library is open. Hiding the exercise stops its audio. A return restores the current answer and transcript state in memory. The external library is opened on demand through the same entry point in both languages.

Japanese shows A1 and A2, podcasts and video exercises because the current Japanese resource list has entries in those categories. The library also hides unsupported filters in French when its inventory changes. On phones, learners open filters on demand. Resources show their title, provider, format, level and one playback link. Details expand within the relevant row.

## Handoff

Refresh `http://localhost:8082` and open **Learn → Listening & videos**. The preview serves verified export `beceb1ff465c`. Use **Browse videos & audio** to review the separate library.
