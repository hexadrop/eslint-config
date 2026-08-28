---
"@hexadrop/eslint-config": patch
---

Simplify `package.json` entry points for ESM-only consumption: remove the legacy root `main` and `types` fields and declare `types` explicitly inside the `exports` map, using `default` as the runtime condition. No behavior change for consumers on modern tooling (Node.js ≥12.7, bundlers, TypeScript with `node16`/`nodenext`/`bundler` module resolution).
