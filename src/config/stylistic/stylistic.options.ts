interface StylisticOptionsObject {
	/**
	 * Include parentheses around a sole arrow function parameter.
	 *
	 * @default 'avoid'
	 */
	arrowParens?: 'always' | 'avoid';

	/**
	 * Which brace style to use
	 * @default '1tbs'
	 */
	braceStyle?: '1tbs' | 'stroustrup' | 'allman';

	/**
	 * Put the > of a multi-line HTML (HTML, JSX, Vue, Angular) element
	 * at the end of the last line instead of being alone on the next line.
	 *
	 * @default true
	 */
	bracketSameLine?: boolean;

	/**
	 * Use spaces between brackets in object literals.
	 *
	 * @default true
	 */
	bracketSpacing?: boolean;

	/**
	 * End of line character.
	 *
	 * @default 'lf'
	 */
	endOfLine?: 'auto' | 'lf' | 'crlf' | 'cr';

	/**
	 * Format the code using Prettier.
	 *
	 * @default 'prettier'
	 */
	format?: 'prettier' | false;

	/**
	 * Indentation style.
	 *
	 * @default 'tab'
	 */
	indent?: 'tab' | 'space';

	/**
	 * Number of spaces to use for indentation.
	 *
	 * @default 4
	 */
	indentSize?: number;

	/**
	 * Specify the line length that the printer will wrap on.
	 *
	 * @default 120
	 */
	printWidth?: number;
	/**
	 * Change when properties in objects are quoted.
	 *
	 * @default 'as-needed'
	 */
	quoteProps?: 'as-needed' | 'consistent' | 'preserve';
	/**
	 * Quote style.
	 *
	 * @default 'single'
	 */
	quotes?: 'single' | 'double';
	/**
	 * Use semicolons at the end of statements.
	 *
	 * @default true
	 */
	semicolons?: boolean;
	/**
	 * Use single attribute per line in HTML, Vue and JSX.
	 *
	 * @default false
	 */
	singleAttributePerLine?: boolean;
	/**
	 * Use trailing commas in multi-line object literals.
	 *
	 * @default 'es5'
	 */
	trailingComma?: 'none' | 'es5' | 'all';
}

export type StylisticOptions = boolean | StylisticOptionsObject;
