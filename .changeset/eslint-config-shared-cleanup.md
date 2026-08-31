---
'@hexadrop/eslint-config': patch
---

Drop the duplicated shared internals from the meta-package: types (`Awaitable`, `Nullable`, `TypedFlatConfigItem`, `RecursivePartial`), constants (`PLUGIN_PREFIX`, `PLUGIN_RENAME`, `PLUGIN_RENAME_TYPESCRIPT`) and utilities (`interopDefault`, `toArray`, `renameRules`, `combine`, `extractTypedFlatConfigItem`, `pluginConfigRules`, `pluginConfigOverrideRules`) now come from the private `@hexadrop/eslint-config-shared` package, bundled into `dist/` at build time. No behavior change for consumers.
