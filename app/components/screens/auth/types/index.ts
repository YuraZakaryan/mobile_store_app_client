import { EAuthMode } from '../../../../redux/types';

export type TInitialLoginFormValue = {
  username: string;
  password: string;
};
export interface TInitialRegistrationFormValue extends TInitialLoginFormValue {
  firstname: string;
  lastname: string;
  address: string;
  password: string;
  phone: string;
}
export interface ILayoutAuth {
  switchTo: EAuthMode;
  title: string;
  buttonTitle: string;
}
export interface ISignButton {
  handleSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}
