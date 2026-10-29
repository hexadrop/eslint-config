---
'@hexadrop/eslint-config-react': minor
'@hexadrop/eslint-config': minor
---

Enable `react-refresh/only-export-components` only when Vite (Fast Refresh) is installed instead of warning in every React project on component-library patterns. The rule can be forced with `react: { refresh: true }`, disabled with `refresh: false`, or tuned with `{ allowExportNames }`.
