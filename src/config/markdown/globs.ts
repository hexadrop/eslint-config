import GLOB_JSON from '../json/globs';
import { GLOB_SRC } from '../typescript';

const GLOB_MARKDOWN = '**/*.md';
const GLOB_MARKDOWN_IN_MARKDOWN = '**/*.md/*.md';
const GLOB_MARKDOWN_CODE = [
`${GLOB_MARKDOWN}/${GLOB_SRC}`,
...GLOB_JSON.map(index => `${GLOB_MARKDOWN}/${index}`),
];

export { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN };
