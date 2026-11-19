# 0024: Link-only listening resources separate from lessons

Date: 2026-11-19
Status: accepted for implementation

## Context

The owner requested more A1–B1 listening resources, including YouTube. Current bundled lesson levels end at A2. External learning sites provide useful audiovisual material, but free access does not establish redistribution rights.

## Decision

Add an editorial, typed static link catalogue and a level/format-filtered learner panel under Practice. Its A1/A2/B1 recommendations are local resource metadata, separate from runtime lesson levels and publication. Render original practice guidance and access/text-support caveats alongside explicit external links. Use no third-party embeds, automatic media requests or copied media. Keep playback with the provider and identify the internet requirement.

No progress persistence or completion event is needed for browsing an external resource. Provider-specific accounts remain on provider sites. Record live primary-source evidence and limitations in the [source record](../curriculum/listening-resource-sources.md).

## Consequences

Learners get useful beginner-through-intermediate listening choices without a new storage migration or provider API. The downloaded list remains readable offline; external playback does not. Links need periodic manual rechecking. This adds neither a complete B1 curriculum nor listening assessment or owner approval of third-party content.
