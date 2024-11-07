import { FormikErrors, FormikHandlers, FormikProps, FormikTouched, FormikValues } from 'formik';
import React, { PropsWithChildren } from 'react';
import { ObjectSchema } from 'yup';

import { TabKeys } from '../components/screens/profile/orders-admin-control/types';
import { TProduct } from '../redux/types';
import { TOrder } from '../redux/types/order';

export interface IProductItem extends TClassName {
  index: number;
  item: TProduct;
  isLastInRow: boolean;
  imageClassName?: string;
  height?: number;
}
export interface ICrudListProps<T> {
  labelList?: string;
  data: T[];
  executeNavigateAfterThisFn?: (orderId: string) => void;
  navigateTo: string;
  renderButton?: () => React.ReactNode;
  renderItemComponent: (index: number, item: T) => React.ReactNode;
  fieldButtonType?: 'edit' | 'view';
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  previousButtonDisable: boolean;
  nextButtonDisable: boolean;
  totalItems: number;
  searchQuery: string;
  hasSearched: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
  searchFieldPlaceholder?: string;
  showDocumentDialogButton?: boolean;
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
  isLoading?: boolean;
}
export interface ILabelInput extends PropsWithChildren, TClassName {
  label: string;
  additionalLabel?: string;
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
export type TSelect = {
  label: string;
  value: string;
};

export interface IDeleteButton extends PropsWithChildren, TClassName {
  isLoading: boolean;
  handleDelete: () => void;
}
export interface ICrudMainButton extends PropsWithChildren, TClassName {
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
export interface IEmptyOrder extends TClassName {
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
export interface INumericInputCustom {
  value: number;
  minValue: number;
  maxValue: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}
export enum ETypeError {
  NETWORK = 'network',
  TECHNICAL = 'technical',
}
export interface INetworkError {
  handleRefresh: () => void;
  type?: ETypeError;
}
export type TCustomFileType = { size: number; name: string; type: string; uri: string };

export interface ISyncProducts extends TClassName {}

export interface IButtonTab extends TClassName {
  activeTab: TabKeys;
  expectedTab: TabKeys;
  tabName: string;
  handleTabClick: (tab: TabKeys) => void;
}
