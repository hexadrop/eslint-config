import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import path from 'node:path';
import process from 'node:process';

/**
 * Fail when a published bundle imports a package its manifest does not declare.
 *
 * `@hexadrop/eslint-config-shared` is bundled into every package, so a shared
 * helper that imports an external package (for example `local-pkg` or `yaml`)
 * only ships where tree-shaking keeps it. This check proves that assumption
 * against the real `dist/` instead of trusting it.
 */
const PACKAGES_DIRECTORY = path.join(import.meta.dir, '..', 'packages');
const DISTRIBUTION_ENTRY = path.join('dist', 'index.mjs');
const STATIC_IMPORT_PATTERN = /^\s*(?:import|export)\s+(?:[^"'`]*?\sfrom\s*)?["'](?<specifier>[^"']+)["']/gmu;
const DYNAMIC_IMPORT_PATTERN = /(?<![\w"'`$])import\(\s*["'](?<specifier>[^"']+)["']\s*\)/gu;
const BUILTIN_MODULES = new Set(builtinModules);

interface PackageManifest {
	dependencies?: Record<string, string>;
	name?: string;
	optionalDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	private?: boolean;
}

function toPackageName(specifier: string): string | undefined {
	if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('node:')) {
		return undefined;
	}

	if (BUILTIN_MODULES.has(specifier)) {
		return undefined;
	}

	const [scope, name] = specifier.split('/', 2);

	if (specifier.startsWith('@')) {
		return scope && name ? `${scope}/${name}` : undefined;
	}

	return scope;
}

function collectImports(source: string): Set<string> {
	const imports = new Set<string>();

	for (const pattern of [STATIC_IMPORT_PATTERN, DYNAMIC_IMPORT_PATTERN]) {
		for (const match of source.matchAll(pattern)) {
			const specifier = match.groups?.['specifier'];
			const name = specifier ? toPackageName(specifier) : undefined;

			if (name) {
				imports.add(name);
			}
		}
	}

	return imports;
}

function declaredDependencies(manifest: PackageManifest): Set<string> {
	return new Set([
		...Object.keys(manifest.dependencies ?? {}),
		...Object.keys(manifest.optionalDependencies ?? {}),
		...Object.keys(manifest.peerDependencies ?? {}),
	]);
}

function checkPackage(directory: string): string[] {
	const manifest = JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8')) as PackageManifest;

	if (manifest.private === true) {
		return [];
	}

	const label = manifest.name ?? path.basename(directory);
	const distributionEntry = path.join(directory, DISTRIBUTION_ENTRY);

	if (!existsSync(distributionEntry)) {
		throw new Error(`${label}: missing ${DISTRIBUTION_ENTRY}. Run \`bun run build\` first.`);
	}

	const declared = declaredDependencies(manifest);

	return [...collectImports(readFileSync(distributionEntry, 'utf8'))]
		.filter(name => !declared.has(name))
		.map(name => `${label}: imports "${name}" but does not declare it in package.json`);
}

function main(): void {
	const problems = readdirSync(PACKAGES_DIRECTORY, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.toSorted((first, second) => first.name.localeCompare(second.name))
		.flatMap(entry => checkPackage(path.join(PACKAGES_DIRECTORY, entry.name)));

	if (problems.length === 0) {
		process.stdout.write('Published bundles only import declared packages.\n');

		return;
	}

	for (const problem of problems) {
		process.stderr.write(`${problem}\n`);
	}

	process.exitCode = 1;
}

main();
