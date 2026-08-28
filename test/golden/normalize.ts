import type { TypedFlatConfigItem } from '../../src/types';

/*
 * eslint-plugin-unicorn suggests `localeCompare`, but its ordering varies by
 * ICU version; snapshots must sort identically on every machine and CI image.
 */

const byCodePoint = (a: string, b: string): number => (a < b ? -1 : 1);

/**
 * Normalize a resolved flat config item into a deterministic, serializable
 * shape. Golden snapshots must only observe what a consumer can observe:
 * which configs exist, which files they target, and which rules they set —
 * never object identities, function implementations or absolute paths.
 */
function normalizeConfigItem(item: TypedFlatConfigItem): Record<string, unknown> {
	const normalized: Record<string, unknown> = {};

	if (item.name) {
		normalized['name'] = item.name;
	}

	if (item.files) {
		normalized['files'] = item.files;
	}

	if (item.ignores) {
		normalized['ignores'] = item.ignores;
	}

	if (item.rules) {
		normalized['rules'] = Object.fromEntries(
			Object.entries(item.rules).map(([rule, value]) => [rule, normalizeRuleValue(value)])
		);
	}

	const languageOptions = item.languageOptions as Record<string, unknown> | undefined;
	if (languageOptions) {
		const lo: Record<string, unknown> = {};
		if (languageOptions['ecmaVersion']) {
			lo['ecmaVersion'] = languageOptions['ecmaVersion'];
		}
		if (languageOptions['sourceType']) {
			lo['sourceType'] = languageOptions['sourceType'];
		}
		if (languageOptions['parser']) {
			lo['parser'] = identifyModuleLike(languageOptions['parser']);
		}
		if (languageOptions['parserOptions']) {
			lo['parserOptions'] = normalizeParserOptions(languageOptions['parserOptions'] as Record<string, unknown>);
		}
		if (languageOptions['globals']) {
			lo['globals'] = Object.keys(languageOptions['globals']).toSorted(byCodePoint);
		}
		normalized['languageOptions'] = lo;
	}

	if (item.processor) {
		normalized['processor'] = identifyModuleLike(item.processor);
	}

	if (item.plugins) {
		normalized['plugins'] = Object.fromEntries(
			Object.entries(item.plugins as Record<string, unknown>).map(([name, plugin]) => [
				name,
				identifyPlugin(plugin),
			])
		);
	}

	if (item.linterOptions) {
		normalized['linterOptions'] = item.linterOptions;
	}

	if (item.settings) {
		normalized['settings'] = normalizeDeep(item.settings);
	}

	return normalized;
}

function normalizeRuleValue(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(entry => normalizeDeep(entry));
	}

	return normalizeDeep(value);
}

function normalizeDeep(value: unknown): unknown {
	if (value instanceof RegExp) {
		return { $regexp: value.source };
	}

	if (typeof value === 'function') {
		return { $function: value.name || 'anonymous' };
	}

	if (Array.isArray(value)) {
		return value.map(entry => normalizeDeep(entry));
	}

	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, normalizeDeep(entry)])
		);
	}

	return value;
}

interface ModuleMeta {
	name?: string;
	version?: string;
}

function identifyModuleLike(value: unknown): unknown {
	if (!value || typeof value !== 'object') {
		return normalizeDeep(value);
	}

	const record = value as Record<string, unknown>;
	const meta = record['meta'] as ModuleMeta | undefined;
	if (meta?.name) {
		return { $module: meta.version ? `${meta.name}@${meta.version}` : meta.name };
	}

	const name = record['name'];

	return { $module: typeof name === 'string' && name.length > 0 ? name : 'unknown-module' };
}

function identifyPlugin(plugin: unknown): unknown {
	if (!plugin || typeof plugin !== 'object') {
		return normalizeDeep(plugin);
	}

	const record = plugin as Record<string, unknown>;
	const meta = record['meta'] as ModuleMeta | undefined;

	return {
		$plugin: meta?.name ?? 'unknown',
		...(meta?.version && { version: meta.version }),
		processors: record['processors'] ? Object.keys(record['processors']).toSorted(byCodePoint) : [],
		rules: record['rules'] ? Object.keys(record['rules']).toSorted(byCodePoint) : [],
	};
}

function normalizeParserOptions(parserOptions: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(parserOptions).map(([key, value]) => {
			if (typeof value === 'string' && (key === 'tsconfigRootDir' || key.endsWith('RootDir'))) {
				return [key, { $path: '<cwd-relative>' }];
			}

			if (key === 'parser') {
				return [key, identifyModuleLike(value)];
			}

			return [key, normalizeDeep(value)];
		})
	);
}

export default normalizeConfigItem;
