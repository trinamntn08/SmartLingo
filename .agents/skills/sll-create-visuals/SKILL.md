---
name: sll-create-visuals
description: Generate SmartLingo website photos and illustrations with approved models, and create functional icons in the existing system. Use for new visuals, coordinated sets, and replacements for the learner or editor.
---

# Create SmartLingo visuals

Use the [visual direction](references/visual-direction.md) and the generated image workflow in `docs/MEDIA_SOURCES.md`. Inspect the actual homepage photos in `apps/learner/public/learning-scenes/` before making a new set, alongside the component that will display it. Reuse only eligible, documented SmartLingo-generated images. Exclude external images as both assets and generation inputs.

1. Identify the surface, target language or shared context, and what learners should recognise. Check the rendered size, crop and existing asset path. For a batch, plan the subjects together and keep the shared style guidance fixed across prompts.
2. Use the built-in ImageGen tool for original photos, raster illustrations and requested bitmap icons. When reference inputs are supported, pass the two homepage images for style and describe the new subject separately. For a functional UI icon, reuse the code-drawn `apps/learner/src/ui/Icon.tsx` family. Add original geometry in that family only when there is no matching glyph.
3. Compare the candidates with both homepage anchors and inspect the actual desktop and mobile crops or icon sizes. For lessons, check the exact vocabulary sense and distinguish a contextual cover from an image that teaches a word or serves as an answer. Keep English meanings and labels in the UI. Use concise alt text for informative images and let labelled controls own the accessible name of their icons.
4. Save selected files in the requested workspace path. Follow existing local/offline asset placement for integrated media. Wire them into the UI only when requested. Record generation, permitted references, output terms, edits and review using `docs/MEDIA_SOURCES.md`. Inspect each image for recognisable third-party material or close resemblance. Regenerate or use text when an output is unsuitable. Curriculum media follows owner review and explicit release.

If ImageGen is unavailable, provide a ready-to-run prompt and say generation remains pending. Use a paid/API fallback only with explicit authorization. Report selected file paths, final prompts for generated media, and what was actually checked.
