import { Formik, FormikProps, FormikValues } from 'formik';
import React from 'react';
import { View } from 'react-native';
import { ObjectSchema } from 'yup';

export interface IResetPasswordForm<T extends FormikValues> {
  initialResetPasswordFormValue: T;
  onSubmit?: (values: FormikValues) => void;
  validationSchema?: ObjectSchema<any>;
  renderItemComponent: (formikProps: FormikProps<T>) => React.ReactNode;
}

export const ResetPasswordForm = <T extends FormikValues>(
  props: IResetPasswordForm<T>
): React.ReactElement => {
  const { initialResetPasswordFormValue, renderItemComponent, onSubmit, validationSchema } = props;
  return (
    <Formik
      initialValues={initialResetPasswordFormValue}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit && onSubmit(values)}>
      {(formikProps) => (
        <View className="w-full pt-0 justify-center">{renderItemComponent(formikProps)}</View>
      )}
    </Formik>
  );
};
ResetPasswordForm.displayName = 'ResetPasswordForm';
