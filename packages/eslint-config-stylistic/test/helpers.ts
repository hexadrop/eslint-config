import type { StylisticConfigOptions, StylisticFormattingOptions } from '../src/stylistic.options';
import type { TypedFlatConfigItem } from '../src/stylistic.typed-config';

const formatting: StylisticFormattingOptions = {
	arrowParens: 'avoid',
	braceStyle: '1tbs',
	bracketSameLine: true,
	bracketSpacing: true,
	endOfLine: 'lf',
	indent: 'tab',
	indentSize: 4,
	printWidth: 120,
	quoteProps: 'as-needed',
	quotes: 'single',
	semicolons: true,
	singleAttributePerLine: true,
	trailingComma: 'es5',
};

/**
 *Every concern disabled; tests enable only what they exercise.
 */
const baseOptions: StylisticConfigOptions = {
	astro: false,
	format: false,
	isTypeAware: false,
	json: false,
	markdown: false,
	perfectionist: false,
	stylistic: formatting,
	typescript: false,
	unicorn: false,
};

function configOptions(overrides: Partial<StylisticConfigOptions> = {}): StylisticConfigOptions {
	return { ...baseOptions, ...overrides };
}

/**
 *Whether a resolved config item targets any of the given globs.
 */
function hasFiles(item: TypedFlatConfigItem, globs: string[]): boolean {
	if (!item.files) {
		return false;
	}

	const files = Array.isArray(item.files) ? item.files : [item.files];

	return globs.some(glob => files.includes(glob));
}

export { configOptions, formatting, hasFiles };
