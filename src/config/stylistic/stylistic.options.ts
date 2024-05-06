interface StylisticOptionsObject {
	/**
	 * Include parentheses around a sole arrow function parameter.
	 *
	 * @default 'avoid'
	 */
	arrowParens?: 'always' | 'avoid';

	/**
	 * Which brace style to use
	 *
	 * @default '1tbs'
	 */
	braceStyle?: '1tbs' | 'allman' | 'stroustrup';

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
	endOfLine?: 'auto' | 'cr' | 'crlf' | 'lf';

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
	indent?: 'space' | 'tab';

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
	quotes?: 'double' | 'single';
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
	 * Sort props.
	 *
	 * @default true
	 */
	sort?: boolean;
	/**
	 * Use trailing commas in multi-line object literals.
	 *
	 * @default 'es5'
	 */
	trailingComma?: 'all' | 'es5' | 'none';
}

export type StylisticOptions = StylisticOptionsObject | boolean;
