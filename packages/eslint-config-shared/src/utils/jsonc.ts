/**
 * Index of the next character that is neither whitespace nor part of a
 * comment, or -1 at the end of the source.
 */
function nextSignificantIndex(source: string, from: number): number {
	let index = from;

	while (index < source.length) {
		const character = source.charAt(index);

		if (/\s/u.test(character)) {
			index += 1;
			continue;
		}

		if (character === '/' && source.charAt(index + 1) === '/') {
			const newline = source.indexOf('\n', index);

			if (newline === -1) {
				return -1;
			}

			index = newline + 1;
			continue;
		}

		if (character === '/' && source.charAt(index + 1) === '*') {
			const end = source.indexOf('*/', index + 2);

			if (end === -1) {
				return -1;
			}

			index = end + 2;
			continue;
		}

		return index;
	}

	return -1;
}

/**
 * Remove JSONC comments and trailing commas so a regular `JSON.parse` can read
 * the result. The scanner tracks string literals, so URLs such as `https://` in
 * string values are not mistaken for comments and commas inside strings are
 * never dropped.
 */
export default function stripJsonc(source: string): string {
	let result = '';
	let isEscaped = false;
	let isInBlockComment = false;
	let isInLineComment = false;
	let isInString = false;

	for (let index = 0; index < source.length; index++) {
		const character = source.charAt(index);

		if (isInLineComment) {
			if (character === '\n') {
				isInLineComment = false;
				result += character;
			}

			continue;
		}

		if (isInBlockComment) {
			if (character === '*' && source.charAt(index + 1) === '/') {
				isInBlockComment = false;
				index++;
			}

			continue;
		}

		if (isInString) {
			result += character;

			if (isEscaped) {
				isEscaped = false;
			} else if (character === '\\') {
				isEscaped = true;
			} else if (character === '"') {
				isInString = false;
			}

			continue;
		}

		if (character === '"') {
			isInString = true;
			result += character;
			continue;
		}

		if (character === '/' && source.charAt(index + 1) === '/') {
			isInLineComment = true;
			index++;
			continue;
		}

		if (character === '/' && source.charAt(index + 1) === '*') {
			isInBlockComment = true;
			index++;
			continue;
		}

		if (character === ',') {
			const next = nextSignificantIndex(source, index + 1);

			if (next === -1 || source.charAt(next) === '}' || source.charAt(next) === ']') {
				continue;
			}
		}

		result += character;
	}

	return result;
}
