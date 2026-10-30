# @hexadrop/eslint-config-typescript

TypeScript slice of the [hexadrop ESLint config](https://github.com/hexadrop/eslint-config): `typescript-eslint` plugin, parser, project-service wiring and the TypeScript rules.

## Installation

```bash
bun add -D @hexadrop/eslint-config-typescript eslint
```

## Usage

### Standalone

```js
// eslint.config.js
import typescript from '@hexadrop/eslint-config-typescript';

export default typescript({ project: 'tsconfig.json' });
```

`typescript()` without `project` resolves to an empty pipeline, so a standalone consumer must opt in:

- `project: true` enables TypeScript without type-aware rules.
- `project: 'tsconfig.json'` (or a list of paths) enables type-aware linting.
- `project: false` (or omitted) returns an empty config.

### With the meta-package

The meta-package enables this slice automatically when `typescript` is installed, using the root `tsconfig.json` when there is one (type-aware), or explicitly with `typescript: true` (non-type-aware) / a tsconfig path (type-aware).

## Options

| Option | Default | Description |
|---|---|---|
| `project` | `undefined` | `true` enables TS without type-aware linting; a path or list of paths enables type-aware linting; `false`/omitted returns an empty config. |
| `tsconfigRootDir` | `process.cwd()` | Root directory used to resolve the tsconfig paths. |
| `parserOptions` | `undefined` | Extra typescript-eslint parser options merged after `project`/`tsconfigRootDir`. Use `{ projectService: true }` when typescript-eslint should resolve the project per file (workspaces); `project` is then optional and omitted from the parser options. |

`tsconfigRootDir` is forwarded in both modes, so a workspace can root project resolution without replacing the whole config item. When using the meta-package, `parserOptions` is forwarded unchanged from `typescript.parserOptions`.

### Solution-style tsconfigs

A root `tsconfig.json` that only lists `references` (`files: []` plus `project references`) is expanded automatically: every reference is followed recursively (cycles are cut, duplicates removed) and the concrete projects are handed to the parser and the import resolver. Only the configured project is expanded — `project: true` stays non-type-aware — and the expanded references are absolute paths resolved from the config that declares them. Set `tsconfigRootDir` when the solution file lives outside `process.cwd()`:

```js
export default typescript({
  project: './tsconfig.json',
  tsconfigRootDir: import.meta.dirname,
});
```

## Optional peers

No optional peers: `eslint` is the only peer dependency. `typescript-eslint` is shipped as a regular dependency of this package.

## Named exports

`config` is the raw config function the factory composes; the default export is the `typescript()` factory. `TypescriptFactoryOptions` describes the options above and `TypescriptParserOptions` re-exports the typescript-eslint parser options type.

## License

MIT
