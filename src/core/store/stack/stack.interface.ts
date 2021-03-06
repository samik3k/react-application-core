import { ACTION_PREFIX } from '../../definitions.interface';
import { IStackEntity } from '../../entities-definitions.interface';

/* @stable - 15.04.2018 */
export const INITIAL_APPLICATION_STACK_STATE: IStackEntity = {
  stack: [],
  lock: false,
};

/* @stable - 15.04.2018 */
export const STACK_LOCK_ACTION_TYPE = `${ACTION_PREFIX}stack.lock`;
export const STACK_PUSH_ACTION_TYPE = `${ACTION_PREFIX}stack.push`;
export const STACK_POP_ACTION_TYPE = `${ACTION_PREFIX}stack.pop`;
export const STACK_REMOVE_ACTION_TYPE = `${ACTION_PREFIX}stack.remove`;
