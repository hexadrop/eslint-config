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
| `typescript` | auto-detected | Adds TSX globs and the TypeScript-specific rule adjustments. `true` forces TS mode (throws if the peer is missing), `false` forces JS-only mode. When omitted, the section follows `@hexadrop/eslint-config-typescript` presence. |

## Optional peers

- `@hexadrop/eslint-config-typescript` — enables TSX files and the TypeScript-specific rules.

When the peer is absent, only JSX files are linted.

## License

MIT
