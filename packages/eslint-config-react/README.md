# @hexadrop/eslint-config-react

React slice of the hexadrop ESLint config: `eslint-plugin-react`, `react-hooks` and `react-refresh` rules.

## Installation

```bash
bun add -D @hexadrop/eslint-config-react eslint
```

## Usage

### Standalone

```js
// eslint.config.js
import react from '@hexadrop/eslint-config-react';

export default react();
```

With TypeScript support enabled explicitly:

```js
import react from '@hexadrop/eslint-config-react';

export default react({ typescript: true });
```

### With the meta-package

The meta-package `@hexadrop/eslint-config` enables react automatically when `react` is installed.

## Options

| Option | Default | Description |
|---|---|---|
| `refresh` | auto-detected | Enables `react-refresh/only-export-components`. Enabled only when the project declares `vite` or `next` in its `package.json`, because the rule is about Fast Refresh boundaries; `true` forces it on, `false` turns it off, and an object (`{ allowExportNames }`) enables it with extra allowed exports. |
| `typescript` | auto-detected | Adds TSX globs and the TypeScript-specific rule adjustments. `true` forces TS mode (throws if the peer is missing), `false` forces JS-only mode. When omitted, the section follows `@hexadrop/eslint-config-typescript` presence. |

Only declared dependencies count, so a `vite` that arrives transitively (through `vitest`, for example) does not enable the rule. Set `refresh: true` when the bundler lives in another workspace package, or `refresh: false` to keep the rule off.

## Optional peers

- `@hexadrop/eslint-config-typescript` — enables TSX files and the TypeScript-specific rules.

When the peer is absent, only JSX files are linted.

## License

MIT
