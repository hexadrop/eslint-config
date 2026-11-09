---
"@hexadrop/eslint-config-core": patch
"@hexadrop/eslint-config": patch
---

Parse imported `.js`, `.jsx`, `.cjs` and `.mjs` files with `@typescript-eslint/parser` by default, alongside the existing TypeScript extensions. This removes the need for consumers to add `import-x/parsers` manually when they import JavaScript modules from a dependency. Import rules such as `import/named` and `import/default` can now report on JavaScript modules that were previously skipped.

The `import-x/extensions` setting now lists the same module extensions, so extensionless imports resolve consistently. `import/no-useless-path-segments` no longer collapses explicit `index.js` imports in ESM TypeScript files, because that rewrite produces an invalid specifier; the `noUselessIndex` option now follows the `commonjs` setting.
