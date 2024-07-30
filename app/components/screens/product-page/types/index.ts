export enum ETypeInfo {
  LONG = 'long',
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
  title: string;
  productId: string;
};
