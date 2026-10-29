---
'@hexadrop/eslint-config-core': patch
'@hexadrop/eslint-config': patch
---

Keep the default ignore globs when `ignore: true` and the working directory has no `.gitignore`. Previously the whole ignore slice was dropped, so `node_modules`, `dist`, lock files and the other defaults were linted.
