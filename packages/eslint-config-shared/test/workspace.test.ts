import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, test } from 'bun:test';

import { getWorkspaceDirectories } from '../src';

function createWorkspace(manifest: object, directories: string[]): string {
	const root = mkdtempSync(path.join(tmpdir(), 'hexadrop-workspace-'));
	writeFileSync(path.join(root, 'package.json'), JSON.stringify(manifest));

	for (const directory of directories) {
		mkdirSync(path.join(root, directory), { recursive: true });
	}

	return root;
}

describe('getWorkspaceDirectories', () => {
	test('returns the root and the directories matched by array workspaces', () => {
		const root = createWorkspace({ workspaces: ['packages/*', 'apps/*'] }, [
			'packages/app',
			'packages/lib',
			'apps/web',
			'node_modules/ignored',
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
