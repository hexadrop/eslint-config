# Architecture

`markdownConfig()` composes the package's ESLint v9 flat configuration for Markdown files so consumers can use the markdown slice standalone or through the `@hexadrop/eslint-config` meta-package.

## Entry points

| Area                           | Responsibility                                                                                                                                              |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/index.ts`                 | Exports the default `markdownFactory()` and the named exports (globs, config names).                                                                        |
| `src/markdown.config.ts`       | Defines the markdown slice: `@eslint/markdown` plugin, merged processor, and the plain parser.                                                              |
| `src/markdown.globs.ts`        | Stores the file globs the slice targets, including the code-block virtual file globs (`GLOB_MARKDOWN_SOURCE`, `GLOB_MARKDOWN_JSON`, `GLOB_MARKDOWN_ASTRO`). |
| `src/markdown.config-name.ts`  | Stores the config names of the markdown slice.                                                                                                              |
| `src/markdown.typed-config.ts` | Provides the local `TypedFlatConfigItem` alias binding the shared generic to this package's generated `RuleOptions`.                                        |
| `scripts/typegen.ts`           | Generates typed rules and configuration names.                                                                                                              |

## Processors and parser

The slice wires two pieces on the `**/*.md` globs:

- A merged processor: `@eslint/markdown`'s `markdown` processor creates virtual files for fenced code blocks, and `eslint-merge-processors` adds a pass-through processor so the markdown file itself is also linted. `**/*.md/*.md` is ignored to avoid reprocessing nested virtual files.
- The `eslint-parser-plain` parser parses the markdown file itself as plain text.

The slice registers no rules of its own; other concerns (core, imports, stylistic) target the code-block virtual file globs.

## Independence

The package must stay publishable standalone: it owns its dependencies (`@eslint/markdown`, `eslint-merge-processors`, `eslint-parser-plain`, `eslint-flat-config-utils`) and never imports from `@hexadrop/eslint-config` source files. Shared types, constants and utilities come from the private `@hexadrop/eslint-config-shared` package — see [Feature packages](../../../docs/agents/feature-packages.md) for the consumption rules (tsconfig `paths` + tsdown `deps.alwaysBundle`, no manifest declaration). The local `TypedFlatConfigItem` is a one-line alias binding the shared generic to this package's generated `RuleOptions`.

The code-block globs `GLOB_MARKDOWN_SOURCE`, `GLOB_MARKDOWN_ASTRO` and `GLOB_MARKDOWN_JSON` replicate the meta-package's source, astro and json globs locally; feature packages never import from the meta-package source tree, and this package keeps no runtime dependency on other feature packages either.

## Dependency versions

See [Feature packages](../../../docs/agents/feature-packages.md#dependency-versions): cross-package dependencies between publishable packages use pinned semver, never the `workspace:` protocol.

## Public API

`markdownFactory()` accepts an optional options object (`{ markdown }`, default `true`) followed by additional flat config items to append. It returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

```js
import markdown from '@hexadrop/eslint-config-markdown';

export default markdown();
```

Named exports:

| Export                                                                                                      | Description                                                                            |
|-------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| `markdown`                                                                                                  | The raw markdown config function the factory composes.                                 |
| `GLOB_MARKDOWN` / `GLOB_MARKDOWN_IN_MARKDOWN`                                                               | Markdown files, and nested markdown-in-markdown virtual files to ignore.               |
| `GLOB_MARKDOWN_SOURCE` / `GLOB_MARKDOWN_JSON` / `GLOB_MARKDOWN_ASTRO`                                       | Code-block virtual file globs for source, json and astro blocks inside markdown files. |
| `MARKDOWN_CONFIG_NAME_SETUP` / `MARKDOWN_CONFIG_NAME_SETUP_PROCESSOR` / `MARKDOWN_CONFIG_NAME_SETUP_PARSER` | Config names of the markdown slice.                                                    |

## Generated types

`scripts/typegen.ts` resolves the package pipeline and writes `src/typegen.d.ts` (git-ignored). See [Development](development.md) for when to regenerate it.
