import { TItemsWithTotalLength } from '../global';
import { TStateStatus } from '../user';

export type TProduct = {
  _id: string;
  title: string;
  information: string;
  picture: string;
  priceRetail: number;
  priceWholesale: number;
  priceWildberries: number;
  count: number;
  code: string;
  discount: number;
  category: string;
  author: string;
  created_at: string;
};

export interface IProductHistory extends TProduct {
  orderCount: number;
}

export interface ICurrentProduct extends TStateStatus {
  product: TProduct | null;
}

export interface IProductDocument extends TStateStatus {
  file: File | null;
  dialogActive: boolean;
}

export type TInitialProductState = {
  currentProduct: ICurrentProduct;
  products: TItemsWithTotalLength<TProduct[]>;
  productDocument: IProductDocument;
  productsControl: TItemsWithTotalLength<TProduct[]>;
  notActivatedProductsControl: TItemsWithTotalLength<TProduct[]>;
  discountedProducts: TItemsWithTotalLength<TProduct[]>;
  discountedProductsForHomeScreen: TItemsWithTotalLength<TProduct[]>;
  productsForHomeScreen: TItemsWithTotalLength<TProduct[]>;
  productsByCategory: TItemsWithTotalLength<TProduct[]>;
  create: TStateStatus;
  createByDocument: TStateStatus;
  syncProducts: TStateStatus;
  update: TStateStatus;
  delete: TStateStatus;
  history: IProductHistory[];
  search: TItemsWithTotalLength<TProduct[]>;
  searchQuery: string;
};
