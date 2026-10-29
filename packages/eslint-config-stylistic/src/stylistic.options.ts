import type { RecursivePartial } from '@hexadrop/eslint-config-shared';

interface StylisticFactoryOptions {
	/**
	 * Whether astro support is enabled. When omitted, it is auto-detected from
	 * the presence of `@hexadrop/eslint-config-astro`.
	 *
	 * @default auto-detected
	 */
	astro?: boolean;

	/**
	 * Enable the Prettier formatting rules.
	 *
	 * @default true
	 */
	format?: boolean;

	/**
	 * Whether type-aware linting is enabled (requires a tsconfig path).
	 *
	 * @default false
	 */
	isTypeAware?: boolean;

	/**
	 * Whether json support is enabled. When omitted, it is auto-detected from
	 * the presence of `@hexadrop/eslint-config-json`.
	 *
	 * @default auto-detected
	 */
	json?: boolean;

	/**
	 * Whether markdown support is enabled.
	 *
	 * @default false
	 */
	markdown?: boolean;

	/**
	 * Enable the perfectionist rules.
	 *
	 * @default true
	 */
	perfectionist?: boolean;

	/**
	 * Stylistic formatting sub-options. When `false`, the entire stylistic
	 * module is disabled.
	 *
	 * @default a full set of defaults
	 */
	stylistic?: false | RecursivePartial<StylisticFormattingOptions>;

	/**
	 * Whether typescript support is enabled. When omitted, it is auto-detected
	 * from the presence of `@hexadrop/eslint-config-typescript`.
	 *
	 * @default auto-detected
	 */
	typescript?: boolean;

	/**
	 * Enable the unicorn rules.
	 *
	 * @default true
	 */
	unicorn?: boolean;
}

interface StylisticFormattingOptions {
	/**
	 * Include parentheses around a sole arrow function parameter.
	 *
	 * @default 'avoid'
	 */
	arrowParens: 'always' | 'avoid';

	/**
	 * Which brace style to use
	 *
	 * @default '1tbs'
	 */
	braceStyle: '1tbs' | 'allman' | 'stroustrup';

	/**
	 * Put the > of a multi-line HTML (HTML, JSX, Vue, Angular) element
	 * at the end of the last line instead of being alone on the next line.
	 *
	 * @default true
	 */
	bracketSameLine: boolean;

	/**
	 * Use spaces between brackets in object literals.
	 *
	 * @default true
	 */
	bracketSpacing: boolean;

	/**
	 * End of line character.
	 *
	 * @default 'lf'
	 */
	endOfLine: 'auto' | 'cr' | 'crlf' | 'lf';

	/**
	 * Indentation style.
	 *
	 * @default 'tab'
	 */
	indent: 'space' | 'tab';

	/**
	 * Number of spaces to use for indentation.
	 *
	 * @default 4
	 */
	indentSize: number;

	/**
	 * Specify the line length that the printer will wrap on.
	 *
	 * @default 120
	 */
	printWidth: number;

	/**
	 * Change when properties in objects are quoted.
	 *
	 * @default 'as-needed'
	 */
	quoteProps: 'as-needed' | 'consistent' | 'preserve';

	/**
	 * Quote style.
	 *
	 * @default 'single'
	 */
	quotes: 'double' | 'single';

	/**
	 * Use semicolons at the end of statements.
	 *
	 * @default true
	 */
	semicolons: boolean;

	/**
	 * Use single attribute per line in HTML, Vue and JSX.
	 *
	 * @default true
	 */
	singleAttributePerLine: boolean;

	/**
	 * Use trailing commas in multi-line object literals.
	 *
	 * @default 'es5'
	 */
	trailingComma: 'all' | 'es5' | 'none';
}

interface ResolvedStylisticFactoryOptions {
	astro: boolean;
	format: boolean;
	isTypeAware: boolean;
	json: boolean;
	markdown: boolean;
	perfectionist: boolean;
	stylistic: false | StylisticFormattingOptions;
	typescript: boolean;
	unicorn: boolean;
}

interface StylisticConfigOptions {
	astro: boolean;
	format: boolean;
	isTypeAware?: boolean;
	json: boolean;
	markdown: boolean;
	perfectionist: boolean;
	stylistic: StylisticFormattingOptions;
	typescript: boolean;
	unicorn: boolean;
}

export type {
	ResolvedStylisticFactoryOptions,
	StylisticConfigOptions,
	StylisticFactoryOptions,
	StylisticFormattingOptions,
};
