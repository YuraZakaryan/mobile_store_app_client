import { TItemsWithTotalLength } from '../global';
import { TStateStatus } from '../user';

export enum EImageAdd {
  WITH_IMAGE = 'with_image',
  WITHOUT_IMAGE = 'without_image',
  WITH_IMAGE_FOR_EXIST = 'with_image_for_exist',
  WITH_IMAGE_FOR_NEW = 'with_image_for_new',
}

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

export interface ISyncProductsState extends TStateStatus {
  dialogStatus: boolean;
  imageSyncType: EImageAdd;
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
  syncProducts: ISyncProductsState;
  update: TStateStatus;
  delete: TStateStatus;
  history: IProductHistory[];
  search: TItemsWithTotalLength<TProduct[]>;
  searchQuery: string;
};
