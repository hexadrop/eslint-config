---
"@hexadrop/eslint-config": major
"@hexadrop/eslint-config-yaml": major
"@hexadrop/eslint-config-core": patch
"@hexadrop/eslint-config-stylistic": patch
---

Add YAML support via the new `@hexadrop/eslint-config-yaml` package. The meta-package now composes it and enables it by default (`yaml: true`): `eslint-plugin-yml` is registered under the `yaml` prefix, its ESLint language lints `*.yml`/`*.yaml` files and YAML fenced blocks in Markdown, and the slice applies the plugin's `standard` conventions with two-space indentation and single quotes. Key ordering is not enforced because it is meaningful in CI files. Set `yaml: false` to disable the slice.

This is a breaking release for two reasons: YAML files now report errors by default, and the meta-package's `eslint` peer range moves from `^9.17.0 || ^10.0.0` to `^9.38.0 || ^10.0.0`, the minimum required by `eslint-plugin-yml` v3.

To support a non-JavaScript language, the rule sets that only support ESLint's default `js` language (core, import-x, Unicorn, Perfectionist and `@stylistic`) are now scoped with `GLOB_JS_LANGUAGE` (JS/TS, Astro, JSON and Markdown). The resolved configuration for those files is unchanged; other languages such as YAML are excluded.
