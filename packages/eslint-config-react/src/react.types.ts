interface ReactConfigOptions {
	/**
	 * Enable `react-refresh/only-export-components`.
	 *
	 * When omitted, the rule is enabled only when the project declares a
	 * bundler with Fast Refresh, because the rule is about HMR boundaries and
	 * warns on component-library patterns in projects without Fast Refresh.
	 *
	 * `true` forces it on, `false` turns it off, and an object enables it with
	 * extra allowed export names.
	 *
	 * @default undefined (auto-detect a Fast Refresh bundler)
	 */
	refresh?: boolean | ReactRefreshOptions;

	/**
	 * Whether typescript support should be enabled (TSX globs, TS-specific rules).
	 *
	 * When omitted, auto-detected via `@hexadrop/eslint-config-typescript` presence.
	 * Set explicitly to override auto-detection: `false` forces JS-only mode,
	 * `true` forces TS mode — throws an actionable error if the peer is not installed.
	 *
	 * @default undefined (auto-detect)
	 */
	typescript?: boolean;
}

interface ReactRefreshOptions {
	/**
	 * Export names that are allowed next to components without warning.
	 */
	allowExportNames?: string[];
}

export type { ReactConfigOptions, ReactRefreshOptions };
