# Offline web download and installation

Status: completed; historical first-export record. Current usage is in [local operations](../LOCAL_OPERATIONS.md#test-the-offline-ready-preview), and later saved neural speech is recorded in [plan 0022](0022-cached-french-speech.md).
Owner: primary agent

## Outcome and acceptance

After an explicit Profile download, the exported web preview cold-loads with all network/API access unavailable. Ordinary bundled picture/text lessons, personal vocabulary and manual review work. Profile shows download size, progress/status, failure/retry, refresh/update and explicit removal. Asset removal preserves every IndexedDB learner store, including cached publications. Download failures never replace a working copy or report a partial copy as ready. No automatic downloads, approval, AI calls or public hosting.

The initial pack at this step contained 60 draft lessons and bundled pictures, plus app assets. Later exports include the expanded catalogue; use the current source rather than this historical size/count. Owner publications remain in separate IndexedDB storage. Per-topic packs remain future work; explicit saved generated audio was added later in its own cache. The manifest supports browser installation where available; physical-phone acceptance remains open. Root-path localhost serving is distinct from Expo development on 8081.

## Contracts and ownership

Primary owns `src/offline/contracts.ts`, `browser.ts`, export-manifest/static-server scripts, root commands, App integration, exported-browser checks and docs. `api-builder` owns only `apps/learner/public/smartlingo-sw.js` and `apps/learner/tests/offline-worker.test.ts` for explicit, integrity-checked caching and worker failure tests. `ui-builder` owns only `src/offline/OfflinePanel.tsx` and optional `useOfflineAssets.ts` for responsive accessible controls against the typed manager. Both use `gpt-6.1-sol` medium per session routing. A separate read-only reviewer uses high effort after implementation. Everyone preserves other work; primary alone owns shared contracts/manifests/lockfiles. Usage tools unavailable; bounded delegation, no paid APIs/new dependencies.

Worker protocol through MessageChannel: requests `{type: 'STATUS' | 'DOWNLOAD' | 'REMOVE', expectedBuildId?: string}`; replies `{type:'PROGRESS', progress:{completed,total,bytes}}`, final `{type:'RESULT', status: OfflineStatus}` or `{type:'ERROR', message:string}`. Worker downloads `/offline-manifest.json` itself with cache:no-store and validates it. Cache names start `smartlingo-assets-v1-`; staged caches become visible only after a final validated completion record. Hash/size checking covers every file. Preserve existing complete copies on failure/update; aggregate saved bytes across complete copies. Fetch handles only same-origin GET: network-first root/index navigation with complete-cache fallback, and exact cached asset URLs; never API/editor requests. Removal only deletes owned asset caches, never IndexedDB or unrelated caches. Serialize mutating worker commands.

## Official references checked 2026-11-15

- [Expo PWA guide](https://docs.expo.dev/guides/progressive-web-apps/): manifest/public assets, production export and explicit update caveats.
- [MDN service worker lifecycle](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers): secure origin/localhost, lifecycle, message/fetch/cache boundaries.
- [MDN CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage): explicit named asset-cache ownership.

Use an explicit tiny worker for this bounded pack; no Workbox dependency or aggressive runtime caching. A network-first document permits normal online updates; immutable bundled assets remain available from saved copies. Downloads keep prior complete copies until explicit removal so old tabs retain their hashed scripts. Show total saved file bytes, excluding browser overhead; optional browser installation is separate from offline readiness.

Browser management requires Web Locks in addition to secure service-worker support, so update/removal cannot race downloads still running in an older worker generation. The worker also retains a local queue for direct calls, but the UI does not offer downloads on browsers lacking the cross-generation lock. Navigation uses a bounded network-first attempt before complete-copy fallback, including stalled connections.

## Validation and recovery

Run repository/TypeScript, tooling/application suites, existing browser regressions and web export. Separate exported-build Playwright checks use localhost:8082 and isolated contexts: explicit download, cold offline reload, lesson/note/review persistence, failed download/retry, incomplete status, update preservation, cache-only removal and unrelated-cache preservation. Inspect desktop/narrow screenshots. Review the full diff, update STATUS/checkpoint, final staged checks and focused local commit. Do not start the next pending feature until this step is reviewed/validated/committed.

Previous completed checkpoint: `f40ddcf`. Owner authorised continuing through pending work and automatic local commits. No remote integration/deployment is authorised by this step.

## Completed outcome

All planned code is integrated. Exported current pack is four files/about 1.25 MB. `npm.cmd run check`, 18 tooling/79 application tests, web export, 31 development browser regressions/one deliberate publication skip, and six exported-browser cases pass. Independent review found a stalled-navigation bug; the three-second race/abort fix passes VM and real-browser regressions. Desktop ready and 320px error screenshots inspected. The SVG install icon is valid, but actual phone/Safari installation and voice remain unverified. All current source/tests/docs belong to this focused step; no new dependencies or paid calls.

Owner asked for a preview before allowance runs out. Started the regular exported preview on localhost:8082 and actual local API on 127.0.0.1:3001 only after the isolated tests completed. Verified HTTP200 and health ok and shared the link. Preview stays running for testing; do not replace it with the fault-injection test server. Agent did not save learner events or publish curriculum in that preview. API startup uses the reviewed immutable seed policy. Those final checks/commit and the subsequent build-tool investigation are historical follow-ups, not the current task; see STATUS for remaining work.
