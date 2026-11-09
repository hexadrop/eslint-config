---
"@hexadrop/eslint-config-yaml": minor
"@hexadrop/eslint-config-core": patch
"@hexadrop/eslint-config-stylistic": patch
---

Add `@hexadrop/eslint-config-yaml`, a granular YAML slice usable standalone. It registers `eslint-plugin-yml` under the `yaml` prefix, uses its ESLint language for `*.yml`/`*.yaml` files and YAML fenced blocks in Markdown, and applies the plugin's `standard` conventions with two-space indentation and single quotes. Key ordering is not enforced because it is meaningful in CI files.

The meta-package does not compose this slice yet. Append it manually with `hexadrop().append(yaml())`; it joins `hexadrop()` with `yaml: true` by default in 2.0.0 ([#1129](https://github.com/hexadrop/eslint-config/issues/1129)).

To support a non-JavaScript language, the rule sets that only support ESLint's default `js` language (core, import-x, Unicorn, Perfectionist and `@stylistic`) are now scoped with `GLOB_JS_LANGUAGE` (JS/TS, Astro, JSON and Markdown). The resolved configuration for those files is unchanged; other languages such as YAML are excluded.
