# @hexadrop/eslint-config-react

React slice of the hexadrop ESLint config: `eslint-plugin-react`, `react-hooks` and `react-refresh` rules.

## Installation

```bash
bun add -D @hexadrop/eslint-config-react eslint
```

## Usage

### Standalone

```js
import react from '@hexadrop/eslint-config-react';

export default react();
```

With typescript enabled manually:

```js
import react from '@hexadrop/eslint-config-react';

export default react({ typescript: true });
```

### With the meta-package

The meta-package `@hexadrop/eslint-config` enables react automatically when `react` is installed.

## Typescript support

The package auto-detects `@hexadrop/eslint-config-typescript`. When installed as an **optional peer**, TSX files and rules are included. When absent, only JSX files are linted.

- `typescript: true` — force TS mode (throws if the peer is missing)
- `typescript: false` — force JS-only mode
