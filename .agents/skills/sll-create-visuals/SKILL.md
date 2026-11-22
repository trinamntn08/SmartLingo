---
name: sll-create-visuals
description: Create or curate SmartLingo website photos, illustrations, and icons that match the French and Japanese homepage photos. Use for new visual assets, coordinated sets, and visual replacements for the learner or editor.
---

# Create SmartLingo visuals

Use the [visual direction](references/visual-direction.md) for every asset. Inspect the actual homepage photos in `apps/learner/public/learning-scenes/` before making a new set, alongside the component that will display it. Look for a suitable existing asset before making another.

1. Identify the surface, target language or shared context, and what learners should recognise. Check the rendered size, crop and existing asset path. For a batch, plan the subjects together and keep the shared style guidance fixed across prompts.
2. Use the built-in ImageGen tool for original photos, raster illustrations and requested bitmap icons. When reference inputs are supported, pass the two homepage images for style and describe the new subject separately. For a functional UI icon, reuse the code-drawn `apps/learner/src/ui/Icon.tsx` family. Add original geometry in that family only when there is no matching glyph.
3. Compare the candidates with both homepage anchors and inspect the actual desktop and mobile crops or icon sizes. For lessons, check the exact vocabulary sense and distinguish a contextual cover from an image that teaches a word or serves as an answer. Keep English meanings and labels in the UI. Use concise alt text for informative images and let labelled controls own the accessible name of their icons.
4. Save the selected files in the requested workspace path. Follow existing local/offline asset placement for integrated media. Wire them into the UI only when the request includes integration. Record provenance in `docs/MEDIA_SOURCES.md` for presentation art or follow `docs/PHOTO_SOURCES.md` for vocabulary photography. Generated assets need the tool, prompt, references used and any export edits. Reused media needs a verified source, rights and required attribution. Curriculum media follows the existing owner review and publication process.

If ImageGen is unavailable, provide a ready-to-run prompt and say generation remains pending. Use a paid/API fallback only with explicit authorization. Report selected file paths, final prompts for generated media, and what was actually checked.
