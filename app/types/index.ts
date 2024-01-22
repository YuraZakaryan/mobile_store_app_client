import { FormikErrors, FormikHandlers, FormikProps, FormikTouched, FormikValues } from 'formik';
import React, { PropsWithChildren } from 'react';
import { ObjectSchema } from 'yup';

import { TProduct } from '../redux/types';
import { TOrder } from '../redux/types/order';

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
  required?: boolean;
}
export type TClassName = {
  className?: string;
};
export interface IOrderInfo {
  item: TOrder;
  totalAmount: number;
}
export interface IFieldWithError<T extends FormikValues> extends PropsWithChildren, TClassName {
  fieldName: string;
  errors: FormikErrors<T>;
  touched: FormikTouched<T> | any;
}
export type TRoleSelect = {
  label: string;
  value: string;
};
export interface IDeleteButton extends PropsWithChildren, TClassName {
  isLoading: boolean;
  handleDelete: () => void;
}
export interface ICrudMainButton extends PropsWithChildren {
  disabled: boolean;
  isLoading: boolean;
  handleSubmit: FormikHandlers['handleSubmit'];
}
export interface ISaleIcon {
  discount: number;
}
export interface IOrderList extends PropsWithChildren {
  item: TOrder;
}
export interface IEmptyOrder {
  text: string;
}
export interface IPaginationButtons {
  start_show?: number;
  total_items: number;
  previousButtonDisable: boolean;
  nextButtonDisable: boolean;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}
