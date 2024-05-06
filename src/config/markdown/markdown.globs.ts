import { SOURCE_GLOBS } from '../core';
import { GLOB_JSON } from '../json';

const GLOB_MARKDOWN = ['**/*.md'];
const GLOB_MARKDOWN_IN_MARKDOWN = ['**/*.md/*.md'];

const GLOB_MARKDOWN_SOURCE = [
	...SOURCE_GLOBS.flatMap(source => GLOB_MARKDOWN.map(markdown => `${markdown}/${source}`)),
	...GLOB_JSON.flatMap(json => GLOB_MARKDOWN.map(markdown => `${markdown}/${json}`)),
];

export { GLOB_MARKDOWN, GLOB_MARKDOWN_IN_MARKDOWN, GLOB_MARKDOWN_SOURCE };
