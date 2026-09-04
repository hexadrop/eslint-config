# @hexadrop/eslint-config-typescript

TypeScript slice of the [hexadrop ESLint config](https://github.com/hexadrop/eslint-config): typescript-eslint plugin, parser, project-service wiring and type-aware rules.

## Install

```bash
npm install --save-dev @hexadrop/eslint-config-typescript
```

## Usage

```js
import typescript from '@hexadrop/eslint-config-typescript';

export default typescript({ project: 'tsconfig.json' });
```

## License

MIT
