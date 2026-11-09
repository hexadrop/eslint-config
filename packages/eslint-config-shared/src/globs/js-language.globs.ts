import { GLOB_ASTRO } from './astro.globs';
import { SOURCE_GLOBS } from './core.globs';
import { GLOB_JSON } from './json.globs';
import { GLOB_MARKDOWN_ASTRO, GLOB_MARKDOWN_JSON, GLOB_MARKDOWN_SOURCE } from './markdown.globs';

/**
 * Files parsed with ESLint's default `js` language: JS/TS source, Astro, JSON
 * and the code blocks embedded in Markdown.
 *
 * Rule sets that only support the `js` language (core, import-x, Unicorn,
 * Perfectionist, `@stylistic`) are scoped to these globs so they never apply to
 * other languages such as YAML, where ESLint rejects them.
 */
const GLOB_JS_LANGUAGE = [
	...SOURCE_GLOBS,
	...GLOB_ASTRO,
	...GLOB_MARKDOWN_SOURCE,
	...GLOB_MARKDOWN_ASTRO,
	...GLOB_JSON,
	...GLOB_MARKDOWN_JSON,
];

export default GLOB_JS_LANGUAGE;
