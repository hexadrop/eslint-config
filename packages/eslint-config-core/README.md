# @hexadrop/eslint-config-core

Core slice of the hexadrop ESLint config: base ESLint rules, globals, ignores, `eslint-plugin-import-x`, `eslint-plugin-n`, the core/ignore/imports config names and their option types.

## Installation

```bash
bun add -D @hexadrop/eslint-config-core eslint
```

## Usage

### Standalone

```js
import coreFactory from '@hexadrop/eslint-config-core';

export default coreFactory();
```

Customize the base concerns:

```js
import coreFactory from '@hexadrop/eslint-config-core';

export default coreFactory({
  imports: true,
  markdown: true,
  node: false,
  stylistic: true,
  typescript: true,
});
```

### With the meta-package

`@hexadrop/eslint-config` composes the raw `core`, `ignore` and `imports` configs in its pipeline, so the meta-package keeps the exact same behavior as before the extraction.

## Optional peers

No optional peers: `eslint` is the only peer dependency. The base plugins (`eslint-plugin-import-x`, `eslint-plugin-n`, `eslint-config-flat-gitignore` and the import sorting/unused-import plugins) are regular dependencies of this package.

## Options

| Option        | Default          | Description                                                                                  |
|---------------|------------------|----------------------------------------------------------------------------------------------|
| `astro`       | `false`          | Adds the astro-specific import overrides.                                                     |
| `ignore`      | `true`           | Adds the default ignores and integrates `.gitignore`. Pass an object to add globs.            |
| `imports`     | `true`           | Adds the `import-x` setup and rules.                                                          |
| `json`        | `false`          | Adds the JSON import overrides.                                                               |
| `markdown`    | `false`          | Adds the markdown source overrides.                                                           |
| `module`      | `{ node: true }` | Configures the AMD, CommonJS, Node and webpack module rules (`amd`, `commonjs`, `node`, `webpack` and extra `ignore` globs). |
| `node`        | `true`           | Registers `eslint-plugin-n` and its rules.                                                    |
| `stylistic`   | `false`          | Adds the import sorting and unused-import rules.                                              |
| `typescript`  | `false`          | Adds the TypeScript import settings and rules. Pass `{ project, tsconfigRootDir, resolver }` to forward the tsconfig projects and `eslint-import-resolver-typescript` options. |

### TypeScript import resolution

```js
import coreFactory from '@hexadrop/eslint-config-core';

export default coreFactory({
  typescript: {
    project: ['./tsconfig.json'],
    resolver: { alwaysTryTypes: true, bun: true },
    tsconfigRootDir: import.meta.dirname,
  },
});
```

`project` paths (or `resolver.project` when no top-level project is set) are resolved against `tsconfigRootDir` (or `cwd()`) before they reach the resolver, so path aliases declared in the tsconfig resolve in `import/no-unresolved` without a consumer `settings` override.

Solution-style tsconfigs (`files: []` plus `references`) are supported through the resolver options: pass `resolver: { references: 'auto' }`. The meta-package can alternatively use `parserOptions.projectService` for type-aware linting.

## Named exports

- `core`, `ignore`, `imports` — the raw config functions the meta-package composes.
- Config names — `CORE_CONFIG_NAME_*`, `IGNORE_CONFIG_NAME_*`, `IMPORTS_CONFIG_NAME_*`.
- Types — `CoreFactoryOptions`, `CoreOptions`, `CoreIgnoreOptions`, `CoreModuleOptions`, `CoreTypescriptOptions`.

The file globs live in the private `@hexadrop/eslint-config-shared` package and are bundled into each published package; feature packages import them from there, so they do not depend on core.

## Generated types

Rules and config names are generated from the package pipeline (`bun run build:types`), so `override()` and `remove()` calls are typed.
