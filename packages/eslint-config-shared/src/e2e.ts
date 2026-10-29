import path from 'node:path';

import type { Linter } from 'eslint';
import { ESLint } from 'eslint';

/**
 * Minimal case each e2e suite extends with its own fields.
 */
interface EndToEndCase {
	/**
	 * Dirty fixture file, relative to the `e2e/fixtures/` directory.
	 */
	file: string;
	/**
	 * Stable snapshot key, e.g. "clean", "json", "package-json".
	 */
	slug: string;
}

/**
 * The subset of an ESLint message pinned in every e2e snapshot.
 */
interface DiagnosticSnapshot {
	column: number;
	line: number;
	message: string;
	ruleId: string | undefined;
	severity: number;
}

interface E2EResult {
	content: string;
	diagnostics: DiagnosticSnapshot[];
}

/**
 * Resolve a fixture path and assert it exists.
 *
 * @throws {Error} when the fixture file is missing.
 */
async function resolveFixturePath(fixturesDirectory: string, file: string): Promise<string> {
	const inputPath = path.join(fixturesDirectory, file);

	if (!(await Bun.file(inputPath).exists())) {
		throw new Error(`Missing fixture file: ${file}`);
	}

	return inputPath;
}

/**
 * Create a real ESLint instance with `fix` enabled; `cwd` is the fixtures
 * directory so relative-path rules resolve correctly.
 */
function createESLint(cwd: string, overrideConfig: Linter.Config[]): ESLint {
	return new ESLint({
		cwd,
		fix: true,
		overrideConfig,
		overrideConfigFile: true,
	});
}

/**
 * Run the fixture through ESLint in fix mode and return the fixed content plus
 * the diagnostics that survive autofix.
 */
async function fixFixture(eslint: ESLint, inputPath: string): Promise<E2EResult> {
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

export { createESLint, fixFixture, resolveFixturePath };

export type { DiagnosticSnapshot, E2EResult, EndToEndCase };
