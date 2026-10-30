# @hexadrop/eslint-config-stylistic

## 1.1.2

### Patch Changes

- ad20379: fix(deps): update dependency eslint-plugin-perfectionist to v5.11.0
- 549d5a0: fix(deps): update typescript-eslint monorepo to v8.69.0
- c6146b2: fix(deps): update dependency prettier to v3.9.10
- Updated dependencies [549d5a0]
- Updated dependencies [1b00982]
- Updated dependencies [72398a5]
- Updated dependencies [9aa4206]
- Updated dependencies [8467bef]
  - @hexadrop/eslint-config-astro@1.1.2
  - @hexadrop/eslint-config-typescript@1.3.0

## 1.1.1

### Patch Changes

- ad20379: fix(deps): update dependency eslint-plugin-perfectionist to v5.11.0
- 549d5a0: fix(deps): update typescript-eslint monorepo to v8.69.0
- c6146b2: fix(deps): update dependency prettier to v3.9.10
- Updated dependencies [549d5a0]
- Updated dependencies [1b00982]
- Updated dependencies [72398a5]
- Updated dependencies [9aa4206]
- Updated dependencies [8467bef]
  - @hexadrop/eslint-config-astro@1.1.1
  - @hexadrop/eslint-config-typescript@1.2.0

## 1.1.0

### Patch Changes

- d5d86b8: Make `@hexadrop/eslint-config-json` an optional peer of the stylistic package instead of a regular dependency. The json section was already gated by `local-pkg` presence detection, but the hard dependency made it always present; standalone stylistic consumers now only get the json rules when `-json` is installed, while the meta-package keeps the same resolved config because it passes explicit flags and depends on `-json` directly.
- 9578f01: Extract the stylistic concern into the new `@hexadrop/eslint-config-stylistic` package, publishable and usable standalone via its `stylistic()` factory. The meta-package composes it through `optionalPlugin()` with no behavior change. The optional peers on `@hexadrop/eslint-config-typescript`, `@hexadrop/eslint-config-astro` and `@typescript-eslint/eslint-plugin` gate the embedded sections via presence detection, and the `package.json`/`tsconfig.json` sort-keys slice comes from `@hexadrop/eslint-config-json`.
- 90de0ce: Decompose the stylistic mega-module into one adapter per concern (base, typescript, json, astro, unicorn, perfectionist and format). `format`, `unicorn` and `perfectionist` become top-level options of the standalone `stylistic()` factory; the meta-package keeps them nested under `stylistic` and maps them, so the resolved config is unchanged.
- Updated dependencies [a60d291]
- Updated dependencies [2c9c1e8]
- Updated dependencies [e5004c2]
  - @hexadrop/eslint-config-astro@1.1.0
  - @hexadrop/eslint-config-json@1.1.0
  - @hexadrop/eslint-config-typescript@1.1.0
