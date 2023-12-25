import { TProduct } from '../../../../redux/types';

export enum ETypeInfo {
  PRICE = 'price',
}

export interface IInfoItem {
  label: string;
  content: string | number;
  type?: ETypeInfo;
}

export type TProductRouteParams = {
  item: TProduct;
};
