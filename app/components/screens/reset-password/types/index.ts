import { FormikHandlers } from 'formik';
import { PropsWithChildren } from 'react';

export interface IResetSendButton extends PropsWithChildren {
  disabled: boolean;
  isLoading: boolean;
  handleSubmit: FormikHandlers['handleSubmit'];
}
export type TInitialSendMailFormValue = {
  mail: string;
};
export type TInitialSendOtpFormValue = {
  otp: string;
};
export type TInitialSetNewPassFormValue = {
  newPassword: string;
  confirmPassword: string;
};
