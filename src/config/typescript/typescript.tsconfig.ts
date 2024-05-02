import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export default function getCwdTsconfigPath(): undefined | string {
	const cwd = process.cwd();
	const cwdTsconfigPath = resolve(cwd, 'tsconfig.json');
	if (existsSync(cwdTsconfigPath)) {
		return 'tsconfig.json';
	}

	return undefined;
}
