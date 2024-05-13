# @hexatool/eslint-config

## 4.1.1

### Patch Changes

- 61ab403: Include `env` as an allow abbreviations

## 4.1.0

### Minor Changes

- 9ecc723: Update ignore modules in `import/no-unresolved` rule

### Patch Changes

- e8b08d4: Fix `module.ignore` default options
- 67cc847: Fix `style/indent` rule in astro markdown codeblock
- b7505fe: Disable `no-useless-assignment` on Astro files
- c29edc9: Disable `import/namespace` rule
- 26b57bd: Disable `style/jsx-one-expression-per-line` rule
- 63231fe: Disable `unicorn/prefer-dom-node-dataset` rule
- c84816d: Fix `formar/prettier` rule in astro markdown codeblock
- 32896ca: Fix `formar/prettier` parser in astro markdown codeblock
- 87e970f: Change MARKDOWN_SOURCE globs
- 4cd8bd4: Disable `style/indent-binary-ops` rule
- 841f608: Fix `formar/prettier` parser plugin in astro markdown codeblock
- d9480d5: Fix `prettier` in astro markdown

## 4.1.0-beta.6

### Patch Changes

- 841f608: Fix `formar/prettier` parser plugin in astro markdown codeblock

## 4.1.0-beta.5

### Patch Changes

- 32896ca: Fix `formar/prettier` parser in astro markdown codeblock

## 4.1.0-beta.4

### Patch Changes

- c84816d: Fix `formar/prettier` rule in astro markdown codeblock

## 4.1.0-beta.3

### Patch Changes

- 67cc847: Fix `style/indent` rule in astro markdown codeblock

## 4.1.0-beta.2

### Patch Changes

- d9480d5: Fix `prettier` in astro markdown

## 4.1.0-beta.1

### Patch Changes

- e8b08d4: Fix `module.ignore` default options
- 87e970f: Change MARKDOWN_SOURCE globs

## 4.1.0-beta.0

### Minor Changes

- 9ecc723: Update ignore modules in `import/no-unresolved` rule

### Patch Changes

- b7505fe: Disable `no-useless-assignment` on Astro files
- c29edc9: Disable `import/namespace` rule
- 26b57bd: Disable `style/jsx-one-expression-per-line` rule
- 63231fe: Disable `unicorn/prefer-dom-node-dataset` rule
- 4cd8bd4: Disable `style/indent-binary-ops` rule

## 4.0.9

### Patch Changes

- b1ab130: Fix rules `style/jsx-closing-bracket-location`

## 4.0.8

### Patch Changes

- 4241145: Fix rules `style/jsx-closing-bracket-location` and `style/jsx-quotes`

## 4.0.7

### Patch Changes

- cc4b76b: Disable `typescript/no-confusing-void-expression` in tests files

## 4.0.6

### Patch Changes

- ef1fcc1: Disable `typescript/no-confusing-void-expression` in tests files

## 4.0.5

### Patch Changes

- f7e4071: Remove `style/max-len` rule form json files

## 4.0.3

### Patch Changes

- 3c5623c: Update `eslint` `peerDependency`

## 4.0.2

### Patch Changes

- 3f30be3: Makes HexatoolEslintOptions partial

## 4.0.1

### Patch Changes

- ea77317: Disable `import/default`, `import/no-deprecated`, `import/no-named-as-default`, `import/no-named-as-default-member`, `import/namespace` from eslint.config.js

## 4.0.0

### Major Changes

- 6b61859: Update dependency eslint to v9
- Move to flat configuration

## 3.0.0

### Major Changes

- 6e2f779: Update typescript-eslint monorepo to v7
- e1ac0ff: Update dependency eslint-plugin-simple-import-sort to v12
- afbb812: Remove `@rushstack/eslint-patch`

### Minor Changes

- dd91071: update dependency prettier to v3.2.5
- 0cf6c8a: Update dependency eslint-plugin-prettier to v5.1.3
- 4de8a4c: Update dependency eslint-plugin-jsonc to v2.13.0
- 3967d98: Update dependency eslint-plugin-unused-imports to v3.1.0
- 39c4b0b: Update dependency eslint-plugin-mdx to v3.1.5

