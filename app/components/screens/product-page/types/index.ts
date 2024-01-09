import { TProduct } from '../../../../redux/types';

export enum ETypeInfo {
  PRICE = 'price',
  PRICE_WITH_DISCOUNTED = 'discountedPrice',
}

export interface IInfoItem {
  label: string;
  discount?: number;
  content: string | number;
  type?: ETypeInfo;
}

export type TProductRouteParams = {
  item: TProduct;
};
