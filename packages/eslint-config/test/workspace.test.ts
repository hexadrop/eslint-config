import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import defaultOptions from '../src/options/hexadrop-eslint.options';

function mockPackages({ reactListed = true }: { reactListed?: boolean } = {}) {
	void mock.module('local-pkg', () => ({
		getPackageInfoSync: () => ({}),
		isPackageExists: (name: string) => name === 'typescript',
		isPackageListedSync: (name: string) => name === 'react' && reactListed,
	}));
}

function createWorkspace({ rootTsconfig = false }: { rootTsconfig?: boolean } = {}): string {
	const root = mkdtempSync(path.join(tmpdir(), 'hexadrop-options-workspace-'));
	const app = path.join(root, 'packages', 'app');
	mkdirSync(app, { recursive: true });
	writeFileSync(path.join(root, 'package.json'), JSON.stringify({ private: true, workspaces: ['packages/*'] }));
	writeFileSync(path.join(app, 'package.json'), JSON.stringify({ dependencies: { react: '^19.0.0' }, name: 'app' }));
	writeFileSync(path.join(app, 'tsconfig.json'), JSON.stringify({ include: ['src'] }));

	if (rootTsconfig) {
		writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ include: ['scripts'] }));
	}

	return root;
}

const previousCwd = process.cwd();

beforeEach(() => {
	mockPackages();
});

afterEach(() => {
	process.chdir(previousCwd);
	mock.restore();
});

describe('workspace option detection', () => {
	test('detects React declared by a workspace package', () => {
		const root = createWorkspace();

		try {
			process.chdir(root);

			expect(defaultOptions({}).react).toBe(true);
		} finally {
			process.chdir(previousCwd);
			rmSync(root, { force: true, recursive: true });
		}
	});

	test('uses the workspace tsconfigs when the root has none', () => {
		const root = createWorkspace();

		try {
			process.chdir(root);

			expect(defaultOptions({}).typescript).toEqual({ project: ['./packages/app/tsconfig.json'] });
		} finally {
			process.chdir(previousCwd);
			rmSync(root, { force: true, recursive: true });
		}
	});

	test('keeps the root tsconfig when it exists', () => {
		const root = createWorkspace({ rootTsconfig: true });

		try {
			process.chdir(root);

			expect(defaultOptions({}).typescript).toEqual({ project: 'tsconfig.json' });
		} finally {
			process.chdir(previousCwd);
			rmSync(root, { force: true, recursive: true });
		}
	});

	test('does not enable React when no workspace declares it', () => {
		const root = createWorkspace();

		try {
			process.chdir(root);
			mockPackages({ reactListed: false });

			expect(defaultOptions({}).react).toBe(false);
		} finally {
			process.chdir(previousCwd);
			rmSync(root, { force: true, recursive: true });
		}
	});
});
