import { FormikValues } from 'formik';
import React from 'react';
import { Text, View } from 'react-native';

import { IFieldWithError } from '../../../types';

export const FieldWithError = <T extends FormikValues>(
  props: IFieldWithError<T>
): React.ReactElement => {
  const { errors, touched, fieldName, children, className } = props;
  const hasError = errors[fieldName] && touched[fieldName];
  const errorField = errors[fieldName] as string;

  return (
    <View className={`mb-1 ${className ? className : ''}`}>
      {children}
      {hasError && <Text className="text-[12px] text-red-600 font-semibold">{errorField}</Text>}
    </View>
  );
};
