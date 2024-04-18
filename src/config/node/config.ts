// eslint-disable-next-line import/namespace
import { default as pluginNode } from 'eslint-plugin-n';

import type { TypedFlatConfigItem } from '../../types';

export default function node(): TypedFlatConfigItem[] {
	return [
		{
			name: 'hexatool/node/rules',
			plugins: {
				// eslint-disable-next-line typescript/no-unsafe-assignment
				node: pluginNode,
			},
			rules: {
				'node/handle-callback-err': [
					'error',
					'^(err|error)$',
				],
				'node/no-deprecated-api': 'error',
				'node/no-exports-assign': 'error',
				'node/no-new-require': 'error',
				'node/no-path-concat': 'error',
				'node/prefer-global/buffer': [
					'error',
					'never',
				],
				'node/prefer-global/process': [
					'error',
					'never',
				],
				'node/process-exit-as-throw': 'error',
			},
		},
	];
}
