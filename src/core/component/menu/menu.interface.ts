import { FunctionT } from '../../util';
import { IBaseComponent, IBaseComponentInternalProps } from '../base';
import { INativeMaterialComponent } from '../material';
import {
  EntityIdT,
  IFilterable,
  ILabelable,
  IRenderable,
  IDisableable,
  IValueWrapper,
  IRawDatable,
  AnyT,
  ITemplateable,
} from '../../definition.interface';

export interface IMenuInternalState {
  filter?: string;
}

export interface IMenuInternalProps extends IBaseComponentInternalProps,
                                            IRenderable<IMenuOption<AnyT>>,
                                            ITemplateable<IMenuOption<AnyT>>,
                                            IFilterable {
  options: Array<IMenuOption<AnyT>>;
  onSelect?(option: IMenuOption<AnyT>): void;
}

export interface INativeMaterialMenuComponent extends INativeMaterialComponent {
  open: boolean;
  show(): FunctionT;
}

export interface IMenu extends IBaseComponent<IMenuInternalProps, IMenuInternalState> {
  opened: boolean;
  show(): void;
  hide(): void;
  activate(index: number);
}

export interface IMenuAction<TValue> extends ILabelable,
                                             IValueWrapper<TValue>,
                                             IDisableable {
}

export type MenuActionT = IMenuAction<AnyT>;

export interface IMenuOption<TRawData> extends IMenuAction<EntityIdT>,
                                               IRawDatable<TRawData> {
}
