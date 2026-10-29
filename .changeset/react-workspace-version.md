---
'@hexadrop/eslint-config-react': patch
'@hexadrop/eslint-config': patch
---

Resolve the installed React version across workspace packages, so a monorepo that hoists React into a child package's `node_modules` still pins `settings.react.version` instead of omitting it.