## 2.3.0

### Minor Changes

- 84eba91: update dependency prettier to v3.1.1
- 829cb01: update dependency eslint-config-prettier to v9.1.0
- 8183371: update dependency eslint-plugin-mdx to v3
- 829cb01: update typescript-eslint monorepo to v6.14.0

### Patch Changes

- 86de539: update dependency eslint-plugin-jsonc to v2.11.1
- 86de539: update dependency eslint-plugin-import to v2.29.1
- a9bf139: update dependency @rushstack/eslint-patch to v1.6.1

## 2.2.3

### Patch Changes

- 891e0c8: Update typescript-eslint monorepo to v6.10.0

## 2.2.2

### Patch Changes

- de001a0: Disable `max-params` rule

## 2.2.1

### Patch Changes

- 3110401: Update dependency eslint-plugin-jsonc to v2.10.0
- 666f003: Update dependency eslint-plugin-prettier to v5.0.1
- f4b4ab8: Update typescript-eslint monorepo to v6.9.0
- 44a26ea: Update dependency @rushstack/eslint-patch to v1.5.1
- 3956854: Update dependency eslint-plugin-import to v2.29.0

## 2.2.0

### Minor Changes

- 0775495: Update rule `max-params` to 4

## 2.1.3

### Patch Changes

- a9fa535: Fix eslint-plugin-import plugin rules

## 2.1.2

### Patch Changes

- 97de63c: Change `max-params` rule to 10

## 2.1.1

### Patch Changes

- 8be6a07: Disable `@typescript-eslint/no-extraneous-class` rule

## 2.1.0

### Major Changes

- 90cc825: Change prettier print-width to 120
- 90cc825: Enable the following import plugin rules

  - no-extraneous-dependencies
  - no-mutable-exports
  - no-named-as-default
  - no-named-as-default-member
  - default
  - named
  - namespace
  - no-absolute-path
  - no-useless-path-segments
  - consistent-type-specifier-style
  - exports-last
  - group-exports
  - no-anonymous-default-export
  - no-namespace
  - prefer-default-export

- 90cc825: Enable the following ESLint rules

  - capitalized-comments
  - complexity
  - consistent-this
  - curly
  - default-case-last
  - dot-notation
  - func-name-matching
  - func-names
  - grouped-accessor-pairs
  - guard-for-in
  - max-depth
  - max-params
  - multiline-comment-style
  - no-alert
  - no-bitwise
  - no-caller
  - no-eq-null
  - no-empty-static-block
  - no-eval
  - no-extra-bind
  - no-extra-label
  - no-floating-decimal
  - no-implicit-coercion
  - no-implicit-globals
  - no-implied-eval
  - no-inline-comments
  - no-invalid-this
  - no-iterator
  - no-label-var
  - no-lone-blocks
  - no-loop-func
  - no-mixed-operators
  - no-multi-assign
  - no-negated-condition
  - no-new-wrappers
  - no-sequences
  - no-underscore-dangle
  - no-unneeded-ternary
  - no-unused-expressions
  - no-useless-call
  - no-useless-computed-key
  - no-useless-return
  - one-var
  - operator-assignment
  - prefer-named-capture-group
  - prefer-numeric-literals
  - prefer-object-has-own
  - prefer-promise-reject-errors
  - require-await
  - quote-props
  - spaced-comment
  - arrow-parens

- 90cc825: Convert `@hexatool/eslint-config` in TypeScript flavor by default

### Minor Changes

- c55633a: Add astro support
- 34cdfd0: Add markdown support
- 90cc825: Add modern module resolution patch
- 8c4668e: Add json support

### Patch Changes

- 485cf69: Apply only @typescript-eslint/parser to `.ts` files
- 90cc825: update dependency prettier to v3.0.3
- 9a3e51a: Fix package.json files field
- cb7d2f2: Fix prettier for astro

