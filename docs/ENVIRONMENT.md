# Local dependencies and packaging

## Runtime and dependency isolation

Use Node 24.19.0 and npm 11.x; the development baseline is npm 11.17.0. The .node-version and .nvmrc files let compatible runtime managers select Node. They do not install or virtualise Node by themselves. package.json enforces the supported major versions.

Install JavaScript/TypeScript dependencies locally with npm from the project root. They belong in ignored node_modules, never a global npm prefix. Invoke tools through npm scripts or local package binaries. No global Expo/Fastify installation is required. The current bootstrap has zero third-party dependencies.

Project .npmrc keeps the cache under ignored .cache/npm, saves exact dependency versions, and maintains package-lock.json. Commit manifests/lockfiles; do not commit installed libraries or caches. Environment variables and application data stay separate from source.

Use npm ci for reproducible installation from the lockfile. Use npm install only when intentionally adding/updating dependencies, then review and commit the lockfile change. Native dependency install scripts may become necessary during app implementation; do not permanently disable them without verifying package needs.

There is no Python component now. If one is introduced, create a local ignored .venv and a separate pinned Python dependency manifest. Do not mix Python environment management into the Node application.

This is dependency separation, not an operating-system sandbox. A container can be added if native/server tooling later needs stronger runtime reproducibility.

## Packaging

The root package is private to prevent accidental npm publication. Its files allowlist makes the bootstrap tooling package inspectable without bundling learner data, API keys, caches, node_modules, or unverified reference images.

Run npm run pack:check to inspect a dry run. No distributable learner app exists yet. Actual web assets, Android packages, and iOS builds will get separate build commands when their applications are scaffolded.

For GitHub, version source/configuration and package-lock.json; teammates restore dependencies with npm ci. Origin is configured for the [owner-selected SmartLingo repository](https://github.com/trinamntn08/SmartLingo). Verify live history before integrating; a local checkpoint commit does not itself prove a remote backup.

Official reference:
- [npm local package folders](https://docs.npmjs.com/cli/v11/configuring-npm/folders/)
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)
