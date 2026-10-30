import { mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, test } from 'bun:test';

import isFastRefreshProject from '../src/react.refresh';

const FIXTURES_DIR = path.join(import.meta.dir, 'fixtures');
const FAST_REFRESH_BUNDLERS = ['next', 'vite'];

function projectWith(dependencies: Record<string, string>): string {
	const cwd = mkdtempSync(path.join(os.tmpdir(), 'hexadrop-project-'));
	writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({ dependencies, name: 'app' }));

	return cwd;
}

function projectWithoutManifest(): string {
	return mkdtempSync(path.join(os.tmpdir(), 'hexadrop-no-manifest-'));
}

describe('fast refresh detection', () => {
	test.each(FAST_REFRESH_BUNDLERS)('is on when the project declares %s', bundler => {
		expect(isFastRefreshProject(projectWith({ [bundler]: '1.0.0' }))).toBe(true);
	});

	test('is off when vite only reaches the tree through vitest', () => {
		expect(isFastRefreshProject(path.join(FIXTURES_DIR, 'vitest-only'))).toBe(false);
	});

	test('is off for a project without a bundler', () => {
		expect(isFastRefreshProject(projectWith({ react: '19.0.0' }))).toBe(false);
	});

	test('counts peer dependencies', () => {
		const cwd = mkdtempSync(path.join(os.tmpdir(), 'hexadrop-project-'));
		writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({ peerDependencies: { vite: '7.0.0' } }));

		expect(isFastRefreshProject(cwd)).toBe(true);
	});

	test('falls back to the installed tree without a manifest', () => {
		const cwd = projectWithoutManifest();

		expect(isFastRefreshProject(cwd, packageName => packageName === 'vite')).toBe(true);
		expect(isFastRefreshProject(cwd, () => false)).toBe(false);
	});
});
