# @hexadrop/eslint-config-astro

Astro slice of the hexadrop ESLint config: `eslint-plugin-astro`, `astro-eslint-parser` and the TypeScript-in-astro integration.

## Installation

```bash
bun add -D @hexadrop/eslint-config-astro eslint
```

## Usage

### Standalone

```js
// eslint.config.js
import astro from '@hexadrop/eslint-config-astro';

export default astro();
```

With TypeScript support enabled explicitly:

```js
import astro from '@hexadrop/eslint-config-astro';

export default astro({ typescript: true });
```

### With the meta-package

The meta-package `@hexadrop/eslint-config` enables astro automatically when `astro` is installed.

## Options

| Option | Default | Description |
|---|---|---|
| `typescript` | auto-detected | Enables TS parsing and TS script linting. Accepts `boolean` or a tsconfig path (or list of paths) for type-aware script linting. `true` forces TS mode (throws if the peer is missing), `false` forces JS-only mode. When omitted, the section follows `@hexadrop/eslint-config-typescript` presence. |

## Optional peers

- `@hexadrop/eslint-config-typescript` — enables TS-in-astro parsing and script linting.
- `@typescript-eslint/parser` — parser used for TypeScript script blocks; normally installed together with `-typescript`.

When the typescript peer is absent, only JavaScript-level astro linting is active.

## License

MIT
