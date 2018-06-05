import * as React from 'react';
import * as R from 'ramda';
import { LoggerFactory, ILogger } from 'ts-smart-logger';

import { toClassName } from '../../../util';
import { BasicTextField } from '../../field/textfield';
import { Menu, IMenu } from '../../menu';
import {
  AnyT,
  IBasicEvent,
  EntityIdT,
  IKeyboardEvent,
} from '../../../definitions.interface';
import { ISelectOptionEntity } from '../../../entities-definitions.interface';
import {
  IBasicSelectProps,
  IBasicSelectState,
} from './basic-select.interface';
import { IFieldActionConfiguration } from '../../../configurations-definitions.interface';

export class BasicSelect<TComponent extends BasicSelect<TComponent, TProps, TState>,
                         TProps extends IBasicSelectProps,
                         TState extends IBasicSelectState>
    extends BasicTextField<TComponent, TProps, TState> {

  protected static logger = LoggerFactory.makeLogger(BasicSelect);

  constructor(props: TProps) {
    super(props);
    this.onSelect = this.onSelect.bind(this);

    if (!this.isPartiallyDisabled()) {
      this.defaultActions = R.insert<IFieldActionConfiguration>(0,
        {
          type: 'arrow_drop_down',
          onClick: (event: IBasicEvent) => {
            this.setFocus();
            this.openMenu(event);
          },
        },
        this.defaultActions
      );
    }
  }

  public componentWillReceiveProps(nextProps: Readonly<TProps>, nextContext: AnyT): void {
    super.componentWillReceiveProps(nextProps, nextContext);

    const props = this.props;
    if (!R.isNil(nextProps.options)
        && !R.equals(props.options, nextProps.options)) {
      this.setState({ emptyOptions: false });

      if (this.hasInputFocus()) {
        this.showMenu(nextProps.options);

        if (props.onLoadDictionary) {
          props.onLoadDictionary(this.toFilteredOptions(nextProps.options));
        }
      }
    }
  }

  public onKeyDown(event: IKeyboardEvent): void {
    super.onKeyDown(event);
    this.stopEvent(event);
  }

  public onKeyBackspace(event: IKeyboardEvent): void {
    super.onKeyBackspace(event);
    this.clearValue();
  }

  public onKeyEnter(event: IKeyboardEvent): void {
    super.onKeyEnter(event);
    this.openMenu(event);
  }

  public onKeyEscape(event: IKeyboardEvent): void {
    super.onKeyEscape(event);

    if (this.menu.isOpen()) {
      this.hideMenu();
    }
  }

  public get progress(): boolean {
    return this.state.emptyOptions;
  }

  protected onClick(event: IBasicEvent): void {
    super.onClick(event);

    if (!this.isPartiallyDisabled()) {
      this.openMenu(event);
    }
  }

  /**
   * @stable [01.06.2018]
   * @returns {JSX.Element}
   */
  protected getInputElementAttachment(): JSX.Element {
    const props = this.props;
    return (
        <Menu ref='menu'
              options={this.toFilteredOptions()}
              onSelect={this.onSelect}
              {...props.menuConfiguration}/>
    );
  }

  protected getInputElementWrapperClassName(): string {
    return toClassName(
        super.getInputElementWrapperClassName(),
        'rac-flex-column'  // inner popup menu - width 100%
    );
  }

  /**
   * @stable [01.06.2018]
   * @param {ISelectOptionEntity[]} options
   * @returns {ISelectOptionEntity[]}
   */
  protected toFilteredOptions(options: ISelectOptionEntity[] = this.options): ISelectOptionEntity[] {
    return options;
  }

  protected getEmptyValue(): AnyT {
    return this.settings.entityEmptyId;
  }

  protected get options(): ISelectOptionEntity[] {
    return this.props.options || [];
  }

  protected onSelect(option: ISelectOptionEntity): void {
    this.onChangeManually(option.value);

    if (this.props.onSelect) {
      this.props.onSelect(option);
    }
  }

  protected toDisplayValue(value: AnyT): EntityIdT {
    const selectedItem = this.getSelectedOption(value);
    return selectedItem
        ? (selectedItem.label ? this.t(selectedItem.label) : selectedItem.value)
        : super.toDisplayValue(value);
  }

  private getSelectedOption(value: AnyT): ISelectOptionEntity {
    return R.find<ISelectOptionEntity>((option) => option.value === value, this.options);
  }

  private get menu(): IMenu {
    return this.refs.menu as IMenu;
  }

  private openMenu(event: IBasicEvent): void {
    if (this.menu.isOpen()) {
      return;
    }
    this.stopEvent(event);

    const props = this.props;
    const noAvailableOptions = R.isNil(props.options);

    if (props.forceAll || noAvailableOptions) {
      if (props.onEmptyDictionary) {
        this.setState({ emptyOptions: true });
        props.onEmptyDictionary();
      } else if (!noAvailableOptions) {
        this.showMenu();
      }
    } else {
      this.showMenu();
    }
  }

  private showMenu(options?: ISelectOptionEntity[]): void {
    const filteredOptions = this.toFilteredOptions(options);
    if (filteredOptions.length) {
      this.input.blur();  // https://github.com/material-components/material-components-web/issues/1977
      this.menu.show();
    } else {
      BasicSelect.logger.debug('[$BasicSelect][showMenu] The options are empty. The menu does not show.');
    }
  }

  private hideMenu(): void {
    this.menu.hide();
  }
}
