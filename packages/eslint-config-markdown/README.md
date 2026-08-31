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

```js
markdown({ markdown: false }); // resolves to an empty pipeline
```

Additional flat configs can be appended after the markdown slice:

```js
export default markdown({ markdown: true }, { name: 'my/override', rules: { 'markdown/no-html': 'off' } });
```

### Named exports

| Export                                                                                                      | Description                                                                           |
|-------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| `markdown`                                                                                                  | The raw markdown config items (the function the factory composes).                    |
| `GLOB_MARKDOWN`                                                                                             | Markdown files (`**/*.md`).                                                           |
| `GLOB_MARKDOWN_IN_MARKDOWN`                                                                                 | Nested markdown-in-markdown virtual files (`**/*.md/*.md`), ignored by the processor. |
| `GLOB_MARKDOWN_SOURCE` / `GLOB_MARKDOWN_JSON` / `GLOB_MARKDOWN_ASTRO`                                       | Code-block virtual file globs inside markdown files.                                  |
| `MARKDOWN_CONFIG_NAME_SETUP` / `MARKDOWN_CONFIG_NAME_SETUP_PROCESSOR` / `MARKDOWN_CONFIG_NAME_SETUP_PARSER` | Config names of the markdown slice.                                                   |

## License

MIT
