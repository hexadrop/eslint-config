import {
	GLOB_REACT_JSX,
	GLOB_REACT_TSX,
	interopDefault,
	REACT_CONFIG_NAME_RULES,
	REACT_CONFIG_NAME_RULES_HOOKS,
	REACT_CONFIG_NAME_RULES_REFRESH,
	REACT_CONFIG_NAME_SETUP,
} from '@hexadrop/eslint-config-shared';
import { getPackageInfoSync, isPackageExists } from 'local-pkg';

import type { TypedFlatConfigItem } from './react.typed-config';
import type { ReactConfigOptions } from './react.types';

/**
 * Packages that ship React Fast Refresh. `react-refresh/only-export-components`
 * only makes sense for projects that re-render components in place: elsewhere
 * it warns on the component-plus-variant pattern of component libraries.
 */
const FAST_REFRESH_PACKAGES = ['vite'];

/**
 * Resolve the installed React version at config time.
 *
 * `settings.react.version: 'detect'` crashes on ESLint 10: eslint-plugin-react
 * resolves it through `context.getFilename()`, which no longer exists. Reading
 * the version ourselves keeps the plugin on a code path that works on both
 * ESLint 9 and 10.
 */
function detectReactVersion(): string | undefined {
	return getPackageInfoSync('react')?.version;
}

function isTypescriptEnabled(options: ReactConfigOptions): boolean {
	if (options.typescript !== undefined) {
		if (options.typescript && !isPackageExists('@hexadrop/eslint-config-typescript')) {
			throw new Error(
				'React typescript integration is enabled but @hexadrop/eslint-config-typescript is not installed. ' +
					'Install it with your package manager or set typescript: false to disable TS support.'
			);
		}

		return options.typescript;
	}

	return isPackageExists('@hexadrop/eslint-config-typescript');
}

export default async function reactConfig(options: ReactConfigOptions = {}): Promise<TypedFlatConfigItem[]> {
	const isTypescript = isTypescriptEnabled(options);

	const [pluginReact, pluginReactHooks, pluginReactRefresh] = await Promise.all([
		interopDefault(import('eslint-plugin-react')),
		interopDefault(import('eslint-plugin-react-hooks')),
		interopDefault(import('eslint-plugin-react-refresh')),
	] as const);
	const isAllowConstantExport = FAST_REFRESH_PACKAGES.some(packageName => isPackageExists(packageName));
	const isRefreshEnabled = typeof options.refresh === 'object' ? true : (options.refresh ?? isAllowConstantExport);
	const refreshOptions = typeof options.refresh === 'object' ? options.refresh : {};
	const reactVersion = detectReactVersion();

	const files = [...GLOB_REACT_JSX, ...(isTypescript ? GLOB_REACT_TSX : [])];

	return [
		{
			name: REACT_CONFIG_NAME_SETUP,
			plugins: {
				react: pluginReact,
				'react-hooks': pluginReactHooks,
				'react-refresh': pluginReactRefresh,
			},
			...(reactVersion && {
				settings: {
					react: {
						version: reactVersion,
					},
				},
			}),
		},
		{
			files,
			name: REACT_CONFIG_NAME_RULES,
			rules: {
				'react/display-name': 'error',
				'react/jsx-key': 'error',

				'react/jsx-no-comment-textnodes': 'error',

				'react/jsx-no-duplicate-props': 'error',
				'react/jsx-no-target-blank': 'error',
				'react/jsx-uses-react': 'error',
				'react/jsx-uses-vars': 'error',
				'react/no-children-prop': 'error',
				'react/no-danger-with-children': 'error',
				'react/no-deprecated': 'error',
				'react/no-direct-mutation-state': 'error',
				'react/no-find-dom-node': 'error',
				'react/no-is-mounted': 'error',
				'react/no-render-return-value': 'error',
				'react/no-string-refs': 'error',
				'react/no-unescaped-entities': 'error',
				'react/no-unknown-property': 'error',
				'react/no-unsafe': 'off',
				'react/react-in-jsx-scope': 'off',
				'react/require-render-return': 'error',

				...(!isTypescript && {
					'react/jsx-no-undef': 'error',
					'react/prop-types': 'error',
				}),
			},
		},
		{
			files,
			name: REACT_CONFIG_NAME_RULES_HOOKS,
			rules: {
				'react-hooks/exhaustive-deps': 'error',
				'react-hooks/rules-of-hooks': 'error',
			},
		},
		{
			files,
			name: REACT_CONFIG_NAME_RULES_REFRESH,
			rules: {
				'react-refresh/only-export-components': isRefreshEnabled
					? [
							'warn',
							{
								allowConstantExport: isAllowConstantExport,
								...refreshOptions,
							},
						]
					: 'off',
			},
		},
	];
}
