import type { HexadropEslintOptions } from '../src/options';
import type { RecursivePartial, TypedFlatConfigItem } from '../src/types';
import { afterAll, beforeAll, expect, it } from 'bun:test';
import { execa } from 'execa';
import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { glob } from 'tinyglobby';

function runWithConfig(name: string, configs: RecursivePartial<HexadropEslintOptions>, ...items: TypedFlatConfigItem[]) {
	it.concurrent(name, async () => {
		const from = resolve('test/fixtures/input');
		const output = resolve('test/fixtures/output', name);
		const target = resolve('test/_fixtures', name);

		await cp(from, target, {
			recursive: true,
			filter: (src) => {
				return !src.includes('node_modules');
			},
		});

		await writeFile(join(target, 'eslint.config.js'), `
		import { createJiti } from 'jiti';
		
		const importer = createJiti(import.meta.url);
		
		const hexadrop = importer('../../../src').default;
		
		export default hexadrop(
		  ${JSON.stringify(configs)},
		  ...${JSON.stringify(items) ?? []},
		)`,
		);

		await execa('bunx', ['eslint', '.', '--fix'], {
			cwd: target,
			stdio: 'pipe',
		});

		const files = await glob('**/*', {
			ignore: [
				'node_modules',
				'eslint.config.js',
			],
			cwd: target,
		});

		await Promise.all(files.map(async (file) => {
			const content = await readFile(join(target, file), 'utf-8');
			const source = await readFile(join(from, file), 'utf-8');
			const outputPath = join(output, file);
			const snapshot = await readFile(outputPath, 'utf-8');
			if (content === source) {
				await rm(outputPath, { force: true });
				return;
			}
			await expect(content).toMatchInlineSnapshot(snapshot);
		}));
	});
}

beforeAll(async () => {
	await rm('test/_fixtures', { recursive: true, force: true });
});
afterAll(async () => {
	// await rm('test/_fixtures', { recursive: true, force: true });
});

runWithConfig('js', {
	typescript: false,
})
