# @hexadrop/eslint-config-typescript

TypeScript config slice: typescript-eslint plugin, parser, type-aware linting and project-service wiring.

## Implementation

- `src/typescript.config.ts` — async config function (plugin + parser + rules). Accepts `TypescriptFactoryOptions`.
- `src/typescript.parser.ts` — parser config helper (languageOptions with parser + projectService/tsconfig wiring).
- `src/typescript.factory.ts` — `FlatConfigComposer` wrapper exported as default.
- `src/typescript.typed-config.ts` — local `TypedFlatConfigItem` alias.
- `src/index.ts` — public API: `config` (raw function), `default` factory.

## Tests

```bash
bun test packages/eslint-config-typescript
```
