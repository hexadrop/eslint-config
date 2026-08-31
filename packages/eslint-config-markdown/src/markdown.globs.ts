const GLOB_ASTRO = ['*.astro', '**/*.astro'];
const GLOB_JSON = ['**/*.json', '**/*.json5', '**/*.jsonc'];
const SOURCE_GLOBS = ['**/*.?([cm])[jt]s?(x)'];

const GLOB_MARKDOWN = ['**/*.md'];
const GLOB_MARKDOWN_IN_MARKDOWN = ['**/*.md/*.md'];

const GLOB_MARKDOWN_SOURCE = SOURCE_GLOBS.flatMap(source => GLOB_MARKDOWN.map(markdown => `${markdown}/${source}`));
const GLOB_MARKDOWN_JSON = GLOB_JSON.flatMap(json => GLOB_MARKDOWN.map(markdown => `${markdown}/${json}`));
const GLOB_MARKDOWN_ASTRO = GLOB_ASTRO.flatMap(astro => GLOB_MARKDOWN.map(markdown => `${markdown}/${astro}`));

export { GLOB_MARKDOWN, GLOB_MARKDOWN_ASTRO, GLOB_MARKDOWN_IN_MARKDOWN, GLOB_MARKDOWN_JSON, GLOB_MARKDOWN_SOURCE };
