---
'@hexadrop/eslint-config-core': patch
'@hexadrop/eslint-config': patch
---

Silence `eslint-import-resolver-typescript`'s "Multiple projects found" warning when the resolver receives the project list forwarded from the `typescript` option. Solution-style tsconfigs intentionally expand to several projects, so the warning was noise in every monorepo run; set `resolver.noWarnOnMultipleProjects: false` to opt back in.
