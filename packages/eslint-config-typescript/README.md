<h1 align="center">
  Hexadrop's ESLint configuration for TypeScript
</h1>

<p align="center">
  The TypeScript slice of <a href="https://github.com/hexadrop/eslint-config">@hexadrop/eslint-config</a>, publishable
  and usable standalone: <code>@typescript-eslint/eslint-plugin</code> and <code>@typescript-eslint/parser</code> rules for
  ts and tsx files.
</p>

## Installation

```bash
npm install --save-dev eslint @hexadrop/eslint-config-typescript
```

**Using bun**

```bash
bun add eslint @hexadrop/eslint-config-typescript --dev
```

## Usage

```js
// eslint.config.js
import hexadropTypescript from '@hexadrop/eslint-config-typescript';

export default hexadropTypescript();
```

### Options

```js
typescript({ typescript: false }); // resolves to an empty pipeline
```

The `typescript` option configures the type-aware linting path:

```js
typescript({ typescript: true }); // enable with default options; non-type-aware mode
typescript({ typescript: ['tsconfig.json'] }); // enable with tsconfig paths; type-aware mode
typescript({ typescript: 'tsconfig.json' }); // single tsconfig path; type-aware mode
typescript({ typescript: false }); // disables typescript support
```

Additional flat configs can be appended after the typescript slice:

```js
export default typescript(
  { typescript: true },
  { name: 'my/override', rules: { 'typescript/no-explicit-any': 'off' } }
);
```

### Named exports

| Export                                                                                                                                                                                                                                                                          | Description                                                          |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|
| `typescript`                                                                                                                                                                                                                                                                    | The raw typescript config items (the function the factory composes). |
| `HexadropEslintTypescriptOptions`                                                                                                                                                                                                                                               | The factory options type.                                            |
| `TYPESCRIPT_GLOBS` / `DTS_GLOBS` / `TEST_GLOBS`                                                                                                                                                                                                                                 | The ts, d.ts, and test file globs.                                   |
| `TYPESCRIPT_CONFIG_NAME_SETUP` / `TYPESCRIPT_CONFIG_NAME_SETUP_PARSER` / `TYPESCRIPT_CONFIG_NAME_SETUP_PARSER_TYPEAWARE` / `TYPESCRIPT_CONFIG_NAME_RULES` / `TYPESCRIPT_CONFIG_NAME_RULES_DTS` / `TYPESCRIPT_CONFIG_NAME_RULES_TEST` / `TYPESCRIPT_CONFIG_NAME_RULES_TYPEAWARE` | Config names of the typescript slice.                                |

## License

MIT
