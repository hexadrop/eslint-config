<h1 align="center">
  Hexatool's ESLint + Prettier configuration
</h1>

<p align="center">
  A TypeScript ESLint ruleset designed for large teams and projects
</p>

## Installation

```bash
npm install --save-dev eslint @hexatool/eslint-config
```

**Using yarn**

```bash
yarn add eslint @hexatool/eslint-config -dev
```

## What it does

- Lints JavaScript and TypeScript
  using [`eslint:recommended`](https://eslint.org/docs/latest/user-guide/configuring/configuration-files#using-eslintrecommended)
  and [Prettier](https://prettier.io/)
- Uses the following plugins:
    - [`@typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint): TypeScript support
    - [`import`](https://github.com/import-js/eslint-plugin-import/): helps validate proper imports
    - [`simple-import-sort`](https://github.com/lydell/eslint-plugin-simple-import-sort/): sorts imports
    - [`unused-imports`](https://github.com/sweepline/eslint-plugin-unused-imports): finds and removes unused ES6 module
      imports

## How to use

1. Add it to your `.eslintrc.js` file

   ```js
   {
     extends: [ "@hexatool" ]
   }
   ```

2. Run eslint

   ```shell
    eslint .
   ```

   **Or adding to your package.json**

    ```json
    "scripts": {
        "lint": "eslint .",
        "lint:fix": "eslint --fix ."
    }
    ```

ℹ️ Please note that some rules enabled by default require that you have `strict: true` in your `tsconfig.json`.

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented ReadMe** showing how to install and use
- **License favoring Open Source** and collaboration
