import type { Linter } from 'eslint'
import type { RuleOptions } from '../typegen';

type Rules = RuleOptions;

export type TypedFlatConfigItem = Omit<Linter.FlatConfig, 'plugins'> & {
	/**
	 * Custom name of each config item
	 */
	name?: string

	// Relax plugins type limitation, as most of the plugins did not have correct type info yet.
	/**
	 * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
	 *
	 * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
	 */
	plugins?: Record<string, any>

	/**
	 * An object containing a name-value mapping of rules to use.
	 */
	rules?: Linter.RulesRecord & Rules
}
