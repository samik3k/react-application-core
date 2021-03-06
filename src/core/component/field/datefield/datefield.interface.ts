import { CSSProperties, Component } from 'react';

import {
  IBasicTextFieldProps,
  IBasicTextFieldState,
} from '../textfield/basic-textfield.interface';
import { IComponentEntity } from '../../../entities-definitions.interface';

export interface IDateFieldInternalProps extends IBasicTextFieldProps {
  container?: 'dialog' | 'inline';
  mode?: 'portrait' | 'landscape';
  format?: string;
  cancelLabel?: string;
  autoOk?: boolean;
  dialogContainerStyle?: CSSProperties;
  disableYearSelection?: boolean;
  firstDayOfWeek?: number;
  maxDate?: Date;
  minDate?: Date;
  locale?: string;
  okLabel?: string;
  utils?: any;
  openToYearSelection?: boolean;
  shouldDisableDate?: () => boolean;
  hideCalendarDate?: boolean;
}

export interface IDateFieldInternalState extends IBasicTextFieldState {
}

export interface IMaterialDateDialogComponent extends Component<IComponentEntity, { open: boolean }> {
  show(): void;
}
