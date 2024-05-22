<h1 align="center">
  hexadrop's ESLint configuration
</h1>

<p align="center">
  Opinionated ESLint ruleset designed for large teams and projects considering modern JavaScript best practices and
  providing consistency to your code.
</p>

## Installation

```bash
npm install --save-dev eslint @hexadrop/eslint-config
```

**Using bun**

```bash
bun add eslint @hexadrop/eslint-config --dev
```

## What it does

- Auto fix for formatting (aimed to be used standalone **without** Prettier)
- Respects .gitignore by default
- **Style principle**: Minimal for reading, stable for diff, consistent
   - Sorted imports, dangling commas
   - Single quotes, use of semicolons
   - Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- Opinionated, but [very customizable](#customization)
- Reasonable defaults, best practices, only one line of config
- Designed to work with TypeScript, JSX, JSON, Markdown, etc. Out-of-box.
- Supports ESLint v9 or v8.50.0+
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!

## How to use

1. Create `eslint.config.js` in your project root:

    ```js
    // eslint.config.js
    import hexadrop from '@hexadrop/eslint-config';

    export default hexadrop();
    ```

2. Run eslint

    ```shell
     eslint .
    ```

   **Or adding to your package.json**

    ```json
    {
      "scripts": {
        "lint": "eslint .",
        "lint:fix": "eslint --fix ."
      }
    }
    ```

> Note that `.eslintignore` no longer works in Flat config, see [customization](#customization) for more details.

## Customization

Normally you only need to import the `hexadrop` preset:

```js
// eslint.config.js
import hexadrop from '@hexadrop/eslint-config';

export default hexadrop();
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.js
import hexadrop from '@hexadrop/eslint-config';

export default hexadrop({
  // React are auto-detected, you can also explicitly enable them:
  react: true,

  // Disable stylistic formatting rules
  // stylistic: false,

  // Or customize the stylistic rules
  stylistic: {
    indent: 'spaces', // or 'tab'
    quotes: 'single', // or 'double'
  },

  // TypeScript are auto-detected, you can also explicitly enable them:
  typescript: true,
});
```

The `hexadrop` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import hexadrop from '@hexadrop/eslint-config';

export default hexadrop(
  {
    // Configures for hexadrop's config
  },

  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  }
);
```

Check out the [options](https://github.com/hexattol/eslint-config/blob/main/src/options/hexadrop-eslint.options.ts) and [factory](https://github.com/hexadrop/eslint-config/blob/main/src/factory.ts) for more details.

### Plugins Renaming

Since flat config requires us to explicitly provide the plugin names (instead of the mandatory convention from npm
package name), we renamed some plugins to make the overall scope more consistent and easier to write.

| New Prefix        | Original Prefix        | Source Plugin                      |
|-------------------|------------------------|------------------------------------|
| `style/*`         | `@stylistic/*`         | [@stylistic/eslint-plugin]         |
| `typescript/*`    | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin] |
| `import/*`        | `import-x/*`           | [eslint-plugin-import-x]           |
| `json/*`          | `jsonc/*`              | [eslint-plugin-jsonc]              |
| `node/*`          | `n/*`                  | [eslint-plugin-n]                  |
| `import-sort/*`   | `simple-import-sort/*` | [eslint-plugin-simple-import-sort] |
| `import-unused/*` | `unused-imports/*`     | [eslint-plugin-unused-imports]     |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line typescript/consistent-type-definitions
type foo = { bar: 2 }
```

> [!NOTE]
> About plugin renaming - it is actually rather a dangerous move that might lead to potential naming collisions,
> pointed out [here](https://github.com/eslint/eslint/discussions/17766)
> and [here](https://github.com/prettier/eslint-config-prettier#eslintconfigjs-flat-config-plugin-caveat). As this
> config
> also very **personal** and **opinionated**, I ambitiously position this config as the only **"top-level"** config per
> project, that might pivot the taste of how rules are named.
>
> This config cares more about the user-facings DX, and try to ease out the implementation details. For example, users
> could keep using the semantic `import/order` without ever knowing the underlying plugin has migrated twice
> to `eslint-plugin-i` and then to `eslint-plugin-import-x`. User are also not forced to migrate to the
> implicit `i/order`
> halfway only because we swapped the implementation to a fork.
>
> That said, it's probably still not a good idea. You might not want to do this if you are maintaining your own
> eslint config.
>
> Feel free to open issues if you want to combine this config with some other config presets but faced naming
> collisions. I am happy to figure out a way to make them work. But at this moment I have no plan to revert the
> renaming.

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import hexadrop from '@hexadrop/eslint-config';

export default hexadrop(
  {
    react: true,
    typescript: true,
  },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ['**/*.jsx'],
    rules: {
      'style/jsx-indent': 'off',
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'style/semi': ['error', 'never'],
    },
  }
);
```

### Config Composer

The factory function `hexadrop()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import hexadrop from '@hexadrop/eslint-config';

export default hexadrop()
  // some configs before the main config
  .prepend()
  // overrides any named configs
  .override('hexadrop/core/rules', {
    rules: {
      'no-console': 'off',
    },
  })
  // directly remove a named config
  .remove('hexadrop/typescript/rules/dts')
  // rename plugin prefixes
  .renamePlugins({
    'old-prefix': 'new-prefix',
    // ...
  });
// ...
```

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

and then

```bash
npm i -D lint-staged simple-git-hooks

// to active the hooks
npx simple-git-hooks
```

## View what rules are enabled

There is a [visual tool](https://github.com/eslint/config-inspector) to help you view what rules are enabled in your  project and apply them to what files.

Go to your project root that contains `eslint.config.js` and run:

```bash
npx @eslint/config-inspector
```

## Inspiration and Credits

Here are some inspiration for this package.

- [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- [eslint-config-codely](https://github.com/CodelyTV/eslint-config-codely)

## hexadrop Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration

  [@stylistic/eslint-plugin]: https://github.com/eslint-stylistic/eslint-stylistic
  [@typescript-eslint/eslint-plugin]: https://github.com/typescript-eslint/typescript-eslint
  [eslint-plugin-jsonc]: https://github.com/ota-meshi/eslint-plugin-jsonc
  [eslint-plugin-import-x]: https://github.com/un-es/eslint-plugin-import-x
  [eslint-plugin-n]: https://github.com/eslint-community/eslint-plugin-n
  [eslint-plugin-simple-import-sort]: https://github.com/lydell/eslint-plugin-simple-import-sort
  [eslint-plugin-unused-imports]: https://github.com/sweepline/eslint-plugin-unused-imports
