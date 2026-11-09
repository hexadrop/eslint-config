---
"@hexadrop/eslint-config": minor
"@hexadrop/eslint-config-core": patch
"@hexadrop/eslint-config-stylistic": patch
---

Add an opt-in YAML slice via the new `@hexadrop/eslint-config-yaml` package. `hexadrop({ yaml: true })` registers `eslint-plugin-yml` under the `yaml` prefix, uses its ESLint language for `*.yml`/`*.yaml` files and YAML fenced blocks in Markdown, and applies the plugin's `standard` conventions with two-space indentation and single quotes. Key ordering is not enforced.

YAML stays disabled by default (`yaml: false`) so existing consumers do not start reporting on YAML files after a minor update; the default flips to `true` in 2.0.0 ([#1129](https://github.com/hexadrop/eslint-config/issues/1129), milestone `2.0.0`). The meta-package's `eslint` peer range is now `^9.38.0 || ^10.0.0`, the minimum required by `eslint-plugin-yml` v3.

To support a non-JavaScript language, the rule sets that only support ESLint's default `js` language (core, import-x, Unicorn, Perfectionist and `@stylistic`) are now scoped with `GLOB_JS_LANGUAGE` (JS/TS, Astro, JSON and Markdown code blocks). The resolved configuration for those files is unchanged; only other languages such as YAML are excluded.
