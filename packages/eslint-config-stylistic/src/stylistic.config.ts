import astroAdapter, { astroMarkdownAdapter } from './adapters/astro';
import baseAdapter from './adapters/base';
import formatAdapter from './adapters/format';
import jsonAdapter, { jsonMarkdownAdapter } from './adapters/json';
import perfectionistAdapter from './adapters/perfectionist';
import typescriptAdapter from './adapters/typescript';
import unicornAdapter from './adapters/unicorn';
import type { StylisticConfigOptions } from './stylistic.options';
import type { TypedFlatConfigItem } from './stylistic.typed-config';

/**
 * Compose the stylistic slice from one adapter per concern.
 *
 * The order below is part of the public behavior: the golden snapshots of the
 * meta-package freeze the resolved config array, so adapters that contribute
 * early and late config items (json and astro markdown overrides) are called in
 * the historical position.
 */
export default async function stylisticConfig(options: StylisticConfigOptions): Promise<TypedFlatConfigItem[]> {
	const { astro, format, json, perfectionist, typescript, unicorn } = options;

	const config = await baseAdapter(options);

	if (typescript) {
		config.push(...(await typescriptAdapter(options)));
	}

	if (json) {
		config.push(...(await jsonAdapter(options)));
	}

	if (astro) {
		config.push(...astroAdapter());
	}

	if (unicorn) {
		config.push(...(await unicornAdapter(options)));
	}

	if (perfectionist) {
		config.push(...(await perfectionistAdapter()));
	}

	if (format) {
		config.push(...formatAdapter(options));
	}

	if (json) {
		config.push(...jsonMarkdownAdapter());
	}

	if (astro) {
		config.push(...astroMarkdownAdapter());
	}

	return config;
}
