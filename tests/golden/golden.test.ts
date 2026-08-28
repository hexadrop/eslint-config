import path from 'node:path';
import process from 'node:process';

import { describe, expect, test } from 'bun:test';

import hexadrop from '../../src';
import type { TypedFlatConfigItem } from '../../src/types';
import type { MatrixCell } from './matrix';
import { MATRIX } from './matrix';
import normalizeConfigItem from './normalize';

const SNAPSHOTS_DIR = path.join(import.meta.dir, '__snapshots__');

async function resolveGolden(cell: MatrixCell): Promise<unknown> {
	const resolved = await hexadrop(cell.options, ...(cell.extraConfigs ?? []));

	return resolved.map(item => normalizeConfigItem(item as TypedFlatConfigItem));
}

describe('golden resolved config', () => {
	for (const cell of MATRIX) {
		test(`${cell.slug}: ${cell.description}`, async () => {
			const golden = await resolveGolden(cell);
			// eslint-disable-next-line unicorn/no-null -- JSON.stringify requires null for the replacer slot
			const serialized = `${JSON.stringify(golden, null, '\t')}\n`;
			const snapshotPath = path.join(SNAPSHOTS_DIR, `${cell.slug}.snap.json`);
			const snapshotFile = Bun.file(snapshotPath);
			const previous = (await snapshotFile.exists()) ? await snapshotFile.text() : undefined;

			if (process.env['UPDATE_GOLDEN']) {
				await Bun.write(snapshotFile, serialized);
			}

			if (previous === undefined && !process.env['UPDATE_GOLDEN']) {
				throw new Error(
					`Missing golden snapshot for "${cell.slug}". Run \`UPDATE_GOLDEN=1 bun test\` to generate it.`
				);
			}

			/*
			 * Even after regenerating, compare against the pre-write content: an
			 * intentional config change requires committing the regenerated
			 * snapshot, never a silently green run.
			 */
			expect(serialized).toBe(previous ?? serialized);
		});
	}
});
