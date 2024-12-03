import { options } from '@hexadrop/eslint-config-ignore';
import { describe, expect, it } from 'bun:test';

describe('@hexadrop/eslint-config-ignore', () => {
	describe('options', () => {
		it('should return true if no options are provided', () => {
			expect(options()).toBe(true);
		});
		it('should return true if undefined provided', () => {
			expect(options(undefined)).toBe(true);
		});
		it('should return true if null provided', () => {
			expect(options(null)).toBe(true);
		});
		it('should remove name from options', () => {
			// @ts-expect-error TS2353: Object literal may only specify known properties, and name does not exist in type
			expect(options({ ignore: { name: 'lorem' } })).toMatchSnapshot();
		});
		it('should works as expected with other options', () => {
			expect(options({ ignore: { strict: true, cwd: './current', root: true } })).toMatchSnapshot();
		});
		it('should globs works as expected', () => {
			// @ts-expect-error TS2322: Type null is not assignable to type string | undefined
			expect(options({ ignore: { globs: [undefined, null, '', 'lorem'] } })).toMatchSnapshot();
		});
		it('should files works as expected with empty string', () => {
			expect(options({ ignore: { files: '' } })).toMatchSnapshot();
		});
		it('should files works as expected with string', () => {
			expect(options({ ignore: { files: './file' } })).toMatchSnapshot();
		});
		it('should files works as expected with string array', () => {
			// @ts-expect-error TS2322: Type null is not assignable to type string | undefined
			expect(options({ ignore: { files: ['./file', '', undefined, null] } })).toMatchSnapshot();
		});
	});
});
