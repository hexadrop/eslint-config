import path from 'node:path';
import process from 'node:process';

import { createESLint, fixFixture, resolveFixturePath } from '@hexadrop/eslint-config-shared';
import { describe, expect, test } from 'bun:test';

import hexadrop from '../src';
import type { EndToEndCase } from './cases';
import { END_TO_END_CASES } from './cases';

const FIXTURES_DIR = path.join(import.meta.dir, 'fixtures');

function toStringArray(value: unknown): string[] {
	return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

describe('e2e fixtures', () => {
	test.each(END_TO_END_CASES)('$slug: fixtures/$file through eslint --fix', async (e2eCase: EndToEndCase) => {
		const inputPath = await resolveFixturePath(FIXTURES_DIR, e2eCase.file);
		const cwd = e2eCase.cwd ? path.join(FIXTURES_DIR, e2eCase.cwd) : FIXTURES_DIR;
		const previousCwd = process.cwd();
		let overrideConfig: Awaited<ReturnType<typeof hexadrop>>;

		try {
			if (e2eCase.cwd) {
				process.chdir(cwd);
			}

			overrideConfig = await hexadrop(e2eCase.options ?? {}, ...(e2eCase.extraConfigs ?? []));
		} finally {
			if (e2eCase.cwd) {
				process.chdir(previousCwd);
			}
		}

		const eslint = createESLint(cwd, overrideConfig);
		const { content, diagnostics } = await fixFixture(eslint, inputPath);
		const configs = overrideConfig as { name?: string }[];
		const configNames = configs.map(config => config.name).filter((name): name is string => name !== undefined);

		const expectedConfigNames = toStringArray(e2eCase.expectedConfigNames);

		for (const configName of expectedConfigNames) {
			expect(configNames).toContain(configName);
		}

		expect(diagnostics).toMatchSnapshot(`${e2eCase.slug}-diagnostics`);
		expect(content).toMatchSnapshot(`${e2eCase.slug}-content`);
	});
});
