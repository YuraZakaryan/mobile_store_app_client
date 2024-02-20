import { ParamListBase } from '@react-navigation/native';
import React from 'react';

import { TItemsWithTotalLength, TProduct } from '../../../../redux/types';

export interface IItemsByCategory {
  categoryTitle: string;
  products: TItemsWithTotalLength<TProduct[]>;
  icon: React.ReactNode;
}

export type THomeStackParamList = {
  Home: string;
  categoryTitle: string;
} & ParamListBase;

export type TProductItemParamList = {
  item: TProduct;
} & ParamListBase;
