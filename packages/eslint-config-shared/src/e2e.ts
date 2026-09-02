import path from 'node:path';

import type { Linter } from 'eslint';
import { ESLint } from 'eslint';

/*
 * ---------------------------------------------------------------------------
 * Shared types
 * ---------------------------------------------------------------------------
 */

/**
 * Minimal case every e2e suite extends in its own `cases.ts`. Packages that
 * need extra fields (e.g. `options`, `extraConfigs`) add them through
 * intersection.
 */
interface EndToEndCase {
	/**
	 *Dirty fixture file (relative to the e2e/fixtures/ directory).
	 */
	file: string;
	/**
	 *Stable snapshot key, e.g. "clean", "json", "package-json".
	 */
	slug: string;
}

/**
 * Normalised diagnostic snapshot — the subset of an ESLint message that is
 *  pinned in every e2e snapshot.
 */
interface DiagnosticSnapshot {
	column: number;
	line: number;
	message: string;
	ruleId: string | undefined;
	severity: number;
}

/**
 *Result payload returned by {@link fixFixture}.
 */
interface E2EResult {
	content: string;
	diagnostics: DiagnosticSnapshot[];
}

/*
 * ---------------------------------------------------------------------------
 * Shared helpers
 * ---------------------------------------------------------------------------
 */

/**
 * Resolve the absolute path of a fixture file and assert it exists.
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
 * Create a real ESLint instance wired to the given flat-config array with
 * `fix` enabled. The `cwd` is the fixtures directory so relative-path rules
 * are resolved correctly.
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
 * Run the fixture through the real ESLint engine in fix mode and freeze both
 * halves of its behaviour:
 *
 * - `content`: the file content after `eslint --fix`, pinned so formatting
 *   regressions surface as snapshot diffs.
 * - `diagnostics`: the messages that survive autofix, normalised to a stable
 *   shape (`DiagnosticSnapshot`).
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
