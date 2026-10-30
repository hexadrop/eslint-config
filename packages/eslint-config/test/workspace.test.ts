import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import defaultOptions from '../src/options/hexadrop-eslint.options';

interface WorkspaceOptions {
	reactInstalled?: boolean;
	rootTsconfig?: boolean;
	typescriptInstalled?: boolean;
}

const previousCwd = process.cwd();

/**
 * Resolve a `node_modules` package from the given directories, mirroring the
 * subset of `local-pkg` the options rely on. Inspecting `paths` keeps the
 * assertions honest: a detection bug that ignores the workspace directories
 * would fail them.
 */
function readInstalledPackage(name: string, paths: string[]): object | undefined {
	for (const directory of paths) {
		const manifest = path.join(directory, 'node_modules', name, 'package.json');

		if (existsSync(manifest)) {
			return JSON.parse(readFileSync(manifest, 'utf8')) as object;
		}
	}

	return undefined;
}

/*
 * Other suites replace `local-pkg` globally, so this file pins its own
 * filesystem-backed view to keep the assertions independent of test order.
 */
beforeEach(() => {
	void mock.module('local-pkg', () => ({
		getPackageInfoSync: (name: string, options?: { paths?: string[] }) =>
			readInstalledPackage(name, options?.paths ?? [previousCwd]),
		isPackageExists: (name: string) => readInstalledPackage(name, [previousCwd]) !== undefined,
	}));
});

afterEach(() => {
	process.chdir(previousCwd);
	mock.restore();
});

/**
 * Install a stub package so `local-pkg` resolves it at config time.
 */
function installPackage(directory: string, name: string, version = '19.0.0'): void {
	const packageDirectory = path.join(directory, 'node_modules', name);

	mkdirSync(packageDirectory, { recursive: true });
	writeFileSync(path.join(packageDirectory, 'package.json'), JSON.stringify({ name, version }));
}

function createWorkspace({
	reactInstalled = false,
	rootTsconfig = false,
	typescriptInstalled = true,
}: WorkspaceOptions = {}): string {
	const root = mkdtempSync(path.join(tmpdir(), 'hexadrop-options-workspace-'));
	const app = path.join(root, 'packages', 'app');

	mkdirSync(app, { recursive: true });
	writeFileSync(path.join(root, 'package.json'), JSON.stringify({ private: true, workspaces: ['packages/*'] }));
	writeFileSync(path.join(app, 'package.json'), JSON.stringify({ name: 'app' }));
	writeFileSync(path.join(app, 'tsconfig.json'), JSON.stringify({ include: ['src'] }));

	if (typescriptInstalled) {
		installPackage(root, 'typescript', '6.0.0');
	}

	if (reactInstalled) {
		installPackage(app, 'react');
	}

	if (rootTsconfig) {
		writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ include: ['scripts'] }));
	}

	return root;
}

/**
 * Run `callback` with the workspace as `process.cwd()`, restoring the previous
 * working directory before deleting the temporary workspace.
 */
function withWorkspace<T>(root: string, callback: () => T): T {
	process.chdir(root);

	try {
		return callback();
	} finally {
		process.chdir(previousCwd);
		rmSync(root, { force: true, recursive: true });
	}
}

describe('workspace option detection', () => {
	test('detects React installed by a workspace package', () => {
		const root = createWorkspace({ reactInstalled: true });

		withWorkspace(root, () => {
			expect(defaultOptions({}).react).toBe(true);
		});
	});

	test('does not enable React when it is not installed', () => {
		const root = createWorkspace();

		withWorkspace(root, () => {
			expect(defaultOptions({}).react).toBe(false);
		});
	});

	test('uses the workspace tsconfigs when the root has none', () => {
		const root = createWorkspace();

		withWorkspace(root, () => {
			expect(defaultOptions({}).typescript).toEqual({ project: ['./packages/app/tsconfig.json'] });
		});
	});

	test('keeps the root tsconfig when it exists', () => {
		const root = createWorkspace({ rootTsconfig: true });

		withWorkspace(root, () => {
			expect(defaultOptions({}).typescript).toEqual({ project: 'tsconfig.json' });
		});
	});

	test('detects TypeScript installed by a workspace package', () => {
		const root = createWorkspace({ typescriptInstalled: false });

		installPackage(path.join(root, 'packages', 'app'), 'typescript', '6.0.0');

		withWorkspace(root, () => {
			expect(defaultOptions({}).typescript).toEqual({ project: ['./packages/app/tsconfig.json'] });
		});
	});

	test('keeps detection when projectService is explicitly disabled', () => {
		const root = createWorkspace();

		withWorkspace(root, () => {
			expect(defaultOptions({ typescript: { parserOptions: { projectService: false } } }).typescript).toEqual({
				parserOptions: { projectService: false },
				project: ['./packages/app/tsconfig.json'],
			});
		});
	});

	test('keeps parent-relative workspace tsconfigs outside the root', () => {
		const root = createWorkspace();
		const sibling = `${root}-sibling`;

		mkdirSync(sibling, { recursive: true });
		writeFileSync(
			path.join(root, 'package.json'),
			JSON.stringify({ workspaces: ['packages/*', `../${path.basename(sibling)}`] })
		);
		writeFileSync(path.join(sibling, 'package.json'), JSON.stringify({ name: 'sibling' }));
		writeFileSync(path.join(sibling, 'tsconfig.json'), JSON.stringify({ include: ['src'] }));

		try {
			withWorkspace(root, () => {
				expect(defaultOptions({}).typescript).toEqual({
					project: ['./packages/app/tsconfig.json', `../${path.basename(sibling)}/tsconfig.json`],
				});
			});
		} finally {
			rmSync(sibling, { force: true, recursive: true });
		}
	});

	test('keeps an explicit project when projectService is also set', () => {
		const root = createWorkspace();

		withWorkspace(root, () => {
			expect(
				defaultOptions({
					typescript: { parserOptions: { projectService: false }, project: './tsconfig.tools.json' },
				}).typescript
			).toEqual({ parserOptions: { projectService: false }, project: './tsconfig.tools.json' });
		});
	});
});
