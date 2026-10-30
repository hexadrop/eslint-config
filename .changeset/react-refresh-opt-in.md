---
'@hexadrop/eslint-config-react': minor
'@hexadrop/eslint-config': minor
---

Enable `react-refresh/only-export-components` only when the project declares a bundler with Fast Refresh (`vite` or `next`) instead of warning in every React project on component-library patterns. Only declared dependencies count, so a `vite` installed transitively through `vitest` no longer enables the rule. The rule can be forced with `react: { refresh: true }`, disabled with `refresh: false`, or tuned with `{ allowExportNames }`.
