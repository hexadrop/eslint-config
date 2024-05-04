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

- Respects `.gitignore` by default

## How to use

1. Create `eslint.config.js` in your project root:

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

## Configuration

- [Core configuration](#core-configuration)
- [Ignoring files](#ignoring-files)
- [Imports](#imports)
- [Typescript](#typescript)
- [Node](#node)

### Core configuration

Core configuration can not be disabled. There is some configuration that can be enabled or disabled.

| Option   | Type      | Default | Description              |
|----------|-----------|---------|--------------------------|
| amd      | `boolean` | `false` | Enable AMD support.      |
| commonjs | `boolean` | `false` | Enable CommonJS support. |
| webpack  | `boolean` | `false` | Enable webpack support   |

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
  core: {
    amd: true,
    commonjs: true,
    webpack: true,
  },
});
```

### Ignoring files

By default, the configuration will respect `.gitignore` file and exclude some files and directories from linting by 
default ([See more](./src/config/ignore/ignore.globs.ts)). You can disable this behavior by setting:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
  ignore: false,
});
```

You can pass custom configuration to `eslint-config-flat-gitignore`
([See full configuration](https://github.com/antfu/eslint-config-flat-gitignore/blob/main/src/index.ts#L7)).
It also includes additional `ignores` option to ignore additional files and directories using glob patterns.

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
  ignore: {
   ignores: ['**/nested/**'],
   files: ['./nested/.gitignore'],
   strict: true,
  },
});
```

### Imports

This configuration uses the following plugins to enforce a consistent import style:

- [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x)
- [eslint-plugin-unused-imports](https://github.com/sweepline/eslint-plugin-unused-imports)
- [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)

You can disable these plugins by setting:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
  imports: false,
});
```

These plugin can be configured by setting the following options:

| Option       | Type      | Default     | Description                     |
|--------------|-----------|-------------|---------------------------------|
| stylistic    | `boolean` | `true`      | Enable style related rules      |

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
  imports: {
    stylistic: false,
  },
});
```

### Typescript

This rules automatically detects if typescript is installed in your project and enables the typescript rules.
It uses [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/main).

You can disable these rules by setting:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
  typescript: false,
});
```

These rules can be configured by setting the following options:

| Option       | Type                          | Default                                                                  | Description                |
|--------------|-------------------------------|--------------------------------------------------------------------------|----------------------------|
| stylistic    | `boolean`                     | `true`                                                                   | Enable style related rules |
| tsconfigPath | `false \| string \| string[]` | Detects if there is a file named `tsconfig.json` in root of the project. | Enable type aware rules    |

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
  typescript: {
    stylistic: false,
    tsconfigPath: ['./tsconfig.json', './nested/tsconfig.json'],
  },
});
```

### Node

This rules care about the node environment and enable some rules to enforce best practices for node projects.
It uses [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n).

You can disable these rules by setting:

```js
// eslint.config.js
import hexatool from '@hexatool/eslint-config';

export default hexatool({
  node: false,
});
```

## View what rules are enabled

There is a [visual tool](https://github.com/eslint/config-inspector) to help you view what rules are enabled in your
project and apply them to what files.

Go to your project root that contains `eslint.config.js` and run:

```bash
bunx @eslint/config-inspector
```

## Inspiration and Credits

Here are some inspiration for this package.

- [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- [eslint-config-codely](https://github.com/CodelyTV/eslint-config-codely)

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented ReadMe** showing how to install and use
- **License favoring Open Source** and collaboration
