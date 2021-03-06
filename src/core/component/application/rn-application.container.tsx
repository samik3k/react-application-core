import * as React from 'react';
import {
  Scene,
  Router,
  Reducer,
  Stack,
  Lightbox,
} from 'react-native-router-flux';

import { isFn } from '../../util';
import { IApplicationContainerProps } from './application.interface';
import {
  IDefaultConnectorConfiguration,
  IRouteConfiguration,
} from '../../configurations-definitions.interface';
import { IContainerClassEntity } from '../../entities-definitions.interface';
import { UniversalApplicationContainer } from './universal-application.container';
import { IRnApplicationContainerProps } from './rn-application.interface';
import { RnMessage } from '../message/rn-message.component';

export const reducerCreate = (params) => {
  const defaultReducer = new Reducer(params);
  return (state, action) => defaultReducer(state, action);
};

export class RnApplicationContainer extends UniversalApplicationContainer<IRnApplicationContainerProps> {

  public static defaultProps: IApplicationContainerProps = {
    hideNavBar: true,
  };

  public render(): JSX.Element {
    const props = this.props;
    if (this.isMessageVisible()) {
      return (
        <RnMessage error={props.error}
                   progress={props.progress}
                   errorMessage={this.getErrorMessage()}
                   emptyMessage={this.settings.messages.appNotReadyMessage}
        />
      );
    }

    return (
      <Router
        createReducer={reducerCreate}>
        <Lightbox key='lightbox'>
          <Stack hideNavBar={props.hideNavBar}
                 key='root'>
            {this.getRoutes((routeConfiguration) => !routeConfiguration.modal)}
          </Stack>
          {this.getRoutes((routeConfiguration) => routeConfiguration.modal === true)}
        </Lightbox>
      </Router>
    );
  }

  protected buildRoute(ctor: IContainerClassEntity,
                       connectorConfiguration: IDefaultConnectorConfiguration,
                       cfg: IRouteConfiguration): JSX.Element {
    return (
      <Scene
        component={ctor}
        key={cfg.key || cfg.path}
        path={cfg.path}
        title={cfg.title}
        initial={isFn(cfg.initial)
          ? (cfg.initial as (isAuthorizedFn, store) => boolean)(
              () => this.auth.isAuthorized(),
              this.appStore
            )
          : !!cfg.initial}
        onEnter={cfg.onEnter}
      />
    );
  }
}
