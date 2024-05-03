
import { PLUGIN_RENAME } from '../../const';
import type { TypedFlatConfigItem } from '../../types';
import { interopDefault } from '../../utils';
import type { NodeOptions } from './node.options';


const NODE_CONFIG_NAME = 'hexatool/node';

export default async function node(
	options: NodeOptions = true,
): Promise<TypedFlatConfigItem[]> {
	if (options === false) {
		return [];
	}

	const {
		overrides = undefined
	} = typeof options === 'object' ? options : {};

	const nodePluginName = PLUGIN_RENAME.n;

	return [{
		name: `${NODE_CONFIG_NAME}/rules`,
		plugins: {
			[nodePluginName]: await interopDefault(import('eslint-plugin-n')),
		},
		rules: {
			[`${nodePluginName}/handle-callback-err`]: [
				'error',
				'^(err|error)$',
			],
			[`${nodePluginName}/no-deprecated-api`]: 'error',
			[`${nodePluginName}/no-exports-assign`]: 'error',
			[`${nodePluginName}/no-new-require`]: 'error',
			[`${nodePluginName}/no-path-concat`]: 'error',
			[`${nodePluginName}/prefer-global/buffer`]: [
				'error',
				'never',
			],
			[`${nodePluginName}/prefer-global/process`]: [
				'error',
				'never',
			],
			[`${nodePluginName}/process-exit-as-throw`]: 'error',
			...overrides
		},
	}];
}
