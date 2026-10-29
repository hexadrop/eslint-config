---
'@hexadrop/eslint-config-core': minor
'@hexadrop/eslint-config': minor
---

Forward the configured TypeScript project(s) to `eslint-import-resolver-typescript`, so `import/no-unresolved` resolves tsconfig `paths` aliases without a consumer `settings['import-x/resolver-next']` override. `typescript` now accepts `{ project, tsconfigRootDir, resolver }`: project paths from `project` or `resolver.project` are resolved against `tsconfigRootDir` and resolver options (`bun`, `alwaysTryTypes`, `conditionNames`, `noWarnOnMultipleProjects`, …) are forwarded untouched.
