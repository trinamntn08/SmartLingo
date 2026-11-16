# Plan: free website deployment for learner testing

Prepared: 2026-11-16 (Europe/Paris). Original researched design, source baseline `8ba59ae`; the proposal below is retained as acceptance/design evidence. Owner request: a detailed way to test SmartLingo on a website for free now.

Follow-up inspected 2026-11-16: remote branch `codex/free-learner-cloud-deploy` now contains a hosted-mode implementation (`68b8d0f`, with follow-up head `c88bc41` at inspection). Its checkpoint reports local hosted/browser/offline validation complete, with actual Cloudflare publication blocked by secure account/network access and no live URL. That code is **not integrated into this documentation checkout**. Resume/inspect that branch before new implementation; remote results are reported evidence, not tests rerun by this documentation audit.

For remote execution, copy the [Codex Cloud deployment prompt](../CLOUD_DEPLOY_PROMPT.md), which now starts from the existing hosted branch and verifies remaining work. The prompt authorises the scoped implementation/push/free test deployment when submitted by the owner; this documentation task itself does not deploy anything.

## Recommendation and cost

Use **Cloudflare Pages Free**, initially uploading a locally built learner export. Keep one stable `https://<chosen-name>.pages.dev` address. The name is illustrative and availability is unverified. After deployment, the computer can be switched off and testers can open the website from phones and computers.

