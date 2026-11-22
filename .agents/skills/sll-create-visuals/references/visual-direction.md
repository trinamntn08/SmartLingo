# SmartLingo visual direction

Show everyday places where adults use the language, with a recognisable action or object learners may encounter. Give French and Japanese the same visual treatment while choosing details appropriate to each local setting.

## Homepage anchors

Paths in this reference are relative to the repository root.

| Photo | Details to carry forward |
| --- | --- |
| `apps/learner/public/learning-scenes/french-street.jpg` | Lyon-inspired bakery and café at street level, cream limestone, deep teal awning, warm wood and wicker, terracotta flowers, two adults walking and soft daylight. |
| `apps/learner/public/learning-scenes/japanese-street.jpg` | Tokyo-inspired neighbourhood shop at street level, cream plaster, muted teal frontage, timber door, brick-red noren, city bicycle, two adults walking and soft daylight. |

Inspect both JPEGs. Their original prompts and provenance are in `docs/MEDIA_SOURCES.md`. The photos set the media direction. Use `references/1.jpg` through `references/7.jpg` when checking how a visual sits in the wider interface.

## Photos and covers

- Aim for contemporary editorial street or lifestyle photography with natural daylight, gentle contrast and realistic textures. Use cream and warm neutrals, muted teal or pine, wood or stone, and a small natural accent such as brick red, sage or soft gold where it fits. Keep colours grounded in the actual objects and setting.
- Frame at human scale. Give each frame one clear subject and enough surrounding detail to explain the activity. Include adults in plausible candid poses when they add meaning. Use familiar shops, homes, transit or public spaces with credible local details. Avoid tourist clichés, exaggerated cultural markers, posed stock-photo smiles, glossy HDR, logos, watermarks and invented legible signage. Render required teaching text in the app wherever possible.
- The homepage source photos are 3:2 and render in roughly 1.9:1 desktop and 2.35:1 compact frames. Start wide for a similar cover and keep the essential subject within the central crop on both axes. Check the destination component for every new use. For vocabulary, move closer and make the one intended object or action readable at thumbnail size. Use the existing lesson meaning for abstract or ambiguous concepts.

Adapt this ImageGen prompt for a French shopping cover.

```text
Use case: photorealistic-natural. Asset: 3:2 landscape topic cover for SmartLingo.
Scene: an everyday neighbourhood produce shop in metropolitan France. A shopkeeper weighs pears on a small counter scale, with a paper bag within reach.
Style: match the two supplied SmartLingo photos in candid editorial realism, soft natural daylight, warm cream surfaces, muted teal, timber and gentle contrast. Use the reference images for treatment and crop sensibility. Make an original scene for this activity.
Framing: eye-level view. Keep the pears, scale and shopkeeper's action near the centre with vertical breathing room for the wide card crop. Natural posture, no branding, text, watermark or graphic overlay.
```

## Illustrations and icons

- For a learning illustration, echo the photos through recognisable everyday objects, warm neutral backgrounds and restrained pine, sage, gold or terracotta accents. Use simple shapes and clear silhouettes. Match existing lesson illustrations when extending an existing exercise. Preserve the defining detail that distinguishes the target from likely alternatives.
- For a functional icon, use one clear silhouette in the existing 24×24 grid, with rounded 1.75 strokes and a single colour from `apps/learner/src/ui/designTokens.ts`. Check the default 20 px size and the intended background. Keep labels and state cues legible without relying on colour alone. Photographic texture belongs in the imagery. A requested standalone bitmap icon can use the same silhouette and palette, with genuine alpha when transparency is needed.

## Final check

View related assets together, then at their actual card or control sizes. Check even colour treatment, plausible hands and objects, culturally credible details, unclipped subjects and vocabulary recognisability. Optimise selected rasters to their destination and check that integrated files load locally, including offline when the surface supports it. Existing presentation scenes live in `apps/learner/public/learning-scenes/` and are selected by `apps/learner/src/ui/contextPhotos.ts`. Word photos and illustrations use their own existing mappings, documented in `docs/MEDIA_SOURCES.md`.
