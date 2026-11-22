# Visual media sources and rights

Created 2026-11-14 for the visual topic browser. Current binding counts checked against [visuals.ts](../packages/content/src/visuals.ts) and the bundled catalogue on 2026-11-22: 125 French bindings, 122 used by current French lessons. The render/contact-sheet review described below remains historical evidence from the original batch. For photographs and their separate rights, use [photo sources](PHOTO_SOURCES.md) and [current coverage](PHOTO_COVERAGE.md).

## Current language and media scope

The drawing inventory below and [photo coverage](PHOTO_COVERAGE.md) apply to French. The 380 current Japanese canonical words/phrases have no match in the photo or drawing lookup; Japanese uses visible meanings/readings/examples and meaning matching, not a claimed literal picture. The 20 basic-kana row lessons display original typed characters and notes rather than a licensed picture collection. [Japanese course sources](curriculum/japanese-course-sources.md), [topic vocabulary](curriculum/japanese-topic-vocabulary.md) and [alphabet sources](curriculum/japanese-alphabet-sources.md) record original text, bounded planning references and review limits.

Optional speech has separate provenance and operating boundaries: [Japanese audio](JAPANESE_AUDIO.md) records device voices and the free local VOICEVOX fallback/credits, while [voice options](VOICE_OPTIONS.md) covers the French/provider work. Saved synthetic audio is not a reusable human-recording licence or pronunciation approval. The shared Listening & videos library links to 11 French and 5 Japanese external resources; [its source record](curriculum/listening-resource-sources.md) records access, text support and limits. Those links do not import or relicense provider media, and media does not load before an explicit external link.

## French illustration inventory

Curriculum rework, 2026-11-15: the 125 existing bindings are retained, with 122 used by the current banks. Three bindings (`fr.bakery.chouquette`, `fr.administration.telephone`, `fr.administration.enveloppe`) remain explicitly historical so older notebook captures and lesson revisions keep their original pictures. New topics add no images. Abstract/unillustrated entries use visible meanings and meaning matching; the expanded course does not claim full picture coverage.

## Original bundled drawings
The ten initial illustrations live in apps/learner/src/ui/Illustration.tsx. New reusable vector drawings and word associations live in packages/content/src/visuals.ts and render through WordIllustration.tsx. All new SVG geometry and compositions were written originally for SmartLingo with AI assistance. No stock photo, Facebook image, textbook artwork, emoji font, icon library or third-party image was copied or fetched. No third-party attribution or licence grant is claimed. The owner must still review clarity, sense, accessibility descriptions and suitability before wider publication.

The new visual catalogue is separate from lesson revisions. Associations use stable vocabulary IDs and exact current target text; changed targets do not receive an outdated new illustration. Existing concrete curriculum pictures remain the fallback. SVGs bundle with ordinary web assets, have no scripts or remote image dependencies, and require no AI/API request during use. The explicit offline web download now saves those bundled assets for cold reloads; see [ADR 0012](decisions/0012-offline-web-assets.md).

The offline web manifest and app header use an original code-drawn open book in [icon.svg](../apps/learner/public/icon.svg). It contains no external resource. Browser and device icon suitability remains subject to owner review.

## Bundled presentation scenes and type

The 2026-11-22 frontend rework uses four original photorealistic contextual scenes generated with the built-in ImageGen tool from the written prompts below. No outside image or supplied interface artwork was an input. The scenes depict illustrative places and fictional people. The workspace JPEGs were resized and recompressed from the generated PNGs, keeping the composition intact. They travel in the web/offline asset pack and load locally. Spot-checks cover scene clarity and cropping. Owner review of presentation suitability remains open. The existing word-photo licence inventory and answer bindings apply independently. [Photo sources](PHOTO_SOURCES.md)

| Asset | Use | SHA-256 |
| --- | --- | --- |
| [French café and bakery](../apps/learner/public/learning-scenes/french-street.jpg) | Language chooser, French Today and contextual cover fallback | `620c5a45f0c101c86e8e361f4519d89def088c937765566adbf33c65cfb57c08` |
| [Japanese neighbourhood](../apps/learner/public/learning-scenes/japanese-street.jpg) | Language chooser, Japanese Today and general contextual cover | `e4a0ab9f261f822c65aba705f37252ab59e393bd94805f8d3a73e453a6653c11` |
| [Japanese produce counter](../apps/learner/public/learning-scenes/japanese-market.jpg) | Japanese shopping topic and related lesson context | `ad09ddfe5cdc83003673899e34b903cf79f87fc71a9e863b6ff00d3543b8e6a5` |
| [Japanese station](../apps/learner/public/learning-scenes/japanese-station.jpg) | Japanese station and time topic and related lesson context | `18e4c409743a1571b5c843ffe2ca4522a8a0f6c228e23ebf2fad2eea68a3e72c` |

