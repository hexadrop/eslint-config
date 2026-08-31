<h1 align="center">
  Hexadrop's ESLint configuration for React
</h1>

<p align="center">
  The React slice of <a href="https://github.com/hexadrop/eslint-config">@hexadrop/eslint-config</a>, publishable
  and usable standalone: <code>eslint-plugin-react</code>, <code>eslint-plugin-react-hooks</code> and
  <code>eslint-plugin-react-refresh</code> for jsx and tsx files.
</p>

## Installation

```bash
npm install --save-dev eslint @hexadrop/eslint-config-react
```

**Using bun**

```bash
bun add eslint @hexadrop/eslint-config-react --dev
```

To lint tsx files with the typescript flavor, also install the optional peer:

```bash
bun add @hexadrop/eslint-config-typescript --dev
```

## Usage

```js
// eslint.config.js
import hexadropReact from '@hexadrop/eslint-config-react';

export default hexadropReact();
```

### Options

```js
react({ react: false }); // resolves to an empty pipeline
```

The `typescript` option controls the flavor of the rules:

```js
react({ typescript: true }); // ts flavor; throws when @hexadrop/eslint-config-typescript is missing
react({ typescript: false }); // forces the js flavor
react(); // auto-detects: the typescript flavor activates when the optional peer is installed
```

Additional flat configs can be appended after the react slice:

```js
export default react({ typescript: true }, { name: 'my/override', rules: { 'react/display-name': 'off' } });
```

### Named exports

| Export                                                                                                      | Description                                     |
|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| `react`                                                                                                     | The raw react config items (the function the factory composes). |
| `HexadropEslintReactOptions`                                                                                | The factory options type.                       |
| `GLOB_REACT_JSX` / `GLOB_REACT_TSX`                                                                         | The jsx (`**/*.?([cm])jsx`) and tsx (`**/*.?([cm])tsx`) file globs. |
| `REACT_CONFIG_NAME_SETUP` / `REACT_CONFIG_NAME_RULES` / `REACT_CONFIG_NAME_RULES_HOOKS` / `REACT_CONFIG_NAME_RULES_REFRESH` | Config names of the react slice. |

## License

MIT
