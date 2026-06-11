# AGENTS.md

## Project Scope

This repository contains a small, fully local clear card editor. Preserve the existing functionality,
UI, interactions, and PNG output unless a task explicitly requests a change.

The production artifact must remain a single offline HTML file that users can open directly through
`file://` without Node.js, a local server, a remote service, or a network connection.

## Development Rules

- Keep changes focused and low risk. Do not add features or redesign the UI without an explicit request.
- Do not replace or revert unrelated uncommitted changes.
- Keep application orchestration in `src/app`.
- Put card rendering in `src/components/card` and editor controls in `src/components/editor`.
- Put template defaults in `src/templates`, shared types in `src/types`, and pure logic in `src/utils`.
- Prefer existing components and patterns over new abstractions.
- Use Tailwind utilities for new or changed UI styles where practical. Do not perform broad CSS migrations.
- Keep all runtime assets local. Do not add remote fonts, images, scripts, APIs, or other network dependencies.
- Preserve transparent PNG output and preview/export consistency when changing card or export code.
- Preserve the single-file build and `scripts/verify-offline-build.mjs` checks.

## Validation

Run after every completed change:

```bash
pnpm check
```

Run tests when changing sizing or other tested pure logic:

```bash
pnpm test
```

For release-related changes, confirm that `dist/` contains only `index.html` and that the generated
file can be opened directly in a desktop Chromium browser.

## Documentation

- Keep `README.md` user-facing and concise.
- Do not add historical requirements, design proposals, roadmaps, or speculative future plans.

## Assets

Bilibili-related assets under `src/assets` are not covered by the project's MIT license. Preserve the
copyright notice in `README.md`.
