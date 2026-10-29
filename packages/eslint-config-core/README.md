# @hexadrop/eslint-config-core

Core slice of the hexadrop ESLint config: base ESLint rules, globals, ignores, `eslint-plugin-import-x`, `eslint-plugin-n` and the universal globs shared by every feature package.

## Installation

```bash
bun add -D @hexadrop/eslint-config-core eslint
```

## Usage

### Standalone

```js
import core from '@hexadrop/eslint-config-core';

export default core();
```

Customize the base concerns:

```js
import core from '@hexadrop/eslint-config-core';

export default core({
  imports: true,
  markdown: true,
  node: false,
  stylistic: true,
  typescript: true,
});
```

### With the meta-package

`@hexadrop/eslint-config` composes the raw `core`, `ignore` and `imports` configs in its pipeline, so the meta-package keeps the exact same behavior as before the extraction.

## Options

| Option        | Default | Description                                                                                  |
|---------------|---------|----------------------------------------------------------------------------------------------|
| `astro`       | `false` | Adds the astro-specific import overrides.                                                     |
| `ignore`      | `true`  | Adds the default ignores and integrates `.gitignore`. Pass an object to add globs.            |
| `imports`     | `true`  | Adds the `import-x` setup and rules.                                                          |
| `json`        | `false` | Adds the JSON import overrides.                                                               |
| `markdown`    | `false` | Adds the markdown source overrides.                                                           |
| `module`      | node    | Enables AMD, CommonJS, Node and webpack module rules.                                         |
| `node`        | `true`  | Registers `eslint-plugin-n` and its rules.                                                    |
| `stylistic`   | `false` | Adds the import sorting and unused-import rules.                                              |
| `typescript`  | `false` | Adds the TypeScript import settings and rules.                                                |

## Named exports

- `core`, `ignore`, `imports` — the raw config functions the meta-package composes.
- Universal globs — `SOURCE_GLOBS`, `JAVASCRIPT_GLOBS`, `ESLINT_CONFIG_GLOBS`, `IGNORE_GLOB`, `GLOB_ASTRO*`, `GLOB_JSON*`, `GLOB_MARKDOWN*`, `GLOB_REACT*`, `TYPESCRIPT_GLOBS`, `DTS_GLOBS`, `TEST_GLOBS`.
- Config names — `CORE_CONFIG_NAME_*`, `IGNORE_CONFIG_NAME_*`, `IMPORTS_CONFIG_NAME_*`.
- Types — `CoreFactoryOptions`, `CoreOptions`, `CoreIgnoreOptions`, `CoreModuleOptions`.

## Generated types

Rules and config names are generated from the package pipeline (`bun run build:types`), so `override()` and `remove()` calls are typed.
