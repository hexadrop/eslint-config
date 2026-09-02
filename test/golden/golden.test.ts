import { describe, expect, test } from 'bun:test';

import hexadrop from '../../src';
import type { TypedFlatConfigItem } from '../../src/types';
import type { MatrixCell } from './matrix';
import { MATRIX } from './matrix';
import normalizeConfigItem from './normalize';

async function resolveGolden(cell: MatrixCell): Promise<unknown> {
	const resolved = await hexadrop(cell.options, ...(cell.extraConfigs ?? []));

	return resolved.map(item => normalizeConfigItem(item as TypedFlatConfigItem));
}

describe('golden resolved config', () => {
	test.each(MATRIX)('$slug: $description', async cell => {
		const golden = await resolveGolden(cell);

		expect(golden).toMatchSnapshot(cell.slug);
	});
});
