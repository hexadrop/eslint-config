<h1 align="center">
  Hexadrop's ESLint configuration for YAML
</h1>

<p align="center">
  The YAML slice of <a href="https://github.com/hexadrop/eslint-config">@hexadrop/eslint-config</a>, publishable and
  usable standalone: the yml plugin, its YAML language for <code>.yml</code>/<code>.yaml</code> files and Markdown
  fenced blocks, and the repository's YAML conventions.
</p>

## Installation

```bash
npm install --save-dev eslint @hexadrop/eslint-config-yaml
```

**Using bun**

```bash
bun add eslint @hexadrop/eslint-config-yaml --dev
```

## Usage

```js
// eslint.config.js
import yaml from '@hexadrop/eslint-config-yaml';

export default yaml();
```

### Options

The factory takes no options: the slice is the whole feature, so importing it is what enables it. It accepts any number of extra flat configs, which it appends after the yaml slice:

```js
export default yaml({ name: 'my/override', rules: { 'yaml/no-empty-key': 'off' } });
```

To disable the slice, use the meta-package (`yaml: false`, the default there) or simply do not import this package.

### Rules

The slice starts from the plugin's `standard` preset and overrides:

| Rule            | Value                                                    | Why                                             |
|-----------------|----------------------------------------------------------|-------------------------------------------------|
| `yaml/indent`   | `['error', 2]`                                           | YAML always uses spaces.                        |
| `yaml/quotes`   | `['error', { avoidEscape: false, prefer: 'single' }]`    | Single quotes by default.                       |
| `yaml/sort-keys`| `'off'`                                                  | Key order is meaningful in CI and GitHub Actions. |

The slice registers the plugin's ESLint language (`language: 'yaml/yaml'`), so YAML files only receive `yaml/*` rules. The JavaScript-only rule sets in the meta-package are scoped with `GLOB_JS_LANGUAGE` and never reach YAML files.

### With the meta-package

`@hexadrop/eslint-config` composes this slice as a regular dependency and controls it with its own `yaml` option. YAML linting is **opt-in** while the meta-package stays on the `1.x` line: pass `yaml: true` to enable it. It becomes the default in `2.0.0` ([#1129](https://github.com/hexadrop/eslint-config/issues/1129)).

### Optional peers

No optional peers: `eslint` (`^9.38.0 || ^10.0.0`) is the only peer dependency.

### Named exports

| Export      | Description                                   |
|-------------|-----------------------------------------------|
| `config`    | The raw yaml config function the factory composes. |

Globs and config names stay internal: the file globs live in the private `@hexadrop/eslint-config-shared` package and are bundled into this package's `dist/`.

## License

MIT
