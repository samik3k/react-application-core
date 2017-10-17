import { IEffectsAction, EffectsService, EffectsAction } from 'redux-effects-promise';

import { provideInSingleton, lazyInject, DI_TYPES } from '../di';
import { APPLICATION_TOKEN_KEY, IStorage } from '../storage';
import { ApplicationStateT, BaseEffects } from '../store';
import { USER_DESTROY_ACTION_TYPE } from '../user';
import { ApplicationPermissionsServiceT, PERMISSION_DESTROY_ACTION_TYPE } from '../permission';
import { ApplicationActionBuilder } from './application-action.builder';

@provideInSingleton(ApplicationEffects)
export class ApplicationEffects extends BaseEffects<{}> {

  @lazyInject(DI_TYPES.TokenStorage) private tokenStorage: IStorage;
  @lazyInject(DI_TYPES.Permission) private permissionService: ApplicationPermissionsServiceT;

  @EffectsService.effects(ApplicationActionBuilder.buildInitActionType())
  public onInit(): IEffectsAction[] {
    const token = this.tokenStorage.get(APPLICATION_TOKEN_KEY);
    const actions: IEffectsAction[] = token
        ? [this.buildTransportUpdateTokenAction({token})]
        : [];
    return actions.concat(ApplicationActionBuilder.buildAfterInitAction());
  }

  @EffectsService.effects(ApplicationActionBuilder.buildLogoutActionType())
  public onLogout(): IEffectsAction[] {
    const actions: IEffectsAction[] = this.permissionService.isAuthorized()
        ? [
          EffectsAction.create(USER_DESTROY_ACTION_TYPE),
          EffectsAction.create(PERMISSION_DESTROY_ACTION_TYPE),
          this.buildApplicationDestroyTokenAction()
        ]
        : [];
    return actions.concat(ApplicationActionBuilder.buildAfterLogoutAction());
  }

  @EffectsService.effects(ApplicationActionBuilder.buildUpdateTokenActionType())
  public onUpdateToken(_: IEffectsAction, state: ApplicationStateT): void {
    this.tokenStorage.set(APPLICATION_TOKEN_KEY, state.transport.token);
  }

  @EffectsService.effects(ApplicationActionBuilder.buildDestroyTokenActionType())
  public onDestroyToken(): void {
    this.tokenStorage.remove(APPLICATION_TOKEN_KEY);
  }
}