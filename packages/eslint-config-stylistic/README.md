# @hexadrop/eslint-config-stylistic

Stylistic slice of the hexadrop ESLint config: `@stylistic/eslint-plugin`, `eslint-plugin-unicorn`, `eslint-plugin-perfectionist` and Prettier formatting through `eslint-plugin-format`.

## Installation

```bash
bun add -D @hexadrop/eslint-config-stylistic eslint
```

## Usage

### Standalone

```js
import stylistic from '@hexadrop/eslint-config-stylistic';

export default stylistic();
```

Customize the formatting rules:

```js
import stylistic from '@hexadrop/eslint-config-stylistic';

export default stylistic({
  stylistic: { indent: 'space', indentSize: 2, quotes: 'double' },
});
```

Disable the whole slice:

```js
export default stylistic({ stylistic: false });
```

### With the meta-package

`@hexadrop/eslint-config` composes this package last and forwards its resolved options, so the meta-package keeps the exact same behavior as before the extraction.

## Options

| Option        | Default           | Description                                                                                                   |
|---------------|-------------------|---------------------------------------------------------------------------------------------------------------|
| `astro`       | auto-detected     | Adds the astro rules section. Requires `@hexadrop/eslint-config-astro`.                                        |
| `isTypeAware` | `false`           | Adds the type-aware TypeScript stylistic rules (needs a tsconfig path in the typescript slice).                |
| `json`        | auto-detected     | Adds the json rules and the `package.json`/`tsconfig.json` sort-keys items from `@hexadrop/eslint-config-json`. |
| `markdown`    | `false`           | Adds the stylistic rules for markdown code blocks.                                                             |
| `stylistic`   | full defaults     | Rules sub-options. `false` disables the entire slice.                                                          |
| `typescript`  | auto-detected     | Adds the TypeScript stylistic rules. Requires `@hexadrop/eslint-config-typescript`.                            |

### `stylistic` sub-options

`arrowParens`, `braceStyle`, `bracketSameLine`, `bracketSpacing`, `endOfLine`, `format`, `indent`, `indentSize`, `perfectionist`, `printWidth`, `quoteProps`, `quotes`, `semicolons`, `singleAttributePerLine`, `trailingComma` and `unicorn`.

`format`, `unicorn` and `perfectionist` toggle their whole ruleset; the rest map to both the `@stylistic` rules and the Prettier options.

## Optional peers

- `@hexadrop/eslint-config-typescript` — enables the typescript section.
- `@hexadrop/eslint-config-astro` — enables the astro section.
- `@typescript-eslint/eslint-plugin` — loaded only when the typescript section is active.

Detection uses `isPackageExists` from `local-pkg`:

- **Omitted** → the section is enabled when its peer is installed.
- **`true`** → forced on; throws an actionable error when the peer is missing.
- **`false`** → forced off.

`@hexadrop/eslint-config-json` is a regular dependency: the `package.json`/`tsconfig.json` sort-keys slice is owned by that package and only loaded when `json` is enabled.

## Formatting

Prettier is wired through `eslint-plugin-format`. `prettier` and `prettier-plugin-astro` ship as dependencies so the format section works out of the box, including `.astro` files when the astro section is enabled.

## Generated types

Rules and config names are generated from the package pipeline (`bun run build:types`), so `override()` and `remove()` calls are typed:

```js
export default stylistic().override('hexadrop/stylistic/rules/typescript', {
  rules: { 'style/indent': 'off' },
});
```
