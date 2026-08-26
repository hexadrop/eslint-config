# Common tasks

## Add a new plugin

1. Add the dependency to `package.json`.
2. Create or update the relevant `src/config/<concern>/` directory.
3. Register plugin rename mapping in `src/const/plugin-rename.ts` if needed.
4. Regenerate types: `bun run build:types`.
5. Run `bun run lint` and `bun run typecheck`.
6. Add a changeset if behavior changes.

## Add or change a rule

1. Update the appropriate `src/config/<concern>/<concern>.config.ts`.
2. Use the **renamed prefix** in rule keys.
3. Add a config name constant if it needs a new named config.
4. Regenerate types: `bun run build:types`.

## Verify the generated config

Use `@eslint/config-inspector` (already a dev dependency):

```bash
bunx @eslint/config-inspector
```
