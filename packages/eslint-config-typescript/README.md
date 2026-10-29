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

The meta-package enables this slice automatically when `typescript` is installed, or explicitly with `typescript: true` / a tsconfig path.

## Options

| Option | Default | Description |
|---|---|---|
| `project` | `undefined` | `true` enables TS without type-aware linting; a path or list of paths enables type-aware linting; `false`/omitted returns an empty config. |
| `tsconfigRootDir` | `process.cwd()` | Root directory used to resolve the tsconfig paths. |

## Optional peers

No optional peers: `eslint` is the only peer dependency. `typescript-eslint` is shipped as a regular dependency of this package.

## Named exports

`config` is the raw config function the factory composes; the default export is the `typescript()` factory. `TypescriptFactoryOptions` describes the options above.

## License

MIT
