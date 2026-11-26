# Local dependencies and packaging

## Runtime and dependency isolation

Use the version-file baseline Node 24.19.0 and package-manager baseline npm 11.17.0. The supported engine ranges are Node >=24.19.0 <25 and npm >=11 <12. The .node-version and .nvmrc files let compatible runtime managers select Node. They do not install or virtualise Node by themselves. package.json enforces the supported major versions.

Install JavaScript/TypeScript dependencies locally with npm from the project root. They belong in ignored node_modules, never a global npm prefix. Invoke tools through npm scripts or local package binaries. No global Expo/Fastify installation is required. npm workspaces share the domain/content packages between the Expo learner and Fastify API.

Project .npmrc keeps the cache under ignored .cache/npm, saves exact dependency versions, and maintains package-lock.json. Commit manifests/lockfiles; do not commit installed libraries or caches. Environment variables and application data stay separate from source.

Use npm ci for reproducible installation from the lockfile. Use npm install only when intentionally adding/updating dependencies, then review and commit the lockfile change. Do not permanently disable dependency install scripts without verifying package needs.

The learner and API use Node/TypeScript. Optional free Japanese speech also has a Python component: on Windows x64, `npm run setup:japanese-voice` requires Python 3.12+ and installs pinned, hash-checked VOICEVOX artifacts into ignored `data/japanese-voice/`, including a private `venv`. `npm run dev:japanese-voice` starts that environment's Python service; it does not use global Python packages. Python and model downloads are unnecessary for ordinary text study or an installed device voice. See [Japanese audio](JAPANESE_AUDIO.md) for setup, the alternative official engine and limits.

This is dependency separation, not an operating-system sandbox. A container can be added if native/server tooling later needs stronger runtime reproducibility.

## Packaging

The root package is private to prevent accidental npm publication. Its files allowlist makes the bootstrap tooling package inspectable without bundling learner data, API keys, caches, node_modules, or unverified reference images.

Run `npm run pack:check` to inspect the bootstrap tooling package. `npm run build:web` exports local web assets under `apps/learner/dist`. `npm run build:apk` packages the learner in a private debug APK under `dist/android`. Install the JDK and SDK components listed in the [Android testing guide](ANDROID_TESTING.md) before building the APK. iOS packaging remains planned. Databases, APKs, debug keys and generated artifacts stay outside Git.

For GitHub, version source/configuration and package-lock.json; teammates restore dependencies with npm ci. Origin is configured for the [owner-selected SmartLingo repository](https://github.com/trinamntn08/SmartLingo). Verify live history before integrating; a local checkpoint commit does not itself prove a remote backup.

Dependency guidance references (recheck before changing tooling):
- [npm local package folders](https://docs.npmjs.com/cli/v11/configuring-npm/folders/)
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)
