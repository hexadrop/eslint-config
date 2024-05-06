import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

export default function getCwdTsconfigPath(): string | undefined {
	const root = cwd();
	const cwdTsconfigPath = resolve(root, 'tsconfig.json');
	if (existsSync(cwdTsconfigPath)) {
		return 'tsconfig.json';
	}

	return undefined;
}
