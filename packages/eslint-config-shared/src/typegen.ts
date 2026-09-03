import type { Linter } from 'eslint';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';

export default async function writeFlatConfigs(configs: Linter.Config[], outPath: string): Promise<void> {
	const configNames = configs.map(index => index.name).filter(Boolean) as string[];

	let dts = await flatConfigsToRulesDTS(configs, {
		includeAugmentation: false,
	});

	dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(index => `'${index}'`).join(' | ')}
`;

	await Bun.write(outPath, dts);
}
