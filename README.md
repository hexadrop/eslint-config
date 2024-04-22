<h1 align="center">
  Hexatool's ESLint configuration
</h1>

<p align="center">
  Opinionated ESLint ruleset designed for large teams and projects considering modern JavaScript best practices and
  providing consistency to your code.
</p>

## Installation

```bash
npm install --save-dev eslint @hexatool/eslint-config
```

**Using bun**

```bash
bun add eslint @hexatool/eslint-config --dev
```

> [!IMPORTANT]
> Since v4.0.0, this config is rewritten to the
> new [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new).

## What it does

-   Single quotes, semi

-   Auto fix for formatting (aimed to be used standalone **without** Prettier)
-   Sorted imports, dangling commas
-   Reasonable defaults, best practices, only one line of config
-   Designed to work with TypeScript, JSX, React, Astro
-   Lints also for json, and markdown
-   Opinionated, but [very customizable](#customization)
-   [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
-   Using [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
-   Respects `.gitignore` by default
-   Optional [formatters](#formatters) support for CSS, HTML, etc.
-   **Style principle**: Minimal for reading, stable for diff, consistent

## How to use

1. Create `eslint.config.js` (or `eslint.config.mjs` if you not set `"type": "module"` in your `package.json`) in your
   project root:

    ```js
    // eslint.config.js
    import hexatool from '@hexatool/eslint-config';

    export default hexatool();
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

## VS Code support (auto fix on save)

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
	// Enable the ESlint flat config support
	"eslint.experimental.useFlatConfig": true,

	// Disable the default formatter, use eslint instead
	"prettier.enable": false,
	"editor.formatOnSave": false,

	// Auto fix
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": "explicit",
		"source.organizeImports": "never"
	},

	// Silent the stylistic rules in you IDE, but still auto fix them
	"eslint.rules.customizations": [
		{ "rule": "style/*", "severity": "off" },
		{ "rule": "format/*", "severity": "off" },
		{ "rule": "*-indent", "severity": "off" },
		{ "rule": "*-spacing", "severity": "off" },
		{ "rule": "*-spaces", "severity": "off" },
		{ "rule": "*-order", "severity": "off" },
		{ "rule": "*-dangle", "severity": "off" },
		{ "rule": "*-newline", "severity": "off" },
		{ "rule": "*quotes", "severity": "off" },
		{ "rule": "*semi", "severity": "off" }
	],

	// Enable eslint for all supported languages
	"eslint.validate": [
		"javascript",
		"javascriptreact",
		"typescript",
		"typescriptreact",
		"html",
		"markdown",
		"json",
		"jsonc"
	]
}
```

## Customization

Since v1.0, we migrated to [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new).
It provides much better organization and composition.

Normally you only need to import the `hexatool` preset:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool();
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
	/*
	 * Enable stylistic formatting rules
	 * Stylistic: true,
	 */

	// `.eslintignore` is no longer supported in Flat config, use `ignores` instead
	ignores: [
		'**/fixtures',
		// ...globs
	],

	// Disable jsonc
	jsonc: false,

	// Or customize the stylistic rules
	stylistic: {
		indent: 2, // 4, or 'tab'
		quotes: 'single', // Or 'double'
	},

	// TypeScript and Vue are auto-detected, you can also explicitly enable them:
	typescript: true,
});
```

The `hexatool` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool(
	{
		// Configures for hexatool's config
	},

	/*
	 * From the second arguments they are ESLint Flat Configs
	 * You can have multiple configs
	 */
	{
		files: ['**/*.ts'],
		rules: {},
	},
	{
		rules: {},
	},
);
```

Going more advanced, you can also import fine-grained configs and compose them as you wish:

<details>
<summary>Advanced Example</summary>

We wouldn't recommend using this style in general unless you know exactly what they are doing, as there are shared
options between configs and might need extra care to make them consistent.

```js
// eslint.config.js
import {
	astro,
	combine,
	gitignore,
	imports,
	javascript,
	json,
	node,
	perfectionist,
	react,
	stylistic,
	typescript,
	unicorn,
} from '@hexatool/eslint-config';

export default combine(
	astro(),
	gitignore(),
	imports(),
	javascript(),
	json(),
	node(),
	perfectionist(),
	react(),
	stylistic(),
	typescript(),
	unicorn(),
);
```

</details>

### Plugins Renaming

Since flat config requires us to explicitly provide the plugin names (instead of the mandatory convention from npm
package name), we renamed some plugins to make the overall scope more consistent and easier to write.

| New Prefix      | Original Prefix                      | Source Plugin                      |
| --------------- | ------------------------------------ | ---------------------------------- |
| `import/*`      | `import-x/*`                         | [eslint-plugin-import-x]           |
| `node/*`        | `n/*`                                | [eslint-plugin-n]                  |
| `json/*`        | `jsonc/*`                            | [eslint-plugin-jsonc]              |
| `style/*`       | `@stylistic/*`                       | [@stylistic/eslint-plugin]         |
| `import-sort/*` | `eslint-plugin-simple-import-sort/*` | [eslint-plugin-simple-import-sort] |
| `test/*`        | `vitest/*`                           | [eslint-plugin-vitest]             |
| `test/*`        | `no-only-tests/*`                    | [eslint-plugin-no-only-tests]      |
| `typescript/*`  | `@typescript-eslint/*`               | [@typescript-eslint/eslint-plugin] |

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

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files
and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file
extension:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool(
	{
		typescript: true,
		vue: true,
	},
	{
		// Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
		files: ['**/*.ts'],
		rules: {
			'ts/consistent-type-definitions': [
				'error',
				'interface',
			],
		},
	},
	{
		// Without `files`, they are general rules for all files
		rules: {
			'style/semi': [
				'error',
				'never',
			],
		},
	},
);
```

We also provided a `overrides` options in each integration to make it easier:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
	astro: {
		overrides: {
			// ...
		},
	},
	typescript: {
		overrides: {
			'ts/consistent-type-definitions': [
				'error',
				'interface',
			],
		},
	},
});
```

### Pipeline

Since v4.0.0, the factory function `hexatool()` returns
a [pipeline object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#pipe) where you
can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool()
	.prepend(
		// Some configs before the main config
	)
// Overrides any named configs
	.override(
		'hexatool/imports',
		{
			rules: {
				'import/order': [
					'error',
					{ 'newlines-between': 'always' },
				],
			},
		},
	)
// Rename plugin prefixes
	.renamePlugins({
		'old-prefix': 'new-prefix',
		// ...
	});
// ...
```

### Optional Configs

We provide some optional configs for specific use cases, that we don't include their dependencies by default.

#### Formatters

Use external formatters to format files that ESLint cannot handle yet (`.css`, `.html`, etc). Powered
by [`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format).

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
	formatters: {
		/**
		 * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
		 * By default uses Prettier
		 */
		css: true,
		/**
		 * Format HTML files
		 * By default uses Prettier
		 */
		html: true,
		/**
		 * Format Markdown files
		 * Supports Prettier and dprint
		 * By default uses Prettier
		 */
		markdown: 'prettier',
	},
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
bun add eslint-plugin-format --dev
```

#### React

To enable astro support, you need to explicitly turn it on or have `react` dependency installed in your project:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
	react: true,
});
```

You need to install required dependencies:

```bash
bun add eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh --dev
```

#### Astro

To enable astro support, you need to explicitly turn it on or have `astro` dependency installed in your project:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
	astro: true,
});
```

You need to install required dependencies:

```bash
bun add eslint-plugin-astro --dev
```

### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the
options object to the `typescript` config:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
	typescript: {
		tsconfigPath: 'tsconfig.json',
	},
});
```