## 2.1.0-beta.4

### Patch Changes

- cb7d2f2: Fix prettier for astro

## 2.1.0-beta.3

### Patch Changes

- 485cf69: Apply only @typescript-eslint/parser to `.ts` files

## 2.1.0-beta.2

### Patch Changes

- 9a3e51a: Fix package.json files field

## 2.1.0-beta.1

### Major Changes

- 90cc825: Change prettier print-width to 120
- 90cc825: Enable the following import plugin rules

  - no-extraneous-dependencies
  - no-mutable-exports
  - no-named-as-default
  - no-named-as-default-member
  - default
  - named
  - namespace
  - no-absolute-path
  - no-useless-path-segments
  - consistent-type-specifier-style
  - exports-last
  - group-exports
  - no-anonymous-default-export
  - no-namespace
  - prefer-default-export

- 90cc825: Enable the following ESLint rules

  - capitalized-comments
  - complexity
  - consistent-this
  - curly
  - default-case-last
  - dot-notation
  - func-name-matching
  - func-names
  - grouped-accessor-pairs
  - guard-for-in
  - max-depth
  - max-params
  - multiline-comment-style
  - no-alert
  - no-bitwise
  - no-caller
  - no-eq-null
  - no-empty-static-block
  - no-eval
  - no-extra-bind
  - no-extra-label
  - no-floating-decimal
  - no-implicit-coercion
  - no-implicit-globals
  - no-implied-eval
  - no-inline-comments
  - no-invalid-this
  - no-iterator
  - no-label-var
  - no-lone-blocks
  - no-loop-func
  - no-mixed-operators
  - no-multi-assign
  - no-negated-condition
  - no-new-wrappers
  - no-sequences
  - no-underscore-dangle
  - no-unneeded-ternary
  - no-unused-expressions
  - no-useless-call
  - no-useless-computed-key
  - no-useless-return
  - one-var
  - operator-assignment
  - prefer-named-capture-group
  - prefer-numeric-literals
  - prefer-object-has-own
  - prefer-promise-reject-errors
  - require-await
  - quote-props
  - spaced-comment
  - arrow-parens

- 90cc825: Convert `@hexatool/eslint-config` in TypeScript flavor by default

### Minor Changes

- c55633a: Add astro support
- 34cdfd0: Add markdown support
- 90cc825: Add modern module resolution patch
- 8c4668e: Add json support

### Patch Changes

- 90cc825: update dependency prettier to v3.0.3

## 2.0.0-beta.0

### Major Changes

- e935a19: Update dependency prettier to v3
- f498849: Update dependency eslint-plugin-prettier to v5
- b70325f: Update dependency eslint-config-prettier to v9
- ec5e999: Update dependency eslint-plugin-unused-imports to v3
- a002346: Update dependency eslint-config-prettier to v9

### Patch Changes

- 3a27d3c: Update dependency eslint-plugin-import to v2.28.1
- 4b7f231: Update dependency eslint-plugin-import to v2.28.1
- 91561a6: Update dependency eslint-config-prettier to v8.10.0
- f8676a5: Update babel dependency

## 1.0.9

### Patch Changes

- fea16d9: update dependency prettier to v2.8.8

## 1.0.8

### Patch Changes

- 463cfd8: Update dependencies

## 1.0.7

### Patch Changes

- 480742b: Update dependencies

## 1.0.6

### Patch Changes

- bf1dfa8: update dependency prettier to v2.8.4
- bf1dfa8: Disable `import/no-unresolved` rule due an incompatibility with package.json exports

## 1.0.5

### Patch Changes

- 4f7d92d: update dependency prettier to v2.8.4

## 1.0.4

### Patch Changes

- e26d05b: Move `@changesets/cli` to `devDependencies`
- 4bfa1cc: Update `eslint-plugin-simple-import-sort` to v10

## 1.0.3

### Patch Changes

- 99ddbc5: Fix .npmignore

## 1.0.2

### Patch Changes

- dab6531: Update dependencies
