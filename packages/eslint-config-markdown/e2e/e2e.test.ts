import path from 'node:path';

import { describe, expect, test } from 'bun:test';
import { ESLint } from 'eslint';

import markdown from '../src';
import type { EndToEndCase } from './cases';
import { END_TO_END_CASES } from './cases';

const FIXTURES_DIR = path.join(import.meta.dir, 'fixtures');

async function createESLint(e2eCase: EndToEndCase): Promise<{ eslint: ESLint; inputPath: string }> {
	const inputPath = path.join(FIXTURES_DIR, e2eCase.file);
	const overrideConfig = await markdown();

	if (!(await Bun.file(inputPath).exists())) {
		throw new Error(`Missing fixture file: ${e2eCase.file}`);
	}

	const eslint = new ESLint({
		cwd: FIXTURES_DIR,
		fix: true,
		overrideConfig,
		overrideConfigFile: true,
	});

	return { eslint, inputPath };
}

/**
 * Run the fixture through the real eslint engine in fix mode and freeze both
 * halves of its behavior, mirroring packages/eslint-config-json:
 *
 * - `result.output ?? source`: the file content after `eslint --fix`, pinned
 *   so processor or parser regressions surface as snapshot diffs.
 * - `result.messages`: the diagnostics that survive the pass-through of the
 *   markdown file itself, pinned so processor wiring changes surface as
 *   snapshot diffs.
 */
async function fixFixture(e2eCase: EndToEndCase): Promise<{ content: string; diagnostics: unknown[] }> {
	const { eslint, inputPath } = await createESLint(e2eCase);
	const [result] = await eslint.lintFiles([inputPath]);
	const source = await Bun.file(inputPath).text();

	return {
		content: result?.output ?? source,
		diagnostics: (result?.messages ?? []).map(message => ({
			column: message.column,
			line: message.line,
			message: message.message,
			ruleId: message.ruleId ?? undefined,
			severity: message.severity,
		})),
	};
}

describe('e2e fixtures', () => {
	test.each(END_TO_END_CASES)('$slug: fixtures/$file through eslint --fix', async e2eCase => {
		const { content, diagnostics } = await fixFixture(e2eCase);

		expect(diagnostics).toMatchSnapshot(`${e2eCase.slug}-diagnostics`);
		expect(content).toMatchSnapshot(`${e2eCase.slug}-content`);
	});
});
