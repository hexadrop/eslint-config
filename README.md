# Hexadrop ESLint config

Opinionated ESLint configuration for modern JavaScript and TypeScript projects. The repository publishes the zero-config meta-package `@hexadrop/eslint-config` and a set of granular packages so a project only installs the plugins it actually uses.

## Zero-config default

```bash
bun add -D eslint @hexadrop/eslint-config
```

```js
// eslint.config.js
import hexadrop from '@hexadrop/eslint-config';

export default hexadrop();
```

`hexadrop()` detects TypeScript, React and Astro from the consumer's dependencies and keeps the same resolved configuration as the 1.0.x package. See the [meta-package README](./packages/eslint-config/README.md) for every option and customization.

## Granular packages

| Package | What it brings | Install |
|---|---|---|
| [`@hexadrop/eslint-config-core`](./packages/eslint-config-core/README.md) | Base ESLint rules, globals, ignores, `import-x` and `n`. | `bun add -D @hexadrop/eslint-config-core eslint` |
| [`@hexadrop/eslint-config-typescript`](./packages/eslint-config-typescript/README.md) | `typescript-eslint` parser, plugin and type-aware rules. | `bun add -D @hexadrop/eslint-config-typescript` |
| [`@hexadrop/eslint-config-json`](./packages/eslint-config-json/README.md) | JSON/JSONC rules and the `package.json`/`tsconfig.json` sort-keys slice. | `bun add -D @hexadrop/eslint-config-json` |
| [`@hexadrop/eslint-config-markdown`](./packages/eslint-config-markdown/README.md) | Markdown processor and plain parser for code blocks. | `bun add -D @hexadrop/eslint-config-markdown` |
| [`@hexadrop/eslint-config-react`](./packages/eslint-config-react/README.md) | React, hooks and refresh rules. | `bun add -D @hexadrop/eslint-config-react` |
| [`@hexadrop/eslint-config-astro`](./packages/eslint-config-astro/README.md) | Astro plugin, parser and TS-in-astro support. | `bun add -D @hexadrop/eslint-config-astro` |
| [`@hexadrop/eslint-config-stylistic`](./packages/eslint-config-stylistic/README.md) | `@stylistic`, Unicorn, Perfectionist and Prettier formatting. | `bun add -D @hexadrop/eslint-config-stylistic` |
| `@hexadrop/eslint-config` | The zero-config meta-package composing everything above. | `bun add -D @hexadrop/eslint-config` |

`@hexadrop/eslint-config-shared` is private: it is never published and its types, utilities and file globs are bundled into each package.

All publishable packages share the same version and are released together, so the granular packages and the meta-package always match.

## Granular usage

A Node.js project only needs core:

```js
// eslint.config.js
import coreFactory from '@hexadrop/eslint-config-core';

export default coreFactory();
```

A TypeScript project adds the TypeScript and stylistic slices:

```js
// eslint.config.js
import coreFactory from '@hexadrop/eslint-config-core';
import stylistic from '@hexadrop/eslint-config-stylistic';
import typescript from '@hexadrop/eslint-config-typescript';

export default coreFactory().append(typescript({ project: 'tsconfig.json' }), stylistic());
```

An Astro project can compose the same way; the astro, typescript and stylistic sections auto-detect each other through optional peers:

```js
// eslint.config.js
import astro from '@hexadrop/eslint-config-astro';
import coreFactory from '@hexadrop/eslint-config-core';
import stylistic from '@hexadrop/eslint-config-stylistic';
import typescript from '@hexadrop/eslint-config-typescript';

export default coreFactory().append(astro(), typescript({ project: 'tsconfig.json' }), stylistic());
```

### Optional peers

The granular packages enable their cross-package sections when the sibling package is installed:

- `astro` and `react` auto-detect `@hexadrop/eslint-config-typescript`.
- `stylistic` auto-detects `@hexadrop/eslint-config-typescript`, `@hexadrop/eslint-config-astro` and `@hexadrop/eslint-config-json`.

Pass `true` to force a section (it throws an actionable error if the peer is missing) or `false` to disable it.

## How the packages fit

- The meta-package composes the base (`core`, `ignore`, `imports`) and the framework slices.
- Feature packages do not depend on `core`; they own their plugins and import the shared globs and utilities from the private `shared` package, which is bundled into each `dist/`.
- Each package runs its own typegen so its factory keeps fine-grained rule typing.

See [Architecture](docs/agents/architecture.md) for the package graph and the composition order.

## Development

```bash
bun install
bun run test
bun run typecheck
bun run lint:fix
bun run build
```

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or pull request.

## License

[MIT](./LICENSE)
