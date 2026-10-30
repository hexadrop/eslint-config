# @hexadrop/eslint-config-react

## 1.2.0

### Minor Changes

- 169598d: Enable `react-refresh/only-export-components` only when the project declares a bundler with Fast Refresh (`vite` or `next`) instead of warning in every React project on component-library patterns. Only declared dependencies count, so a `vite` installed transitively through `vitest` no longer enables the rule. The rule can be forced with `react: { refresh: true }`, disabled with `refresh: false`, or tuned with `{ allowExportNames }`.

### Patch Changes

- 66bba1f: fix(deps): update dependency eslint-plugin-react-refresh to v0.5.7
- 9562d53: Resolve the installed React version at config time instead of setting `settings.react.version` to `'detect'`. On ESLint 10, `eslint-plugin-react` resolves `'detect'` through the removed `context.getFilename()`, so the first `.tsx` file crashed with `TypeError: contextOrFilename.getFilename is not a function`. When React cannot be resolved the setting is omitted, which keeps the plugin on its default version instead of crashing.
- 018f663: Resolve the installed React version across workspace packages, so a monorepo that hoists React into a child package's `node_modules` still pins `settings.react.version` instead of omitting it.
- Updated dependencies [549d5a0]
- Updated dependencies [9aa4206]
- Updated dependencies [8467bef]
  - @hexadrop/eslint-config-typescript@1.2.0

## 1.1.0

### Patch Changes

- 5c91a09: Extract the React concern into the new `@hexadrop/eslint-config-react` package, publishable and usable standalone via its `react()` factory. The meta-package composes it as a regular dependency with no behavior change.
- Updated dependencies [e5004c2]
  - @hexadrop/eslint-config-typescript@1.1.0
