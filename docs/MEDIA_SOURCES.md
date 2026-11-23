# Visual media sources and rights

Created 2026-11-14 for the visual topic browser. Current binding counts checked against [visuals.ts](../packages/content/src/visuals.ts) and the bundled catalogue on 2026-11-22: 125 French bindings, 122 used by current French lessons. The render/contact-sheet review described below remains historical evidence from the original batch. See [generated vocabulary photographs](#generated-vocabulary-photographs), [current coverage](PHOTO_COVERAGE.md) and [historical stock photo rights](PHOTO_SOURCES.md).

## Generated image workflow

Generate all new SmartLingo website pictures, photos and illustrations using approved models. Use original prompts or documented SmartLingo-generated images as references. Exclude images sourced from the internet or any other outside source, even if they are licensed for reuse. Existing generated assets can be reused with a verified provenance record and a suitable crop. Existing code-drawn functional icons use the shared icon family. [Owner decision](decisions/0037-model-generated-imagery.md)

1. Write a brief that identifies the lesson or interface, the visible subject, the needed crop and the exact teaching purpose. Use fictional people, generic local scenes and unbranded objects. Keep instructional words and numbers in the UI. Base style on the two generated homepage photos when helpful.
2. Use a project-approved model and verify that the applicable terms cover the intended website, export and offline use. Keep originals and optimised outputs traceable to the same generation. Use accessible text or meaning practice when a suitable image is unavailable.
3. Inspect the actual image for lookalikes, signatures, watermarks, logos, recognisable characters, branded packaging or artwork, and misleading details. Verify responsive cropping, informative alt text and the precise vocabulary sense where the image teaches a word. A contextual scene must have a clear textual counterpart. Reject or regenerate any image with unresolved provenance or resemblance concerns.
4. Record the asset ID and path, lesson or surface, prompt and permitted references, model/version or available generation identifier, date, output hash, crop/export changes, model terms evidence, alt text, reviewer and release decision. Record provenance for existing generated assets before approving reuse. Verify this record and the bundled/offline asset path before public release.

The current learner and editor use generated photography. The archived stock inventory and its credit page remain in the previous release. The French daily course uses generated or text-based visuals. [French course delivery plan](plans/0043-french-daily-course.md#images-photos-and-course-rights)

## Current language and media scope

The drawing inventory below and [photo coverage](PHOTO_COVERAGE.md) apply to French. The 380 current Japanese canonical words/phrases have no match in the photo or drawing lookup; Japanese uses visible meanings/readings/examples and meaning matching, not a claimed literal picture. The 20 basic-kana row lessons display original typed characters and notes rather than a licensed picture collection. [Japanese course sources](curriculum/japanese-course-sources.md), [topic vocabulary](curriculum/japanese-topic-vocabulary.md) and [alphabet sources](curriculum/japanese-alphabet-sources.md) record original text, bounded planning references and review limits.

Optional speech has separate provenance and operating boundaries: [Japanese audio](JAPANESE_AUDIO.md) records device voices and the free local VOICEVOX fallback/credits, while [voice options](VOICE_OPTIONS.md) covers the French/provider work. Saved synthetic audio is not a reusable human-recording licence or pronunciation approval. The shared Listening & videos library links to 11 French and 5 Japanese external resources; [its source record](curriculum/listening-resource-sources.md) records access, text support and limits. Those links do not import or relicense provider media, and media does not load before an explicit external link.

## Generated vocabulary photographs

On 2026-11-22 the built-in OpenAI ImageGen tool produced ten original photo sheets for SmartLingo, plus one dedicated wholemeal-bread photo after a visual review. The two SmartLingo homepage photos were the only visual references. The written briefs identify individual French vocabulary objects and useful activity settings. Each approved tile was trimmed at the grid boundary and encoded as a local JPEG. The 120 JPEGs total 3,985,024 bytes and replace all 120 retired stock photos. The exact 397 vocabulary bindings remain, with alternative text rewritten to describe the generated images.

The [generation record](generated-vocabulary-photos.json) contains all final prompts, output identifiers, crop details and byte hashes. The [runtime catalogue](../packages/content/src/photos/catalogue.json) holds the image descriptions and language associations. This batch was visually reviewed for the local preview. Owner review for wider release remains open. Generated images and historical stock records have separate provenance. [OpenAI Europe Terms of Use](https://openai.com/policies/eu-terms-of-use/#content)

The current export and its offline pack use /generated-vocabulary-photos/ for these files. Previously installed builds can retain their own stock assets and credits. The new paths keep those older cached files separate from current image requests. [Historical stock photo rights](PHOTO_SOURCES.md)

## French illustration inventory

Curriculum rework, 2026-11-15: the 125 existing bindings are retained, with 122 used by the current banks. Three bindings (`fr.bakery.chouquette`, `fr.administration.telephone`, `fr.administration.enveloppe`) remain explicitly historical so older notebook captures and lesson revisions keep their original pictures. New topics add no images. Abstract/unillustrated entries use visible meanings and meaning matching; the expanded course does not claim full picture coverage.

## French dialogue scenes

Generated with the built-in OpenAI ImageGen tool on 2026-11-22 for SmartLingo. The only reference inputs were the previously generated [French homepage photo](../apps/learner/public/learning-scenes/french-street.jpg) and [Japanese homepage photo](../apps/learner/public/learning-scenes/japanese-street.jpg). The scenes show fictional adults in everyday places. The learner presents all dialogue, translation and practice as text. The [OpenAI Europe Terms of Use, Content section](https://openai.com/policies/eu-terms-of-use/) was reviewed on 2026-11-22 for output terms. The files are ready for local owner review.

The original PNGs were resized to 1,200 × 800 and encoded as JPEGs at quality 83. The reader displays a centred 2:1 frame up to 420 px wide. Compared the centre crops with the original frames, with both speakers and the setting legible. The files are bundled in the web and offline export. The [bindings](../apps/learner/src/ui/dialoguePhotos.ts) specify their exact destinations and alternative text.

| Asset | Dialogue | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| [Bistro](../apps/learner/public/learning-scenes/french-bistro-dialogue.jpg) | Restaurant lessons, including Explain food needs | 165,078 | `c9a65b11bccd7fe06a35ec532973d55672304a42112e8f5bc3e477c3ecb557d1` |
| [Apartment entrance](../apps/learner/public/learning-scenes/french-neighbour-dialogue.jpg) | Daily course Day 1 | 191,147 | `66aa5eb210a9e30aea2ef3895eca1d8d18ba427c5681441de3697e785c99aed3` |
| [Workshop reception](../apps/learner/public/learning-scenes/french-workshop-dialogue.jpg) | Daily course Days 2–5 | 180,895 | `a2b1c8057602382eaa5a6af923a896e11c3b414ab1497a2db254d9abb0f451a0` |

Each ImageGen request used the common prompt followed by the corresponding scene prompt.

```text
Use case: photorealistic-natural. Asset: 3:2 landscape context photograph for a SmartLingo French transcript. The two supplied SmartLingo-generated homepage photos guide colour, candid editorial realism and daylight only. Use a new location and fictional people. Warm cream, muted teal, natural timber and soft natural daylight. Eye-level horizontal framing, two main participants close to the center with faces and key action at the vertical midpoint within the central 40 percent of the image so a 2.7:1 crop retains them. Authentic everyday postures and materials. No logos, watermarks, legible writing, graphic overlays or tourist landmarks.
```

**Bistro**

```text
Scene: inside a modest neighbourhood bistro in metropolitan France. A seated adult customer and a standing server in a plain muted teal apron speak calmly across a small timber table, looking at one another. Both faces remain within the central height of the scene. A folded, text-free menu and a water glass suggest a restaurant conversation. No served food, medical equipment or indication that any food or ingredients are safe.
```

**Apartment entrance**

```text
Scene: a warmly lit shared entrance hall of a small residential apartment building in metropolitan France. Two adult neighbours in ordinary clothes greet one another near the pale stone doorway at a natural conversational distance. A simple low row of unlabelled mailboxes, a dark teal painted door and warm stone establish the setting. Neither subject poses for the camera. The expressions suggest a brief hello on the way in.
```

**Workshop reception**

```text
Scene: a modest neighbourhood community room in metropolitan France. A workshop host and an adult visitor pause beside a compact wooden check-in table to speak. Other chairs and a simple shared worktable are softly visible in the background. A closed notebook and an unmarked clipboard indicate welcome and orientation. Both are engaged naturally, with open, relaxed posture.
```

## Original bundled drawings
The ten initial illustrations live in apps/learner/src/ui/Illustration.tsx. New reusable vector drawings and word associations live in packages/content/src/visuals.ts and render through WordIllustration.tsx. All new SVG geometry and compositions were written originally for SmartLingo with AI assistance. No stock photo, Facebook image, textbook artwork, emoji font, icon library or third-party image was copied or fetched. No third-party attribution or licence grant is claimed. The owner must still review clarity, sense, accessibility descriptions and suitability before wider publication.

The new visual catalogue is separate from lesson revisions. Associations use stable vocabulary IDs and exact current target text; changed targets do not receive an outdated new illustration. Existing concrete curriculum pictures remain the fallback. SVGs bundle with ordinary web assets, have no scripts or remote image dependencies, and require no AI/API request during use. The explicit offline web download now saves those bundled assets for cold reloads; see [ADR 0012](decisions/0012-offline-web-assets.md).

The offline web manifest and app header use an original code-drawn open book in [icon.svg](../apps/learner/public/icon.svg). It contains no external resource. Browser and device icon suitability remains subject to owner review.

## Bundled presentation scenes and type

The 2026-11-22 frontend rework uses four original photorealistic contextual scenes generated with the built-in ImageGen tool from the written prompts below. No outside image or supplied interface artwork was an input. The scenes depict illustrative places and fictional people. The workspace JPEGs were resized and recompressed from the generated PNGs, keeping the composition intact. They travel in the web/offline asset pack and load locally. Spot-checks cover scene clarity and cropping. Owner review of presentation suitability remains open. Word photo provenance and practice bindings are documented independently. [Generated vocabulary photographs](#generated-vocabulary-photographs)

| Asset | Use | SHA-256 |
| --- | --- | --- |
| [French café and bakery](../apps/learner/public/learning-scenes/french-street.jpg) | Language chooser and contextual cover fallback | `620c5a45f0c101c86e8e361f4519d89def088c937765566adbf33c65cfb57c08` |
| [Japanese neighbourhood](../apps/learner/public/learning-scenes/japanese-street.jpg) | Language chooser, Japanese Today and general contextual cover | `e4a0ab9f261f822c65aba705f37252ab59e393bd94805f8d3a73e453a6653c11` |
| [Japanese produce counter](../apps/learner/public/learning-scenes/japanese-market.jpg) | Japanese shopping topic and related lesson context | `ad09ddfe5cdc83003673899e34b903cf79f87fc71a9e863b6ff00d3543b8e6a5` |
| [Japanese station](../apps/learner/public/learning-scenes/japanese-station.jpg) | Japanese station and time topic and related lesson context | `18e4c409743a1571b5c843ffe2ca4522a8a0f6c228e23ebf2fad2eea68a3e72c` |

French Today uses the original [neighbourhood bakery image](../apps/learner/src/dashboard/assets/lyon-bakery.jpg) from Cloud commit `563fdaa`. Its source decision records OpenAI ImageGen and a fictional neighbourhood scene. The file was copied byte-for-byte and visually checked at small and large widths. It shows two adults waving across a green bakery doorway, with baguettes in the window. The local 1200 × 900 JPEG ships in the offline export. SHA-256 `71c90c4e4666a15f687dc5a4b0f9a55d87bc1ca1245aeff2b03210bac8b81fe8`. Owner review remains open. [Cloud artwork decision](https://github.com/trinamntn08/SmartLingo/blob/563fdaa01b8d56cc4c0baf971b9f2664b26212f8/docs/decisions/0021-learner-navigation.md)

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
