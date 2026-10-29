# Development and testing

Use the smallest command that validates the changed behavior.

## Commands

| Task                      | Command                                               |
|---------------------------|-------------------------------------------------------|
| Install dependencies      | `bun install`                                         |
| Run all unit tests        | `bun run test`                                        |
| Run tests for one package | `bun test packages/<name>`                            |
| Run tests for one file    | `bun test packages/<name>/src/<file>.test.ts`         |
| Lint and fix              | `bun run lint:fix`                                    |
| Lint without writing      | `bun run lint:ci`                                     |
| Type-check                | `bun run typecheck`                                   |
| Build all packages        | `bun run build`                                       |
| Build one package         | `bun run --filter @hexadrop/eslint-config-core build` |
| Golden resolved config    | `bun test packages/eslint-config/test/golden`         |
| End-to-end fixtures       | `bun test packages/eslint-config/e2e`                 |
