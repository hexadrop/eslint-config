<h1 align="center">
  Hexadrop's ESLint configuration for Astro
</h1>

<p align="center">
  The Astro slice of <a href="https://github.com/hexadrop/eslint-config">@hexadrop/eslint-config</a>, publishable
  and usable standalone: <code>eslint-plugin-astro</code> and <code>astro-eslint-parser</code> for <code>.astro</code> files.
</p>

## Installation

```bash
npm install --save-dev eslint @hexadrop/eslint-config-astro
```

**Using bun**

```bash
bun add eslint @hexadrop/eslint-config-astro --dev
```

To lint the typescript in `.astro` files, also install the optional peer:

```bash
bun add @hexadrop/eslint-config-typescript --dev
```

## Usage

```js
// eslint.config.js
import hexadropAstro from '@hexadrop/eslint-config-astro';

export default hexadropAstro();
```

### Options

```js
astro({ astro: false }); // resolves to an empty pipeline
```

The `typescript` option controls the typescript parsing path:

```js
astro({ typescript: true }); // ts-flavored parsing; throws when @hexadrop/eslint-config-typescript is missing
astro({ typescript: false }); // forces the js-only parsing path
astro(); // auto-detects: the typescript parsing path activates when the optional peer is installed
```

Additional flat configs can be appended after the astro slice:

```js
export default astro({ typescript: true }, { name: 'my/override', rules: { 'astro/semi': 'off' } });
```

### Named exports

| Export                                                                                                     | Description                                     |
|------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| `astro`                                                                                                    | The raw astro config items (the function the factory composes). |
| `HexadropEslintAstroOptions`                                                                               | The factory options type.                       |
| `GLOB_ASTRO` / `GLOB_ASTRO_JAVASCRIPT` / `GLOB_ASTRO_TYPESCRIPT`                                           | The `.astro` file globs and their inline script globs. |
| `ASTRO_CONFIG_NAME_RULES` / `ASTRO_CONFIG_NAME_SETUP` / `ASTRO_CONFIG_NAME_SETUP_PARSER` / `ASTRO_CONFIG_NAME_SETUP_PARSER_JAVASCRIPT` / `ASTRO_CONFIG_NAME_SETUP_PARSER_TYPESCRIPT` | Config names of the astro slice. |

## License

MIT
