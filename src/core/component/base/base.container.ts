import { PureComponent } from 'react';
import { LocationState, Path } from 'history';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Store } from 'redux';

import { lazyInject, DI_TYPES } from '../../di';
import { IKeyValue, AnyT } from '../../definition.interface';
import {
  IRoutes,
  ROUTER_NAVIGATE_ACTION_TYPE,
  RouterActionBuilder
} from '../../router';
import { ApplicationStateT } from '../../store';
import { DictionariesActionBuilder } from '../../dictionary';
import { ApplicationPermissionsServiceT } from '../../permissions';
import { NOTIFICATION_INFO_ACTION_TYPE } from '../../notification';
import { IApplicationSettings } from '../../settings';
import { IDateConverter, INumberConverter } from '../../converter';
import { ApplicationTranslatorT } from '../../translation';
import { IFormDialog } from '../form';
import {
  IBaseContainer,
  IBaseContainerInternalProps,
  IBaseContainerInternalState,
} from './base.interface';
import { IUIFactory } from '../factory';

export class BaseContainer<TInternalProps extends IBaseContainerInternalProps,
                           TInternalState extends IBaseContainerInternalState>
    extends PureComponent<TInternalProps, TInternalState>
    implements IBaseContainer<TInternalProps, TInternalState> {

  @lazyInject(DI_TYPES.DateConverter) protected dc: IDateConverter;
  @lazyInject(DI_TYPES.NumberConverter) protected nc: INumberConverter;
  @lazyInject(DI_TYPES.Translate) protected t: ApplicationTranslatorT;
  @lazyInject(DI_TYPES.Store) protected appStore: Store<ApplicationStateT>;
  @lazyInject(DI_TYPES.Permission) protected permissionService: ApplicationPermissionsServiceT;
  @lazyInject(DI_TYPES.Settings) protected settings: IApplicationSettings;
  @lazyInject(DI_TYPES.UIFactory) protected uiFactory: IUIFactory;
  @lazyInject(DI_TYPES.Routes) protected routes: IRoutes;

  constructor(props: TInternalProps, public sectionName = 'section') {
    super(props);
    this.sectionName = props.sectionName || sectionName;

    this.navigateToBack = this.navigateToBack.bind(this);
    this.activateFormDialog = this.activateFormDialog.bind(this);
  }

  public dispatch(type: string, data?: IKeyValue): void {
    this.appStore.dispatch({
      type: `${this.sectionName}.${type}`, data: { section: this.sectionName, ...data },
    });
  }

  public navigate(path: Path, state?: LocationState): void {
    this.appStore.dispatch({type: ROUTER_NAVIGATE_ACTION_TYPE, data: { path, state }});
  }

  public navigateToBack(): void {
    this.appStore.dispatch({ type: RouterActionBuilder.buildNavigateBackActionType() });
  }

  // Dictionary service method (DRY)
  protected dispatchLoadDictionary(dictionary: string, payload?: AnyT): void {
    this.appStore.dispatch({
      type: DictionariesActionBuilder.buildLoadActionType(dictionary),
      data: { section: dictionary, payload },
    });
  }

  // Dictionary service method (DRY)
  protected dispatchClearDictionary(dictionary: string): void {
    this.appStore.dispatch({
      type: DictionariesActionBuilder.buildClearActionType(dictionary),
      data: { section: dictionary },
    });
  }

  // Notification service method (DRY)
  protected dispatchNotification(info: string): void {
    this.appStore.dispatch({
      type: NOTIFICATION_INFO_ACTION_TYPE,
      data: { info },
    });
  }

  // Service method (DRY)
  protected isTransportContainsExecutingOperation(operationId: string): boolean {
    return this.props.transport.queue.includes(operationId);
  }

  // Service method (DRY)
  protected isPermissionAccessible<TApplicationAccessConfig>(checkedObject: TApplicationAccessConfig): boolean {
    return this.permissionService.isAccessible(checkedObject);
  }

  // Service method (DRY)
  protected activateFormDialog(): void {
    (this.refs.formDialog as IFormDialog).activate();
  }
}