Cloudflare advertised free Pages hosting without a credit card and unlimited static requests/bandwidth when checked on 2026-11-16. Its documented Free limits then included 500 hosted builds/month, one simultaneous build, 20,000 files/site and 25 MiB/asset. Dashboard drag-and-drop had a separate 1,000-file limit. Account eligibility and current terms must be checked at deployment; this cleanup did not revalidate provider limits. See [Pages offering](https://www.cloudflare.com/products/pages/), [platform limits](https://developers.cloudflare.com/pages/platform/limits/) and [upload limits](https://developers.cloudflare.com/pages/get-started/direct-upload/).

| Item | First test release |
| --- | --- |
| Static hosting, provider subdomain and HTTPS | EUR 0 within the Free offering |
| Domain purchase | EUR 0: use the supplied pages.dev address |
| Cloud backend/database | EUR 0: none in this phase |
| AI conversation/transcription and neural generation | Disabled; no provider calls |
| GitHub connection/paid CI | Not required for the first manual upload |
| Device French voice | Uses browser/device capability; quality and offline availability vary |

The last documented export was about 9.7 MB and 126 manifest assets, comfortably small historically. That is not a measurement of a fresh build: count all actual upload files and inspect the largest asset before deployment. Stay on Free; do not enable Workers billing, R2, paid add-ons or trials for this journey. Free hosting is not a promise of free AI inference or permanent free service.

## Scope: what testers will receive

| Capability | First hosted learner release |
| --- | --- |
| Today, Explore, all currently bundled topics and lessons | Yes; current source has 25 banks/123 lessons |
| Vocabulary meanings/examples, pictures, dialogues and existing practice | Yes |
| Save/edit/search personal words, review and local progress | Yes, stored in each browser |
| Learning backup export/restore | Yes, explicit private file transfer |
| French device speech | Where the browser/device provides it; audition on each device |
| Offline app download and cold launch | Target, after the hosting adaptation and device checks below |
| Login, accounts, automatic phone/computer sync | Not implemented |
| Owner editor, load server publications, AI practice/transcription, neural generation | Unavailable in this static-only release |
| Owner SQLite edits/publications and existing neural clips | Not transferred by uploading the website |

Bundled curriculum remains draft/test material; deploying a website is separate from the owner preview/publication workflow. The six curriculum bridge candidates and five support corrections in the research pack are unregistered and must not be described as shipped.

The [architecture](../ARCHITECTURE.md) already separates bundled content, browser learning storage and the local API. The local preview server is deliberately loopback-only and must not be exposed or used as a production server. The API also rejects non-loopback binding. Three browser API adapters currently hard-code `http://127.0.0.1:3001`; setting a hosting environment variable alone will not make these features work. On a phone, that address refers to the phone itself.

## Phase 1: prepare a complete static test release

Acceptance: desktop and phone can browse, study, save, reload, back up and explicitly download/reopen offline at a stable HTTPS address, with no calls to the local API or paid providers and no owner data included.

1. Create a separate implementation branch from the selected current source, after inspecting the working tree. Preserve the owner preview/API and all private data. This plan changes documentation only.
2. Add an explicit learner-only deployment capability/configuration. Preserve the existing local workflow. In the hosted mode, omit the editor/publication requests, AI practice requests and neural status/generation requests. Show a short useful explanation where necessary; ordinary learning and device speech stay available. Do not rely on a network timeout as the intended hosted experience. Centralise capability selection; keep UI, API adapters and storage responsibilities separate.
3. Fix the concrete offline hosting mismatch. The manifest and validators currently require `/index.html`; the worker fetches each asset with `redirect: 'error'`. Cloudflare documents HTML URL canonicalisation, so an unchanged export is not sufficient evidence of working offline download. A minimal proposed adaptation is to fetch `/` for the manifest's exact `/index.html` entry, hash/size-check those returned bytes against the same entry and retain `/index.html` as its cache key. Keep other redirect rejection and integrity validation intact. Test this against a host-shaped fixture and the actual hosted site. No general cross-origin/redirect relaxation or learner migration is needed for this proposal. See [Pages route handling](https://developers.cloudflare.com/pages/configuration/serving-pages/).
4. Add deployment response policy: revalidate the root document, offline manifest and worker; set correct MIME types and `X-Content-Type-Options: nosniff`. A simple first policy can use `Cache-Control: no-cache` for all files; optimise hashed assets later. Keep worker scope at `/`. Disable any optional HTML/JavaScript transformation or injection and verify served hashes. Transport compression is acceptable when the decoded bytes match.
5. Keep Cloudflare control files such as `_headers` and `_redirects` out of the offline asset list. The current exporter fingerprints these if they are present; Cloudflare interprets them instead of serving them as normal files. Add a narrow explicit exclusion or generate these files after manifest creation, with reproducibility checks. Do not add broad file exclusions. See [header configuration](https://developers.cloudflare.com/pages/configuration/headers/).
6. Add a top-level `404.html` to prevent Cloudflare's default SPA fallback from returning application HTML for nonexistent asset/API paths. Preserve the actual hash-based editor/local navigation behaviour. Exclude the error document from the downloadable asset list if its hosted canonical path/status cannot satisfy exact asset checks. Do not add a blanket SPA rewrite. Verify root navigation and genuine missing-file 404 responses.
7. Add a clear test-preview note, preserve bundled image credits/licences and use `X-Robots-Tag: noindex, nofollow` for the test release. Search exclusion is not access control. A normal Pages URL exposes the bundled lessons/assets to anyone who can access it; private GitHub source would not make the website private. This proposal assumes shareable original/reusable test curriculum. If access must be private, choose and verify access protection before publishing, including worker/offline behaviour.

Proposed implementation ownership: primary controls configuration/contracts, exporter and deployment packaging; learner UI/API-capability work and independent read-only review can be delegated with exclusive files under the repository workflow. No implementation agents were used for this planning step.

## Phase 2: build and validate locally

Use Node 24.19.0/npm 11.17.0 as pinned in this repository. Work from the repository root. These are future release checks, not results of this planning task:

```powershell
npm.cmd ci
npm.cmd run check
npm.cmd test
```

Then run browser and offline checks sequentially in an isolated checkout/worktree with separate fixtures/ports. The existing offline command uses port 8082 and refuses to reuse the owner preview; do not stop or replace that preview just to run tests.

```powershell
npx.cmd playwright install chromium
npm.cmd run test:e2e -- --workers=2
npm.cmd run test:offline
npm.cmd run build:web
```

On a Linux runner use `npm`/`npx`, with `npx playwright install --with-deps chromium`. The new hosted-mode build must explicitly select its implementation-defined configuration; there is no hosted-mode script/flag today. Document that exact command when implemented. Ensure the final build has the same hosted configuration that passed tests.

Deployable output is **`apps/learner/dist`**, generated by `npm run build:web`, including offline-manifest preparation. Do not upload the repository, `data/`, real `.env` files, backups, speech databases, raw recordings or research/private review material. Source maps and metadata excluded from the offline list may still exist in the output; review and deliberately omit unnecessary debug artifacts from the upload package.

Before upload, verify all deployable paths, file counts/sizes, worker/manifest presence and every manifest SHA-256. Inspect the built app for embedded credentials and localhost requests in hosted flows. Record source commit, manifest build ID and checks. Use a fresh release artifact; an old running preview or `.tmp` export is not the release.

## Phase 3: publish the first test website

These are execution instructions for a later deployment request; this planning request does not create an account, push code or publish a website.

1. Sign in to Cloudflare and select the Free offering. No domain purchase is needed. Account registration/authentication may require the owner.
2. Under Workers & Pages, create a **Pages** application using Direct Upload/drag-and-drop. Choose a stable name such as `smartlingo-test` if available. Dashboard labels can change; follow [Cloudflare's upload guide](https://developers.cloudflare.com/pages/get-started/direct-upload/).
3. Upload only the reviewed contents of `apps/learner/dist`, with `index.html` at the deployment root. Ensure the entire export uploaded successfully; dashboard uploads allow up to 1,000 files and 25 MiB per asset. If the fresh package exceeds that, use reviewed/pinned Wrangler tooling, not a partial upload.
4. Publish to the project's stable Pages address and record the exact URL and deployment ID. Share that stable address with testers after smoke checks. Do not claim the sample name above is a live website.
5. Confirm HTTPS and response headers. Fetch every downloadable asset from the host, using the explicit root mapping for the HTML entry, and compare decoded bytes to its declared size/hash. Verify an unknown `.js` and `/api/...` return 404 rather than the app shell. Confirm no credential/provider/loopback request during normal learner and Profile journeys.
6. Follow the phone acceptance checklist below before calling the test release ready. The PC can then be shut down: Cloudflare serves the uploaded files independently.

Direct Upload cannot later be converted into Cloudflare's native Git integration in the same project. It **can** keep the same project/URL and receive CI uploads through Wrangler. This is the preferred automation upgrade, avoiding a hostname change and separate browser storage. A new native Git-integrated project is an alternative, but requires an explicit data-transfer plan. See [Direct Upload constraints](https://developers.cloudflare.com/pages/get-started/direct-upload/) and [CI uploads](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

## Phase 4: real-device acceptance and learning-data transfer

Use ordinary browsers rather than private/incognito mode for persistence tests. Record device, OS, browser/version, exact URL and build ID with each result.

1. Fresh desktop Chrome/Edge: check greetings-first Today, Explore and every topic; open picture/meaning/dialogue/sentence activities and inspect credits. Check keyboard navigation and a narrow screen.
2. Android Chrome and iPhone Safari: open the HTTPS link over mobile data with the PC off; inspect layout, tapping, scrolling, visible meanings and French text. These device results are pending today.
3. Save a lesson word, add a personal word, edit/search it and submit a review rating. Reload and reopen the browser; verify the notebook, progress and rating survive at the same origin.
4. Export a learning backup; restore in a fresh test browser using disposable entries. Check counts, notes and duplicate handling. To move real existing study data, export from the old localhost browser, privately transfer the file and explicitly restore at the new website. Keep the original backup/data. Backups are unencrypted; never upload them as website assets or attach them to public bug reports.
5. In Profile, choose Download for offline use and wait for Ready. Close the tab/browser, enable airplane mode and reopen the exact same address. Verify lessons, pictures, saved words and review. Test interrupted download/retry, update and asset removal while preserving learner data. Test the Safari browser and Home Screen launch separately when available.
6. Audition a French device voice. Check text fallback when no voice is present. Do not promise natural neural audio or offline device voices. Learning backups do not transfer generated-speech caches or voice preferences.
7. Confirm hosted editor/AI/neural controls accurately show their limited availability without local API requests. Check the browser network log and errors; browser storage restrictions must show recoverable feedback.

There is no account sync: each browser/profile/origin has separate data. A phone and desktop will not automatically share progress; manual backup/restore is the existing route. Changing the project hostname/custom domain later also creates a separate origin. Browser storage can be cleared or evicted; export a backup before changes and regularly during testing. Hosting providers receive normal web-request metadata; the learner's existing notebook/history remains browser-local in this phase.

## Phase 5: repeatable updates and recovery

For each update: make a focused source commit, run relevant checks, build a reviewed artifact, deploy to a preview address for disposable smoke tests, then upload the same artifact to the stable project environment. Production here is Cloudflare's environment label; the product remains a test preview. Preview addresses have separate browser storage and must not become the testers' daily address.

Later add a manual GitHub Actions deploy workflow with an explicit environment gate, pinned tooling/actions and a narrowly scoped Cloudflare Pages token stored in Actions secrets. Never pass that token to the learner bundle or untrusted PR jobs. Build from an explicit tested commit and deploy only after checks pass; Cloudflare native Git builds alone do not establish that GitHub tests passed. Existing verify.yml validates and does not deploy. Before relying on remote source, inspect live history and upload the correct branch through the authorised workflow; do not assume old main contains the current app. Check account CI allowance before assuming that automation is free.

Keep at least the previous tested artifact and deployment/build identifiers. If an update fails, use the prior successful production deployment in the Pages dashboard, or redeploy the preserved artifact. See [rollback behaviour](https://developers.cloudflare.com/pages/configuration/rollbacks/). Website rollback does not roll back IndexedDB, erase downloaded worker caches or revoke already downloaded copies; verify update/retry in the browser and avoid clearing learner storage as a repair step. Do not introduce data migrations for this first hosting slice.

## Other free options considered

| Option | Fit for this repository |
| --- | --- |
| Cloudflare Pages Free | Recommended: small static learner export, free supplied address, manual upload first and CI later |
| Render Static Sites | Credible free static fallback; repeat URL/header/hash/offline checks rather than assuming identical host behaviour |
| Vercel Hobby | Personal non-commercial testing may qualify; Hobby is restricted to that use, so re-evaluate before commercial use |
| GitHub Pages | Possible for an eligible repository, but GitHub Free generally requires public source; project subpaths clash with current root-relative offline assets, and service/business use has limits |
| Render Free API | Disposable API demo only: idle sleep/restarts lose local SQLite changes, and Free cannot attach a persistent disk |

Sources: [Render Free](https://render.com/docs/free), [Vercel pricing/use restriction](https://vercel.com/pricing), [GitHub Pages availability and limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). Render documents 15-minute idle spin-down and ephemeral files; its free Postgres also expires after 30 days. It is not durable storage for the existing curriculum or speech-attempt ledger. No alternative account was tested.

## If online editor or AI testing becomes necessary

Treat this as a separate complete backend journey. Hosting static files does not run Fastify, migrate SQLite or secure editor operations. Required work: configurable HTTPS API clients, authenticated owner-only editing/publication, enforced authorisation, exact allowed origins, request validation/limits, deployment health/startup configuration and durable storage with tested backups. Public CORS allowances alone do not authenticate users. Preserve preview-before-publication and stable revisions.

For AI, additionally protect generation behind authorised testers, reserve durable per-user/global attempts, set provider-side limits where supported, keep all permanent keys server-only and verify timeout/replay/cancellation behaviour. A server restart must not silently reset public spending protection. Recordings remain temporary and excluded from logs/backups. Existing fake providers are for isolated tests, not a substitute for real-model quality validation.

Choose either a durable Node host supporting the current SQLite design or a deliberate managed-database adapter/migration. Serverless Pages Functions and Supabase/Postgres are not drop-in hosts for the current local process/database. A free disposable backend or a carefully qualified free tier can be researched then, but this plan does not establish a free durable full-stack host. Provider AI usage is separately billable; no paid calls are required for the recommended first release. Do not expose the owner PC/API through a tunnel for this static learner deployment.

## Completion gates and next action

Planning is complete when the current runtime fit, checked free offer, exact packaging/upload steps, hosting compatibility work, test checklist, data limits and upgrade/rollback path are documented. This file satisfies that planning scope; no hosted capability exists because of this document.

Next continuation: inspect/fetch `origin/codex/free-learner-cloud-deploy`, verify its current clean implementation/artifact and reported checks, resolve only remaining release defects, then complete secure account/network setup and actual deployment/hosted acceptance. Use the updated Cloud prompt. Keep the backend/AI scope excluded unless separately requested; no site is live merely because the implementation is committed.
