import { SOURCE_GLOBS } from '../core/core.globs';
import { GLOB_JSON } from '../json';

const GLOB_MARKDOWN = ['**/*.md'];
const GLOB_MARKDOWN_IN_MARKDOWN = ['**/*.md/*.md'];

const GLOB_MARKDOWN_SOURCE = SOURCE_GLOBS.flatMap(source => GLOB_MARKDOWN.map(markdown => `${markdown}/${source}`));
const GLOB_MARKDOWN_JSON = GLOB_JSON.flatMap(json => GLOB_MARKDOWN.map(markdown => `${markdown}/${json}`));

const GLOB_MARKDOWN_SOURCE_WITH_JSON = [...GLOB_MARKDOWN_SOURCE, ...GLOB_MARKDOWN_JSON];

export {
	GLOB_MARKDOWN,
	GLOB_MARKDOWN_IN_MARKDOWN,
	GLOB_MARKDOWN_JSON,
	GLOB_MARKDOWN_SOURCE,
	GLOB_MARKDOWN_SOURCE_WITH_JSON,
};
