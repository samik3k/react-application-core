import { IBaseContainerInternalProps } from '../../../component/base';

export interface IDefaultLayoutContainerInternalProps extends IBaseContainerInternalProps {
  title?: string;
  headerItems?: JSX.Element;
  navigationControlType?: string;
  navigationControlHandler?(): void;
}
