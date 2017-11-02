import { connect } from 'react-redux';

import { isFn } from '../../util';
import { ApplicationStateT, IApplicationState } from '../../store';
import { BaseContainerT, IBaseContainer } from '../../component/base';
import { IKeyValue } from '../../definition.interface';
import { IContainerWrapperCtor } from '../../component/application';
import { IApplicationDictionariesState } from '../../dictionary';
import { IApplicationPermissionsState } from '../../permission';
import { ConnectorMapperT, IConnectorCtor } from './connector.interface';

export const connectorFactory = <TAppState extends ApplicationStateT>(
    containerCtor: IConnectorCtor<BaseContainerT>,
    mappers: Array<ConnectorMapperT<TAppState, IKeyValue>> = []
): IContainerWrapperCtor => {
  const mapping = (state: TAppState) => mappers.length
      ? (mappers as Array<ConnectorMapperT<TAppState, IKeyValue> | IKeyValue>)
          .reduce((previousValue, currentMapper) => {
            return {
              ...isFn(previousValue)
                  ? (previousValue as ConnectorMapperT<TAppState, IKeyValue>)(state)
                  : previousValue,
              ...(currentMapper as ConnectorMapperT<TAppState, IKeyValue>)(state),
            };
          })
      : {};
  return connect(mapping, {})(containerCtor);
};