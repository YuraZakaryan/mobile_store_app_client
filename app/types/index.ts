import { FormikErrors, FormikHandlers, FormikProps, FormikTouched, FormikValues } from 'formik';
import React, { PropsWithChildren } from 'react';
import { ObjectSchema } from 'yup';

import { TInitialUserCreateEditFormValue } from '../components/screens/profile/user-create-edit/types';
import { IOrder, TProduct } from '../redux/types';

export interface IProductItem {
  index: number;
  item: TProduct;
  isLastInRow: boolean;
  imageClassName?: string;
  height?: number;
}
export interface ICrudListProps<T> {
  labelList?: string;
  data: T[];
  navigateTo: string;
  renderItemComponent: (index: number, item: T) => React.ReactNode;
  fieldButtonType?: 'edit' | 'view';
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  previousButtonDisable: boolean;
  nextButtonDisable: boolean;
  totalItems: number;
}
export interface ICreateEditForm<T extends FormikValues> {
  initialCreateEditFormValue: T;
  icon: React.ReactNode;
  item?: T;
  label: string;
  onSubmit?: (values: FormikValues) => void;
  validationSchema?: ObjectSchema<any>;
  renderItemComponent: (formikProps: FormikProps<T>) => React.ReactNode;
}
export interface ICreateItemButton {
  handleClick: () => void;
  createButtonLabel: string;
}
export interface ILabelInput extends PropsWithChildren, TClassName {
  label: string;
  icon?: React.ReactNode;
}
export type TClassName = {
  className?: string;
};
export interface IOrderInfo {
  item: IOrder;
}
export interface IFieldWithError<T extends FormikValues> extends PropsWithChildren {
  fieldName: string;
  errors: FormikErrors<T>;
  touched: FormikTouched<T> | any;
}
export type TRoleSelect = {
  label: string;
  value: string;
};
export interface IDeleteButton extends PropsWithChildren {
  isLoading: boolean;
  handleDelete: () => void;
}
export interface ICrudMainButton extends PropsWithChildren {
  disabled: boolean;
  isLoading: boolean;
  handleSubmit: FormikHandlers['handleSubmit'];
}
