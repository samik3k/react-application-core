import * as React from 'react';

import { toClassName, isString } from '../../../util';
import { BaseComponent } from '../../base';
import { IKeyboardKey, KeyboardKeyEnum, KEYBOARD_SPECIAL_KEYS } from '../keyboard.interface';
import { IKeyboardKeyProps } from './keyboard-key.interface';
import { IBasicEvent } from '../../../definitions.interface';

export class KeyboardKey extends BaseComponent<KeyboardKey, IKeyboardKeyProps> {

  /**
   * @stable [08.05.2018]
   * @returns {JSX.Element}
   */
  public render(): JSX.Element {
    const props = this.props;
    const keyAsString = props.value as string;
    const keyAsObject = props.value as IKeyboardKey;

    return (
      <div ref='self'
           style={keyAsObject && keyAsObject.width ? {width: `${keyAsObject && keyAsObject.width}px`} : {}}
           className={toClassName(
                       'rac-keyboard-key',
                       'rac-flex',
                       'rac-flex-center',
                       keyAsObject && keyAsObject.className,
                       this.uiFactory.rippleSurface
                     )}
           onClick={(event) => this.onClick(event)}>
        {
          isString(keyAsString)
          ? (
              props.useUppercase
                ? keyAsString.toUpperCase()
                : keyAsString
            )
          : (
              keyAsObject.type === KeyboardKeyEnum.UPPERCASE
             ? (props.useUppercase ? KEYBOARD_SPECIAL_KEYS.LOWERCASE : keyAsObject.value)
             : keyAsObject.value
            )
        }
      </div>
    );
  }

  /**
   * @stable [08.05.2018]
   * @param {IBasicEvent} e
   */
  private onClick(e: IBasicEvent): void {
    this.stopEvent(e);
    this.props.onSelect(this.props.value);
  }
}
