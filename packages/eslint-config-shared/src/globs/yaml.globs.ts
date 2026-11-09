import { GLOB_MARKDOWN } from './markdown.globs';

const GLOB_YAML = ['**/*.yml', '**/*.yaml'];
const GLOB_MARKDOWN_YAML = GLOB_YAML.flatMap(yaml => GLOB_MARKDOWN.map(markdown => `${markdown}/${yaml}`));

export { GLOB_MARKDOWN_YAML, GLOB_YAML };
