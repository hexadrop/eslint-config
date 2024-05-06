import { existsSync } from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';

export default function getCwdTsconfigPath(): string | undefined {
	const root = cwd();
	const cwdTsconfigPath = path.resolve(root, 'tsconfig.json');
	if (existsSync(cwdTsconfigPath)) {
		return 'tsconfig.json';
	}

	return undefined;
}
