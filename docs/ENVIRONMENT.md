# Dependencies, Cloud workspaces and packaging

## Runtime and dependency isolation

Use Node 24.19.0 and npm 11.x; the development baseline is npm 11.17.0. The .node-version and .nvmrc files let compatible runtime managers select Node. They do not install or virtualise Node by themselves. package.json enforces the supported major versions.

Install JavaScript/TypeScript dependencies locally with npm from the project root. They belong in ignored node_modules, never a global npm prefix. Invoke tools through npm scripts or local package binaries. No global Expo/Fastify installation is required. npm workspaces share the domain/content packages between the Expo learner and Fastify API.

Project .npmrc keeps the cache under ignored .cache/npm, saves exact dependency versions, and maintains package-lock.json. Commit manifests/lockfiles; do not commit installed libraries or caches. Environment variables and application data stay separate from source.

Use npm ci for reproducible installation from the lockfile. Use npm install only when intentionally adding/updating dependencies, then review and commit the lockfile change. Native dependency install scripts may become necessary during app implementation; do not permanently disable them without verifying package needs.

There is no Python component now. If one is introduced, create a local ignored .venv and a separate pinned Python dependency manifest. Do not mix Python environment management into the Node application.

This is dependency separation, not an operating-system sandbox. A container can be added if native/server tooling later needs stronger runtime reproducibility.

## Managed Cloud workspaces

Codex Cloud uses a separate managed computer and a workspace for each task. It uses the same committed runtime versions, lockfile and test commands; no copy of the owner's Windows environment, browser learning data or local database is required. Ordinary lessons and fake-provider tests need no permanent AI credential. Install dependencies in the Cloud checkout with `npm ci`, Git hooks with `npm run setup`, and Chromium/OS dependencies with `npx playwright install --with-deps chromium`.

The owner confirms republishing the SmartLingo environment and opening it on the phone. Follow [the Cloud guide](CLOUD_WORKFLOW.md) to verify a fresh task uses the current remote app branch. Default `main` is still the old scaffold; uploaded curriculum-review and concurrent-session branches are not automatically combined with the app. Republish when changing the reusable setup, and use a new task to test it; preserve existing task edits.

## Packaging

The root package is private to prevent accidental npm publication. Its files allowlist makes the bootstrap tooling package inspectable without bundling learner data, API keys, caches, node_modules, or unverified reference images.

Run npm run pack:check to inspect a tooling-package dry run; this root allowlist is not an application deployment artifact. `npm run build:web` exports local web assets under `apps/learner/dist`. Android and iOS builds remain planned. Databases and generated artifacts stay ignored.

For the static-preview deployment steps and the separate work required for a hosted API, see [Architecture and deployment explained](ARCHITECTURE_EXPLAINED.md#7-deploying-in-stages). The local preview server and loopback API are not a public hosting configuration.

For GitHub, version source/configuration and package-lock.json; teammates restore dependencies with npm ci. Origin is configured for the [owner-selected SmartLingo repository](https://github.com/trinamntn08/SmartLingo). Verify live history before integrating; a local checkpoint commit does not itself prove a remote backup.

Official reference:
- [npm local package folders](https://docs.npmjs.com/cli/v11/configuring-npm/folders/)
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)
