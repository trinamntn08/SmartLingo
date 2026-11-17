# Deploy the SmartLingo beta

Prepared 2026-11-17. The owner authorised all complete courses/materials for beta inclusion and will review after deployment. No manual lesson approval blocks this release. The source contains 129 lessons across 25 topic banks, including six bridge lessons and five grammar corrections. Stable IDs/history remain intact; draft provenance does not claim teacher validation. Planning seeds and unfinished course proposals remain research, not empty lessons.

## Free first release: Cloudflare Pages

The learner is a static website. Cloudflare Pages Free supplies an HTTPS `pages.dev` address; a purchased domain, API server, credit-consuming AI and database are unnecessary for lessons, pictures, notebook, review, backups and device speech. Offline download remains an explicit learner action. No cloud account or host resource has been created by preparing these files.

The free plan has limits; see [Pages limits](https://developers.cloudflare.com/pages/platform/limits/). This export is checked against its 20,000-file and 25 MiB-per-file limits. A noindex instruction discourages search indexing; it does not make the beta private. Anyone with the public URL can open the learner. Personal learning data stays in each browser.

### Easiest route: upload the prepared files

1. Create/sign into a free Cloudflare account.
2. Open **Workers & Pages**, choose **Create application**, select **Pages**, then **Use direct upload / Upload assets**. Dashboard wording can change; [official Direct Upload guide](https://developers.cloudflare.com/pages/get-started/direct-upload/).
3. Name the project, for example `smartlingo-beta` (choose an available name).
4. Upload the supplied `smartlingo-beta.zip`, or drag the **contents** of `apps/learner/dist`. `index.html` must be at the upload root, alongside `_headers`, `deployment-config.js`, the service worker, pictures and `_expo`.
5. Deploy and copy the returned `https://….pages.dev` URL. Do not upload the source repository or filled secrets files.
6. Open that URL on your phone. All 129 lessons are included for your review there. No provider keys are needed.

Direct Upload projects cannot later switch to Git integration in place; create a new Git-connected project if you choose that route. A new address has separate browser learning storage: export a backup before moving.

To rebuild an upload from this branch:

```sh
npm ci
npm run check
npm test
npm run build:beta
npm run verify:beta
```

Use the Node version in `.node-version` and npm 11.17.0. `verify:beta` requires a clean committed source tree; builds from uncommitted edits remain usable for QA but cannot pass final release verification. Upload exactly the verified output, without editing it after hashing. CI also retains an uploadable `smartlingo-beta` artifact for seven days after successful checks.

### Alternative: automatic Git builds

Create a Pages project using **Connect to Git**, grant access to `trinamntn08/SmartLingo`, and choose the pushed **`feat/deployment-ready-beta`** branch for this preparation. Do not select the old scaffold on `main`. No merge into main is required to deploy this branch.

| Setting | Value |
| --- | --- |
| Root directory | Repository root (leave blank) |
| Framework preset | None |
| Build command | `npm ci && npm run build:beta && npm run verify:beta` |
| Output directory | `apps/learner/dist` |
| `NODE_VERSION` | `24.19.0` (also pinned in `.node-version`) |
| npm | `11.17.0` |
| `EXPO_NO_TELEMETRY` | `1` |
| `SMARTLINGO_API_URL` | Leave unset/empty for the free learner release |

If the host uses an older npm, select/configure npm 11.17.0 in its build environment before installation. No provider or access-token secrets belong in frontend build variables. Keep the project at its own origin root; subdirectory hosting is not configured.

### Fields you can leave blank now

The tracked [public beta settings](../deploy/beta.config.json) contain only:

```json
{ "apiUrl": "", "beta": true }
```

Leave `apiUrl` empty until an HTTPS API is running. All bundled learning works; online conversation, new neural generation and the owner workshop show an unavailable explanation. Public websites never try the visitor's localhost API. A valid API URL can later be supplied through `SMARTLINGO_API_URL` at build time or this JSON file. It must be an HTTPS **origin**, without a path/query/password.

After changing it, rebuild and reupload the entire export. Do not edit only the generated config: offline manifests fingerprint its bytes. Existing downloaded copies need an explicit update. A browser serving an older offline copy may still show the previous settings until updated.

The custom domain field is optional. Use `pages.dev` indefinitely, or later add your domain through Pages → Custom domains and copy the exact DNS records supplied by Cloudflare. Preserve email records. Download a learning backup before changing origin, then restore it at the new address.

## Optional online API: container with persistent storage

The existing Node/Fastify/SQLite backend is packaged separately. It cannot run on static Pages or directly in a Cloudflare Worker. [Compose configuration](../deploy/compose.yaml) supplies a Node API, durable `/app/data` volume and Caddy HTTPS proxy. No database password or managed database service is required.

A possible free host is an [Oracle Always Free VM](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm), using only resources marked Always Free in your home region. Account verification, capacity and idle-resource reclamation can affect availability. The prepared container can also run on any existing Linux machine with persistent disk. No server account is created automatically, no paid upgrade is selected and a trial credit balance is not an ongoing-free plan.

This optional server setup is more involved than the learner upload. You can finish the learner deployment first and leave the entire API section blank for later.

### Manual server setup

1. Create an account/Always Free VM if you want this option. Select an Ubuntu Linux image and only an eligible free shape/storage allocation shown by the provider. Save your SSH private key privately.
2. Install Docker Engine and the Docker Compose plugin using the [official Ubuntu instructions](https://docs.docker.com/engine/install/ubuntu/). Grant your trusted server user Docker access or use `sudo` as appropriate.
3. Obtain an API hostname that points to the VM's public IP. A hostname/subdomain you already control or a free DNS hostname can work. The static learner's `pages.dev` name is not the hostname for this separate server.
4. In the provider network/security rules and OS firewall, permit inbound TCP 80/443 for HTTPS provisioning and traffic. Restrict SSH 22 to your administration address where possible. **Do not expose 3001**; Compose keeps it internal.
5. Clone the repository and select this release branch:

```sh
git clone --branch feat/deployment-ready-beta https://github.com/trinamntn08/SmartLingo.git
cd SmartLingo
cp deploy/.env.api.example deploy/.env
chmod 600 deploy/.env
```

6. Edit `deploy/.env` on the server. Fill the four required account-specific fields:

| Field | Fill with |
| --- | --- |
| `SMARTLINGO_API_DOMAIN` | API hostname only, such as `api.your-hostname.example` |
| `SMARTLINGO_ALLOWED_ORIGINS` | Exact learner origin, e.g. `https://your-project.pages.dev`, no slash; comma-separated if needed |
| `SMARTLINGO_ADMIN_TOKEN` | A unique random owner access token, at least 32 characters |
| `SMARTLINGO_BETA_TOKEN` | A different unique random beta access token, at least 32 characters |

Generate each token separately on your computer/server, for example `openssl rand -hex 32`. Keep the owner token private; give only the beta token to trusted testers who may use paid features. These access tokens are not OpenAI/Azure keys. Do not commit filled settings or put tokens in URLs.

7. Optional provider fields may remain empty. Fill them only when you want the feature and have configured its billing:

| Feature | Required server-only fields |
| --- | --- |
| AI text | `OPENAI_API_KEY`, `OPENAI_TEXT_MODEL` |
| Recorded-input transcription | Above plus `OPENAI_TRANSCRIPTION_MODEL` |
| New neural audio generation | `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` |

Provider use can cost money even when hosting is free. Choose model IDs available to your account; none is silently selected. `SMARTLINGO_AI_DAILY_LIMIT` and `SMARTLINGO_SPEECH_DAILY_LIMIT` default to 40 reserved attempts, not a guaranteed spending cap. Conversation limits reset on API restart; speech reservations are durable. This is a single-instance personal/tester beta, not multi-user billing/account infrastructure.

8. Validate and start from the repository root:

```sh
docker compose --env-file deploy/.env -f deploy/compose.yaml config --quiet
docker compose --env-file deploy/.env -f deploy/compose.yaml up -d --build
docker compose --env-file deploy/.env -f deploy/compose.yaml ps
```

Missing required settings deliberately prevent startup. Caddy obtains HTTPS certificates when the hostname resolves and ports are reachable. Check `https://YOUR_API_HOST/health` for `{"status":"ok"}`. A normal `/lessons` visit without an owner token should return 401.

9. Set the frontend API URL to `https://YOUR_API_HOST`, then rebuild/redeploy the beta. In Profile → Online beta services, enter the **beta token** for optional AI/speech or **owner token** for editing. Tokens last only until tab reload or Clear online access; they are never saved in learning backups. Provider keys stay solely on the server.
10. Check publication loading, owner editing and deliberate small provider trials after you enable them. No real provider request is made during automated tests.

### Persistence, backups and updates

Keep a **single API instance** and the Compose `curriculum` volume. It contains curriculum SQLite plus a separate synthetic-speech cache. Recreating containers preserves the volume. `docker compose down -v` destroys volumes: do not use it for ordinary updates. VM deletion/reclamation can still lose its storage; keep off-server backups.

For a consistent curriculum snapshot using the existing CLI:

```sh
docker compose --env-file deploy/.env -f deploy/compose.yaml exec api node --import tsx apps/api/src/curriculum-backup-cli.ts backup --help
```

For example, choose a new filename for each snapshot:

```sh
docker compose --env-file deploy/.env -f deploy/compose.yaml exec api node --import tsx apps/api/src/curriculum-backup-cli.ts backup --destination data/backups/pre-update-001.sqlite
mkdir -p storage/curriculum-backups
docker compose --env-file deploy/.env -f deploy/compose.yaml cp api:/app/data/backups/pre-update-001.sqlite storage/curriculum-backups/pre-update-001.sqlite
```

Download that snapshot from the VM to a private place on your own device. It excludes the separate speech cache. For a full-volume backup including speech, stop the API briefly and snapshot/copy the entire volume using your server/volume backup mechanism, then restart. Protect these unencrypted files. Browser notebook/progress is separate: learners use Profile → Download learning backup.

For updates: make a backup, fetch the tested release, rebuild/restart Compose without removing volumes, verify health and a learner journey, then deploy the matching frontend. Existing owner edits/publications are preserved by exact guarded seed refreshes. Blank database overrides are omitted: `SMARTLINGO_DATABASE_PATH` is a recovery selection requiring an existing verified file, not a fresh-volume path setting.

## Acceptance after you publish

Open the actual HTTPS URL on your phone. Study a greetings lesson, open the new family/colour/price/health/payment bridge material, save/edit a word, rate review, reload, export/restore a backup, then download the app and cold-open it with networking off. Check device French speech. Online services need separate checks after their fields are filled. Physical iPhone/Safari, install icons, real provider quality and screen-reader checks remain manual device checks; desktop/narrow automated tests do not certify them.

Known dependency limitation: a fresh audit on 2026-11-17 still reports three moderate build-tool findings through Expo → fingerprint → minimatch, no high/critical findings. The affected tool is not a server feature or a shipped browser dependency. An ineffective override experiment was reverted; no fix or suppression is claimed. Revisit a compatible upstream fix before wider distribution. This does not prevent testing the beta export.
