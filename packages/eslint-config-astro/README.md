# @hexadrop/eslint-config-astro

Astro slice of the hexadrop ESLint config: `eslint-plugin-astro`, `astro-eslint-parser` and `prettier-plugin-astro` rules.

## Installation

```bash
bun add -D @hexadrop/eslint-config-astro eslint
```

## Usage

### Standalone

```js
import astro from '@hexadrop/eslint-config-astro';

export default astro();
```

With typescript support enabled:

```js
import astro from '@hexadrop/eslint-config-astro';

export default astro({ typescript: true });
```

### With the meta-package

The meta-package `@hexadrop/eslint-config` enables astro automatically when `astro` is installed.

## Typescript support

The package auto-detects `@hexadrop/eslint-config-typescript`. When installed as an **optional peer**, TS-in-astro parsing and TS script linting are included. When absent, only JavaScript-level astro linting is active.

- `typescript: true` — force TS mode (throws if the peer is missing)
- `typescript: false` — force JS-only mode
