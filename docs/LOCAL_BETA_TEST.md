# Local beta testing

Prepared 2026-11-17 (Europe/Paris) from deployment beta `ac061ec`. This is a local desktop test, not a published website.

## Preview addresses

- Full local preview: <http://localhost:8084>. Includes the curriculum workshop and API setup/error states.
- Learner-only website preview: <http://localhost:8082>. Matches the static beta with no online API configured.
- Isolated local API: <http://127.0.0.1:3001/health>.

Use the exact `localhost` addresses consistently: changing hostname or port opens separate browser storage. Your browser may already have learning data for these addresses; no browser data was cleared. These previews do not move notebook/progress between origins automatically. Export a learning backup from an earlier preview before restoring it here if you want that data.

## Suggested test pass

1. **Today:** open the first greetings lesson. Check the visible English meanings, French examples, grammar, pictures and Listen controls. Try word matching, sentence building and the scripted dialogue; return home and reload to check your progress.
2. **Explore:** search and browse the 25 topic banks/129 lessons, including the new family, colour, body-pain, compound-number, payment-problem and postponement-message material. Try level filters and a narrow browser window. Content is beta material awaiting your review.
3. **Notebook and Review:** save a lesson word, add a personal expression, edit it, search with and without accents, then practise manual review. Reload and check that your edits remain.
4. **Profile:** audition available French device voices and pace settings. Export a private learning backup; restore that file in the separate learner-only preview and check its contents. Keep your backup private and outside the repository.
5. **Offline:** in Profile, explicitly download the complete app and wait for confirmation. Use the browser's offline network mode, reload and open a lesson, notebook and review. Restore the browser to online mode afterwards. A successful download, rather than just visiting the page, prepares a cold offline launch.
6. **Workshop (full local preview only):** use Profile → Open curriculum editor. Select a lesson, change a heading/example/dialogue field, save the draft and preview the saved revision. Draft edits should remain separate from the learner catalogue. If you deliberately publish a test revision in this isolated database, load published lessons and check the result; this does not publish anything online.
7. **Practice and generated speech (full local preview only):** check the clear unavailable/setup messages. No real provider credentials are configured for this session. AI conversation, microphone transcription and Azure generation require separate server configuration; their real output quality is not part of this preview verification.

For feedback, record the preview address, topic/lesson, steps, expected result, actual result and a screenshot if useful. Note any unnatural French, translation, picture or voice separately from application errors.

## Restarting this test setup

Worktree: `D:\dev\projects\SmartLingo-sessions\local-beta-preview`, branch `chore/local-beta-preview`. The checkpoint records actual validation and process state at handoff. Running processes may end when Windows restarts.

The ignored `.tmp/local-preview-api.mts` starts the API with an explicit credential-free configuration. The ignored `.tmp/local-preview-server.mjs` serves the local export on 8084 and the saved website-beta export on 8082. From this worktree, run these in two terminals:

```powershell
npx.cmd tsx .tmp/local-preview-api.mts
node .tmp/local-preview-server.mjs
```

Local test curriculum lives under this worktree's ignored `data/`; browser learning data lives in each preview origin. Previous worktrees and their databases are preserved. Do not delete either store to reset a test without first deciding which learning/editor changes to keep.

The two launcher files and build exports are local generated artifacts and are not committed. To recreate them on a different checkout, use the existing [run/build procedures](../README.md#run-the-preview) and [deployment guide](DEPLOYMENT.md); the checkpoint states which source revision was tested.
