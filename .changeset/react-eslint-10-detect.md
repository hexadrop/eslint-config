---
'@hexadrop/eslint-config-react': patch
'@hexadrop/eslint-config': patch
---

Resolve the installed React version at config time instead of setting `settings.react.version` to `'detect'`. On ESLint 10, `eslint-plugin-react` resolves `'detect'` through the removed `context.getFilename()`, so the first `.tsx` file crashed with `TypeError: contextOrFilename.getFilename is not a function`. When React cannot be resolved the setting is omitted, which keeps the plugin on its default version instead of crashing.
