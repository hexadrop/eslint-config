import config from '@hexadrop/eslint-config-ignore';
import * as flat from 'eslint-config-flat-gitignore';
import type { HexadropEslintConfigOptions } from '@hexadrop/eslint-config-options';
import { describe, expect, it, mock, spyOn } from 'bun:test';

describe('@hexadrop/eslint-config-ignore', () => {
	describe('config', () => {
		it('should works as expected with false options', async () => {
			const options = { ignore: false };

			expect(await config(options)).toMatchSnapshot();
		});
		it('should works as expected with true options', async () => {
			const options = { ignore: true };

			expect(await config(options)).toMatchSnapshot();
		});
		it('should works as expected with true options and `.gitignore` not exists', async () => {
			mock.module('node:fs', () => {
				return {
					existsSync: () => false,
				};
			});

			const options = { ignore: true };

			expect(await config(options)).toMatchSnapshot();

			mock.restore();
		});
		it('should works as expected with extra globs', async () => {

			const options: HexadropEslintConfigOptions = { ignore: { globs: ['**.js'] } };

			expect(await config(options)).toMatchSnapshot();
		});
		it('should works as expected with extra options', async () => {
			const plugin = spyOn(flat, 'default');
			const options: HexadropEslintConfigOptions = { ignore: { strict: true, root: false } };

			expect(await config(options)).toMatchSnapshot();
			expect(plugin).toHaveBeenCalledWith({ strict: true, root: false });
		});
	});
});
