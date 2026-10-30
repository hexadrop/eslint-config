import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { isPackageExists } from 'local-pkg';

/**
 * Packages that ship React Fast Refresh on by default. `react-refresh/only-export-components`
 * only makes sense for projects that re-render components in place: elsewhere
 * it warns on the component-plus-variant pattern of component libraries.
 *
 * Parcel is left out on purpose: its React Fast Refresh is still opt-in.
 */
const FAST_REFRESH_PACKAGES = ['next', 'vite'];

/**
 * The manifest fields that make a package the project's own dependency.
 */
interface PackageManifest {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
}

/**
 * Read the consumer manifest from `cwd`.
 *
 * `undefined` when there is no readable `package.json`, which means the config
 * is built programmatically and detection falls back to the installed tree.
 */
function readManifest(cwd: string): PackageManifest | undefined {
	try {
		return JSON.parse(readFileSync(path.join(cwd, 'package.json'), 'utf8')) as PackageManifest;
	} catch {
		return undefined;
	}
}

function declaredPackages(manifest: PackageManifest): Set<string> {
	return new Set([
		...Object.keys(manifest.dependencies ?? {}),
		...Object.keys(manifest.devDependencies ?? {}),
		...Object.keys(manifest.peerDependencies ?? {}),
	]);
}

/**
 * Whether the project uses a bundler with Fast Refresh.
 *
 * Only declared dependencies count: `node_modules` also holds transitive
 * packages, so an installed `vitest` would otherwise pass for a Vite app and
 * bring the rule back to projects that do not use Fast Refresh. Without a
 * manifest there is nothing to read, so the installed tree decides.
 */
export default function isFastRefreshProject(
	cwd: string = process.cwd(),
	isInstalled: (packageName: string) => boolean = isPackageExists
): boolean {
	const manifest = readManifest(cwd);
	const declared = manifest && declaredPackages(manifest);

	return FAST_REFRESH_PACKAGES.some(packageName => (declared ? declared.has(packageName) : isInstalled(packageName)));
}
