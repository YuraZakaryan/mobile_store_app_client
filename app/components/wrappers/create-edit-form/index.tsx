import { Formik, FormikValues } from 'formik';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { ICreateEditForm } from '../../../types';
import { MainTitle } from '../main-title';

export const CreateEditForm = <T extends FormikValues>(
  props: ICreateEditForm<T>
): React.ReactElement => {
  const {
    icon,
    item,
    label,
    initialCreateEditFormValue,
    renderItemComponent,
    onSubmit,
    validationSchema,
  } = props;
  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View className="m-4 items-center w-full h-full justify-center">
        <View className="items-center w-full mb-3">
          {icon}
          <MainTitle>{item ? `Փոփոխել ${label}` : `Ստեղծել ${label}`}</MainTitle>
        </View>
        <Formik
          initialValues={initialCreateEditFormValue}
          validationSchema={validationSchema}
          onSubmit={(values) => onSubmit && onSubmit(values)}>
          {(formikProps) => (
            <View className="w-full justify-center gap-4">{renderItemComponent(formikProps)}</View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};
CreateEditForm.displayName = 'CreateEditForm';