The browser uses the unchanged Inter variable WOFF2 from the Inter 4.1 release. The public font directory includes the upstream SIL Open Font License 1.1 and copyright notice. Japanese characters use the system fallback stack. [Inter 4.1 release](https://github.com/rsms/inter/releases/tag/v4.1) · [Bundled font](../apps/learner/public/fonts/InterVariable.woff2) · [Bundled license](../apps/learner/public/fonts/Inter-LICENSE.txt)

## Image generation prompts

### french-street

```text
Use case: photorealistic-natural. Asset: original contextual hero photo for an adult French language learning website. Wide 3:2 horizontal editorial photograph of a real-feeling everyday neighbourhood street in Lyon, France, seen close to one corner bakery and café. Cream limestone façades, deep teal awning and dark green door, warm bread and simple ceramic cups visible through the window, one small coral accent, two adult neighbors naturally passing in the midground. Soft clear late morning daylight, candid street photography, realistic textures, inviting and contemporary. Frame the shop entrance and two outdoor tables within the central 65% so they remain recognizable when sides crop on mobile. No lettering, signage text, logos, watermark, Paris monuments or graphic overlays. The scene is illustrative, not a portrait of a specific real place.
```

### japanese-street

```text
Use case: photorealistic-natural. Asset: original contextual hero photo for an adult Japanese language learning website. Wide 3:2 horizontal editorial photograph of an everyday small Japanese neighborhood street near a Tokyo community shopping lane, sunlit muted teal shopfront, cream plaster and natural timber, small red cloth curtain without characters, parked city bicycle and two adults in casual clothes walking at a natural distance. Fresh pale sky and soft midday sunlight, composed like contemporary travel reportage, photographic depth and believable details. Put the bicycle and entrance in the central 65% for cropping. No legible signage, lettering, logo, watermark, identifiable real locations, tourist monuments, or graphic overlays.
```

### japanese-market

```text
Use case: photorealistic-natural. Asset: original contextual course topic cover for an adult language-learning website. Wide horizontal 3:2 editorial photo of a small everyday Japanese produce counter. A shopkeeper in a simple slate apron placing a paper bag by a fresh display of mandarins, daikon, greens and baskets. Wood, ceramic, cream walls, a muted jade accent, bright natural daylight, authentic unposed human posture, central close composition that survives a wide banner crop. No visible text, graphic overlay, stickers, logos, watermarks, or specifically identifiable person or shop.
```

### japanese-station

```text
Use case: photorealistic-natural. Asset: original contextual course topic cover for an adult language-learning website. Wide horizontal 3:2 editorial photo of an everyday Japanese suburban rail station platform in soft afternoon light. A cream and teal commuter train stopped beside tactile yellow paving, a simple analog clock, a few adults waiting in the midground. Calm realistic composition with recognizable train carriage and platform in the central 65% suitable for crop. Natural photography, pale sky, warm cream and deep teal, no readable signage, numbers, lettering, logos, overlays or watermarks.
```


## Meaning and accessibility
Draw recognizable concrete objects where possible, with descriptive English alt text. A scene must describe its context honestly; an abstract word does not need a decorative object masquerading as its literal meaning. Word targets, English senses, original examples/translations and explanations remain directly visible with or without an illustration. Picture practice keeps its explicitly authored answer key; new meaning practice continues to use written meanings.

The original drawing batch covered 125 stable vocabulary IDs with 122 distinct original drawings: 108 literal and 17 explicitly described context bindings, across the then-existing 12 topics. Canonical ID/target and resource-isolation checks pass. All 125 SVG data URIs decoded in Chromium, with no failures; the complete contact sheets and desktop/320px word grids were visually inspected. The independent reviewer checked generated path syntax, word associations and the unknown-ID fallback (including the JavaScript inherited name constructor). No remaining actionable finding. The original validation is recorded in [plan 0007](plans/0007-visual-topic-browser.md) and its checkpoint history. Automated asset identity/render checks do not establish linguistic or visual teaching quality. Phone/Safari/assistive-technology and owner review remain required.
