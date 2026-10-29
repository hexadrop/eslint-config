<h1 align="center">
  Hexadrop's ESLint configuration for Markdown
</h1>

<p align="center">
  The Markdown slice of <a href="https://github.com/hexadrop/eslint-config">@hexadrop/eslint-config</a>, publishable
  and usable standalone: the markdown plugin processor merged with a pass-through processor, and the plain parser
  for markdown files.
</p>

## Installation

```bash
npm install --save-dev eslint @hexadrop/eslint-config-markdown
```

**Using bun**

```bash
bun add eslint @hexadrop/eslint-config-markdown --dev
```

## Usage

```js
// eslint.config.js
import markdown from '@hexadrop/eslint-config-markdown';

export default markdown();
```

### Options

The factory takes no options: the slice is the whole feature, so importing it is what enables it. It accepts any number of extra flat configs, which it appends after the markdown slice:

```js
export default markdown({ name: 'my/override', rules: { 'markdown/no-html': 'off' } });
```

To disable the slice, use the meta-package (`markdown: false`) or simply do not import this package.

### With the meta-package

`@hexadrop/eslint-config` composes this slice as a regular dependency and controls it with its own `markdown` option (`markdown: false` skips it).

### Optional peers

No optional peers: `eslint` is the only peer dependency.

### Named exports

| Export     | Description                                              |
|------------|----------------------------------------------------------|
| `config`   | The raw markdown config function the factory composes.   |

Globs and config names stay internal: the file globs live in the private `@hexadrop/eslint-config-shared` package and are bundled into this package's `dist/`.

## License

MIT
