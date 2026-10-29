<h1 align="center">
  Hexadrop's ESLint configuration for JSON
</h1>

<p align="center">
  The JSON slice of <a href="https://github.com/hexadrop/eslint-config">@hexadrop/eslint-config</a>, publishable and
  usable standalone: jsonc plugin + parser, and the canonical sort-keys ordering for package.json and tsconfig.json.
</p>

## Installation

```bash
npm install --save-dev eslint @hexadrop/eslint-config-json
```

**Using bun**

```bash
bun add eslint @hexadrop/eslint-config-json --dev
```

## Usage

```js
// eslint.config.js
import json from '@hexadrop/eslint-config-json';

export default json();
```

### Options

The factory takes no options: the slice is the whole feature, so importing it is what enables it. It accepts any number of extra flat configs, which it appends after the json slice:

```js
export default json({ name: 'my/override', rules: { 'json/no-nan': 'off' } });
```

To disable the slice, use the meta-package (`json: false`) or simply do not import this package.

### With the meta-package

`@hexadrop/eslint-config` composes this slice as a regular dependency and controls it with its own `json` option (`json: false` skips it).

### Optional peers

No optional peers: `eslint` is the only peer dependency.

### Named exports

| Export                                       | Description                                                                                     |
|----------------------------------------------|-------------------------------------------------------------------------------------------------|
| `config` (default export of `json.config`)    | The raw json config function the factory composes.                                              |
| `JSON_SORT_KEYS_CONFIG`                      | Canonical key ordering for `package.json` and `tsconfig.json`, ready to append to any pipeline. |

Globs and config names stay internal: the file globs live in the private `@hexadrop/eslint-config-shared` package and are bundled into this package's `dist/`.

## License

MIT
