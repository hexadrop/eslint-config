import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { javascript } from './config';
import type { Awaitable, TypedFlatConfigItem } from './types';

export default function hexatool() {
	const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

	configs.push(
		javascript()
	);



	let pipeline = new FlatConfigComposer<TypedFlatConfigItem>()

	pipeline = pipeline
		.append(
			...configs
		)
		.renamePlugins({
			'@stylistic': 'style',
			'@typescript-eslint': 'ts',
			'import-x': 'import',
			'n': 'node',
			'vitest': 'test',
			'yml': 'yaml',
		})

	return pipeline;
}
