import path from 'node:path';

import { createESLint, fixFixture, resolveFixturePath } from '@hexadrop/eslint-config-shared';
import { describe, expect, test } from 'bun:test';

import markdown from '../src';
import { END_TO_END_CASES } from './cases';

const FIXTURES_DIR = path.join(import.meta.dir, 'fixtures');

describe('e2e fixtures', () => {
	test.each(END_TO_END_CASES)('$slug: fixtures/$file through eslint --fix', async e2eCase => {
		const inputPath = await resolveFixturePath(FIXTURES_DIR, e2eCase.file);
		const overrideConfig = await markdown();
		const eslint = createESLint(FIXTURES_DIR, overrideConfig);
		const { content, diagnostics } = await fixFixture(eslint, inputPath);

		expect(diagnostics).toMatchSnapshot(`${e2eCase.slug}-diagnostics`);
		expect(content).toMatchSnapshot(`${e2eCase.slug}-content`);
	});
});
