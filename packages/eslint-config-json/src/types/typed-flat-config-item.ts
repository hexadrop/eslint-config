import type { TypedFlatConfigItem as TypedFlatConfigItemShared } from '@hexadrop/eslint-config-shared';

import type { RuleOptions } from '../typegen';

/**
 * Flat config item typed against this package's generated rule options.
 */
export type TypedFlatConfigItem = TypedFlatConfigItemShared<RuleOptions>;
