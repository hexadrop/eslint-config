import { mkdtempSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, test } from 'bun:test';

import isFastRefreshProject from '../src/react.refresh';

const FIXTURES_DIR = path.join(import.meta.dir, 'fixtures');

function withoutManifest(): string {
	return mkdtempSync(path.join(os.tmpdir(), 'hexadrop-no-manifest-'));
}

describe('fast refresh detection', () => {
	test('is on when the project declares vite', () => {
		expect(isFastRefreshProject(path.join(FIXTURES_DIR, 'vite'))).toBe(true);
	});

	test('is off when vite only reaches the tree through vitest', () => {
		expect(isFastRefreshProject(path.join(FIXTURES_DIR, 'vitest-only'))).toBe(false);
	});

	test('falls back to the installed tree without a manifest', () => {
		const cwd = withoutManifest();

		expect(isFastRefreshProject(cwd, packageName => packageName === 'vite')).toBe(true);
		expect(isFastRefreshProject(cwd, () => false)).toBe(false);
	});
});
