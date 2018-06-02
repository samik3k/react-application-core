import * as R from 'ramda';

import { IEntity, EntityIdT, UNDEF } from '../../../definitions.interface';
import { orUndef, isPrimitive, orDefault, isDef } from '../../../util';
import {
  IMultiEntity,
  MultiFieldEntityT,
  MultiFieldValueT,
  NotMultiFieldEntityT,
  IMultiItemEntity,
} from './multifield.interface';

export function toActualEntities(entity: MultiFieldEntityT): IMultiItemEntity[] {
  if (!entity) {
    return UNDEF;
  }
  const multiEntity = entity as IMultiEntity;
  if (!isNotMultiEntity(entity)) {
    const editedItems = {};
    multiEntity.edit.forEach((editedItem) => {
      const editedItemId = editedItem.id;
      const editedItem0 = editedItems[editedItemId] || {
        ...multiEntity.source.find((originalEntity) => originalEntity.id === editedItemId),
      };
      editedItem0[editedItem.name] = editedItem.value;
      editedItems[editedItemId] = editedItem0;
    });
    const sourceItems = multiEntity.source || [];

    return R.sort<IMultiItemEntity>(
      (item1, item2) => sourceItems.findIndex((i) => i.id === item1.id) > sourceItems.findIndex((i) => i.id === item2.id) ? 1 : -1,
      multiEntity.add.concat(
        sourceItems.filter(
          (entity0) =>
            !multiEntity.remove.find((removeId) => removeId.id === entity0.id)
            && !multiEntity.edit.find((editedId) => editedId.id === entity0.id)
        ).concat(Object.keys(editedItems).map((editedItemId) => editedItems[editedItemId]))
      )
    );
  }
  return entity as IEntity[];
}

export function toEntityIds(multiFieldValue: MultiFieldEntityT): EntityIdT[] {
  const result = toActualEntities(multiFieldValue);
  return orUndef<EntityIdT[]>(result, () => result.map<EntityIdT>((entity) => entity.id));
}

export function toActualEntitiesLength(value: MultiFieldValueT): number {
  return orDefault<number, number>(
    isDef(value),
    () => (
      (isNotMultiEntity(value)
        ? normalizeEntities(value as NotMultiFieldEntityT)
        : toActualEntities(value as IMultiEntity)).length
    ),
    0
  );
}

export const normalizeEntities = (value: NotMultiFieldEntityT): IMultiItemEntity[] =>
  isPrimitive(value) ? [{id: value as EntityIdT}] : value as IMultiItemEntity[];

export function isNotMultiEntity(value: MultiFieldValueT): boolean {
  return Array.isArray(value) || isPrimitive(value);
}