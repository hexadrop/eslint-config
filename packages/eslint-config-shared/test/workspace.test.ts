import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, test } from 'bun:test';

import { getWorkspaceDirectories } from '../src';

function createPackage(root: string, directory: string): void {
	const target = path.join(root, directory);

	mkdirSync(target, { recursive: true });
	writeFileSync(path.join(target, 'package.json'), JSON.stringify({ name: directory || 'root', private: true }));
}

function createWorkspace(manifest: object, directories: string[]): string {
	const root = mkdtempSync(path.join(tmpdir(), 'hexadrop-workspace-'));

	writeFileSync(path.join(root, 'package.json'), JSON.stringify(manifest));

	for (const directory of directories) {
		createPackage(root, directory);
	}

	return root;
}

describe('getWorkspaceDirectories', () => {
	test('returns the root and the directories matched by array workspaces', () => {
		const root = createWorkspace({ workspaces: ['packages/*', 'apps/*'] }, [
			'packages/app',
			'packages/lib',
			'apps/web',
		]);

		try {
			expect(getWorkspaceDirectories(root)).toEqual([
				root,
				path.join(root, 'packages', 'app'),
				path.join(root, 'packages', 'lib'),
				path.join(root, 'apps', 'web'),
			]);
		} finally {
			rmSync(root, { force: true, recursive: true });
		}
	});

	test('supports the object form and exact package paths', () => {
		const root = createWorkspace({ workspaces: { packages: ['ha-finassists'] } }, ['ha-finassists']);

		try {
			expect(getWorkspaceDirectories(root)).toEqual([root, path.join(root, 'ha-finassists')]);
		} finally {
			rmSync(root, { force: true, recursive: true });
		}
	});

	test('expands nested patterns', () => {
		const root = createWorkspace({ workspaces: ['apps/*/packages/*'] }, [
			'apps/web/packages/ui',
			'apps/web/packages/utils',
		]);

		try {
			expect(getWorkspaceDirectories(root)).toEqual([
				root,
				path.join(root, 'apps', 'web', 'packages', 'ui'),
				path.join(root, 'apps', 'web', 'packages', 'utils'),
			]);
		} finally {
			rmSync(root, { force: true, recursive: true });
		}
	});

	test('expands globstars and skips dependency and build directories', () => {
		const root = createWorkspace({ workspaces: ['packages/**'] }, [
			'packages/app',
			'packages/app/packages/ui',
			'packages/app/node_modules/ignored',
			'packages/app/dist',
		]);

		try {
			expect(getWorkspaceDirectories(root)).toEqual([
				root,
				path.join(root, 'packages', 'app'),
				path.join(root, 'packages', 'app', 'packages', 'ui'),
			]);
		} finally {
			rmSync(root, { force: true, recursive: true });
		}
	});

	test('removes packages matched by a negated pattern', () => {
		const root = createWorkspace({ workspaces: ['packages/*', '!packages/legacy'] }, [
			'packages/app',
			'packages/legacy',
		]);

		try {
			expect(getWorkspaceDirectories(root)).toEqual([root, path.join(root, 'packages', 'app')]);
		} finally {
			rmSync(root, { force: true, recursive: true });
		}
	});

	test('ignores matched directories without a manifest', () => {
		const root = createWorkspace({ workspaces: ['packages/*', 'fixtures'] }, ['packages/app']);

		try {
			mkdirSync(path.join(root, 'fixtures'), { recursive: true });

			expect(getWorkspaceDirectories(root)).toEqual([root, path.join(root, 'packages', 'app')]);
		} finally {
			rmSync(root, { force: true, recursive: true });
		}
	});

	test('returns only the root when there is no package.json or workspaces', () => {
		const root = mkdtempSync(path.join(tmpdir(), 'hexadrop-workspace-'));

		try {
			expect(getWorkspaceDirectories(root)).toEqual([root]);
			writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'no-workspaces' }));
			expect(getWorkspaceDirectories(root)).toEqual([root]);
		} finally {
			rmSync(root, { force: true, recursive: true });
		}
	});
});
