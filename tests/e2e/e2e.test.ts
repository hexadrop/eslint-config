import path from 'node:path';

import { describe, expect, test } from 'bun:test';
import { ESLint } from 'eslint';

import hexadrop from '../../src';
import type { EndToEndCase } from './cases';
import { END_TO_END_CASES } from './cases';

const FIXTURES_DIR = path.join(import.meta.dir, 'fixtures');

/**
 * Freeze only what the linter reports: rule, severity, message and location.
 * Text is resolved from the fixture at runtime so snapshots stay stable even
 * if the fixture source shifts.
 */
async function lintFixture(e2eCase: EndToEndCase): Promise<unknown> {
	const fixtureDirectory = path.join(FIXTURES_DIR, e2eCase.fixture);
	const inputPath = path.join(fixtureDirectory, 'input.ts');
	const overrideConfig = await hexadrop(e2eCase.options ?? {}, ...(e2eCase.extraConfigs ?? []));

	if (!(await Bun.file(inputPath).exists())) {
		throw new Error(`Fixture "${e2eCase.fixture}" has no input.ts`);
	}

	const eslint = new ESLint({
		cwd: fixtureDirectory,
		overrideConfig,
		overrideConfigFile: true,
	});

	const results = await eslint.lintFiles([inputPath]);

	return results.map(result => ({
		filePath: path.basename(result.filePath),
		messages: result.messages.map(message => ({
			column: message.column,
			line: message.line,
			message: message.message,
			ruleId: message.ruleId ?? undefined,
			severity: message.severity,
		})),
	}));
}

describe('e2e lint results', () => {
	test.each(END_TO_END_CASES)('$slug: lints fixtures/$fixture through the real eslint engine', async e2eCase => {
		const diagnostics = await lintFixture(e2eCase);

		expect(diagnostics).toMatchSnapshot(e2eCase.slug);
	});
});
