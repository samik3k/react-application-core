import * as R from 'ramda';

import { AnyT, UNDEF } from '../definitions.interface';

/**
 * @stable [05.08.2018]
 * @param {AnyT} v
 * @returns {AnyT}
 */
export const undefEmpty = (v: AnyT): AnyT => R.isNil(v) || R.isEmpty(v) ? UNDEF : v;

/**
 * @stable [05.08.2018]
 * @param {AnyT} v
 * @returns {AnyT}
 */
export const trimmedUndefEmpty = (v: AnyT): AnyT => {
  const result = undefEmpty(v);
  return result === UNDEF ? result : String(result).trim();
};

/**
 * @stable [05.08.2018]
 * @param {AnyT} v1
 * @param {AnyT} v2
 * @returns {AnyT}
 */
export const nvl = (v1: AnyT, v2: AnyT): AnyT => R.isNil(v1) ? v2 : v1;
