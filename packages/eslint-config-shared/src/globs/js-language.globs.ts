import { GLOB_ASTRO } from './astro.globs';
import { SOURCE_GLOBS } from './core.globs';
import { GLOB_JSON } from './json.globs';
import { GLOB_MARKDOWN } from './markdown.globs';

/**
 * Files that receive the rule sets which only support ESLint's default `js`
 * language: JS/TS source, Astro, JSON and Markdown.
 *
 * The source, Astro and JSON globs also match the virtual
 * `<file>.md/<index>.<ext>` files emitted by the Markdown processor, so the
 * embedded code blocks are covered without extra globs. Markdown files
 * themselves are included because core text rules such as
 * `no-irregular-whitespace` and `unicode-bom` have always applied to them.
 *
 * Scoping these rule sets keeps them out of other languages such as YAML,
 * where ESLint rejects rules that declare `meta.languages: ['js/js']`.
 */
const GLOB_JS_LANGUAGE = [...SOURCE_GLOBS, ...GLOB_ASTRO, ...GLOB_JSON, ...GLOB_MARKDOWN];

export default GLOB_JS_LANGUAGE;