### Editor Specific Disables

Some rules are disabled when inside ESLint IDE integrations,
namely [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports)

This is to prevent unused imports from getting removed by the IDE during refactoring to get a better developer
experience. Those rules will be applied when you run ESLint in the terminal or [Lint Staged](#lint-staged). If you don't
want this behavior, you can disable them:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
	isInEditor: false,
});
```

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
	"simple-git-hooks": {
		"pre-commit": "bun lint-staged"
	},
	"lint-staged": {
		"*": "eslint --fix"
	}
}
```

and then

```bash
bun add lint-staged simple-git-hooks --dev

// to activate the hooks
bunx simple-git-hooks
```

## View what rules are enabled

I built a visual tool to help you view what rules are enabled in your project and apply them to what
files, [@eslint/config-inspector](https://github.com/eslint/config-inspector)

Go to your project root that contains `eslint.config.js` and run:

```bash
bunx @eslint/config-inspector
```

## Inspiration and Credits

Here are some inspiration for this package.

-   [@antfu/eslint-config](https://github.com/antfu/eslint-config)
-   [eslint-config-codely](https://github.com/CodelyTV/eslint-config-codely)

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

-   Respect **Semantic Versioning**: No breaking changes in patch or minor versions
-   No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
-   **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
-   **Tests** as documentation and usage examples
-   **Well documented ReadMe** showing how to install and use
-   **License favoring Open Source** and collaboration

    [eslint-plugin-import-x]: https://github.com/un-es/eslint-plugin-import-x
    [eslint-plugin-n]: https://github.com/eslint-community/eslint-plugin-n
    [eslint-plugin-jsonc]: https://github.com/ota-meshi/eslint-plugin-jsonc
    [@stylistic/eslint-plugin]: https://github.com/eslint-stylistic/eslint-stylistic
    [eslint-plugin-simple-import-sort]: https://github.com/lydell/eslint-plugin-simple-import-sort
    [eslint-plugin-vitest]: https://github.com/veritem/eslint-plugin-vitest
    [eslint-plugin-no-only-tests]: https://github.com/levibuzolic/eslint-plugin-no-only-tests
    [@typescript-eslint/eslint-plugin]: https://github.com/typescript-eslint/typescript-eslint
