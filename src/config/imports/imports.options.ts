interface ImportsOptionsObject {

	/**
	 * Enable stylistic rules.
	 *
	 * @default true
	 */
	stylistic?: boolean;
}

export type ImportsOptions = boolean | ImportsOptionsObject;
