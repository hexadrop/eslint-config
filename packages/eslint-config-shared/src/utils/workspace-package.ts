import process from 'node:process';

import { getPackageInfoSync } from 'local-pkg';

import getWorkspaceDirectories from './workspace';

type WorkspacePackageInfo = NonNullable<ReturnType<typeof getPackageInfoSync>>;

/**
 * Resolve an installed package across the workspace: the root first, then every
 * `package.json#workspaces` or `pnpm-workspace.yaml` package.
 *
 * `local-pkg` looks for `node_modules` in each directory and its ancestors, so
 * both a package hoisted to the repository root and one installed in a child
 * package by an isolated workspace layout are found.
 *
 * `shared` only carries `local-pkg` as an optional peer: packages that never
 * call this helper keep it out of their bundle, so every package that does call
 * it must declare `local-pkg` in `dependencies`. `bun run check:dist` enforces
 * that split against the built bundles.
 */
export default function getWorkspacePackageInfo(
	name: string,
	rootDirectory: string = process.cwd()
): undefined | WorkspacePackageInfo {
	return getPackageInfoSync(name, { paths: getWorkspaceDirectories(rootDirectory) });
}
