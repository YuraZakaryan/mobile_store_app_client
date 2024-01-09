import { Formik, FormikValues } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';

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
    <KeyboardAvoidingView behavior="padding" style={{ height: '100%' }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="items-center w-full justify-center my-4">
          <View className="items-center w-full mb-3">
            {icon}
            <MainTitle>{item ? `Փոփոխել ${label}` : `Ստեղծել ${label}`}</MainTitle>
          </View>
          <Formik
            initialValues={initialCreateEditFormValue}
            validationSchema={validationSchema}
            onSubmit={(values) => onSubmit && onSubmit(values)}>
            {(formikProps) => (
              <View className="w-full p-3 pt-0 justify-center">
                {renderItemComponent(formikProps)}
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
CreateEditForm.displayName = 'CreateEditForm';
