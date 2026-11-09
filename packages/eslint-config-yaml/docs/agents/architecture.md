# Architecture

`yamlConfig()` composes the package's ESLint flat configuration for YAML files so consumers can use the yaml slice standalone or through the `@hexadrop/eslint-config` meta-package.

## Entry points

| Area                       | Responsibility                                                                                                                       |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `src/index.ts`             | Exports the default `yamlConfig()` factory and the raw `config` function.                                                            |
| `src/yaml.config.ts`       | Defines the yaml slice: yml plugin, YAML language and rules.                                                                         |
| `src/yaml.typed-config.ts` | Provides the local `TypedFlatConfigItem` alias binding the shared generic to this package's generated `RuleOptions`.                  |
| `scripts/typegen.ts`       | Generates typed rules and configuration names.                                                                                       |

## Language plugin

`eslint-plugin-yml` v3 ships an ESLint *language* plugin, so the slice uses `language: 'yaml/yaml'` and does not need `yaml-eslint-parser` as a direct dependency.

`FlatConfigComposer.renamePlugins()` only rewrites `plugins` and `rules`, never `language`. The slice therefore registers the plugin under the final `yaml` prefix and writes `language: 'yaml/yaml'` explicitly, instead of relying on the plugin's own `yml/yaml` id.

ESLint rejects JavaScript-only rules for a non-`js` language, so the rule sets that only support the default language (core, import-x, Unicorn, Perfectionist and `@stylistic`) are scoped with `GLOB_JS_LANGUAGE` in their own packages. YAML files therefore only receive the `yaml/*` rules.

## Rule set

The rules come from the plugin's `standard` preset (which includes `recommended`), flattened from its flat config array because `pluginConfigRules` expects a single `rules` object. Repository overrides:

- `yaml/indent`: two spaces.
- `yaml/quotes`: single quotes.
- `yaml/sort-keys`: off, because key order is meaningful in GitHub Actions and CI pipelines.

The same language and rules apply to YAML fenced code blocks in Markdown through `GLOB_MARKDOWN_YAML`.

## Independence

The package must stay publishable standalone: it owns its dependencies (`eslint-plugin-yml`, `eslint-flat-config-utils`) and never imports from `@hexadrop/eslint-config` source files. Shared types, constants and utilities come from the private `@hexadrop/eslint-config-shared` package — see [Feature packages](../../../../docs/agents/feature-packages.md) for the consumption rules (tsconfig `paths` + tsdown `deps.alwaysBundle`, no manifest declaration).

## Public API

`yamlConfig()` accepts any number of extra flat config items to append and returns a `FlatConfigComposer`; consumers may use `.override()`, `.prepend()`, `.append()`, `.remove()`, and `.renamePlugins()`.

```js
import yaml from '@hexadrop/eslint-config-yaml';

export default yaml();
```

## Generated types

`scripts/typegen.ts` resolves the package pipeline and writes `src/typegen.d.ts` (git-ignored). See [Development](development.md) for when to regenerate it.
