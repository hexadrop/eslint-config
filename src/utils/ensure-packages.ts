import { isPackageExists } from 'local-pkg';

export default function ensurePackages(...packages: (string | undefined)[]): void {
	const nonExistingPackages = packages.filter(index => index && !isPackageExists(index));
	if (nonExistingPackages.length === 0) {
		return;
	}

	throw new Error(`The following packages are required but not installed: ${nonExistingPackages.join(', ')}`);
}
