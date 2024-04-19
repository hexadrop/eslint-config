import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';

export default async function node(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			name: 'hexatool/node/rules',
			plugins: {
				// eslint-disable-next-line typescript/no-unsafe-assignment
				node: await interopDefault(import('eslint-plugin-n')),
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
