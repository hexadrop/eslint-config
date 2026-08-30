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

```js
json({ json: false }); // resolves to an empty pipeline
```

Additional flat configs can be appended after the json slice:

```js
export default json({ json: true }, { name: 'my/override', rules: { 'json/no-nan': 'off' } });
```

### Named exports

| Export | Description |
| --- | --- |
| `json` | The raw json config items (the function the factory composes). |
| `GLOB_JSON` | Files the json rules apply to (`**/*.json`, `**/*.json5`, `**/*.jsonc`). |
| `GLOB_JSON_PACKAGE` | `**/package.json` files. |
| `GLOB_JSON_TSCONFIG` | `**/tsconfig.json` and `**/tsconfig.*.json` files. |
| `JSON_CONFIG_NAME_SETUP` / `JSON_CONFIG_NAME_SETUP_PARSER` / `JSON_CONFIG_NAME_RULES` | Config names of the base json slice. |
| `JSON_SORT_KEYS_CONFIG` | Canonical key ordering for `package.json` and `tsconfig.json`, ready to append to any pipeline. |
| `STYLISTIC_CONFIG_NAME_RULES_JSON_PACKAGE` / `STYLISTIC_CONFIG_NAME_RULES_JSON_TSCONFIG` | Config names of the sort-keys items. |

## License

MIT
