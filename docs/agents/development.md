# Development

Use this guide when changing the package configuration, dependencies, or generated API types.

## Quick path

1. Make the configuration or dependency change in `src/` or `package.json`.
2. Regenerate types when rules, plugins, or config names change.
3. Run linting and type-checking before opening a pull request.

```bash
bun run build:types
bun run lint
bun run typecheck
```

## Change a rule

1. Update `src/config/<concern>/<concern>.config.ts`.
2. Use the normalized rule prefix described in [Conventions](conventions.md).
3. Add a config-name constant when the change introduces a named configuration.
4. Run `bun run build:types` if the rule set or config names changed.

## Add a plugin

1. Add the dependency in `package.json`.
2. Create or update the appropriate `src/config/<concern>/` module.
3. Add a prefix mapping in `src/const/plugin-rename.ts` when the plugin needs a normalized public prefix.
4. Regenerate types with `bun run build:types`.
5. Run `bun run lint` and `bun run typecheck`.
6. Add a changeset when package behavior changes; see [Pull requests](pull-requests.md).

## Inspect the resolved configuration

`@eslint/config-inspector` is already a development dependency. Run it to inspect the generated flat config:

```bash
bunx @eslint/config-inspector
```

## Generated types

`src/typegen.d.ts` is generated from the resolved configuration. Regenerate it after adding plugins, changing the available rules, or changing config names. Do not edit it manually.
