import { TItemsWithTotalLength } from '../global';
import { TProduct } from '../product';
import { TStateStatus } from '../user';

export type TCategory = {
  _id: string;
  title: string;
  description: string;
  keyword: string;
  products: TProduct;
  picture: string;
  author: string;
  created_at: string;
};

export type TChosen = {
  _id: string;
  title: string;
};

export type TInitialCategoryState = {
  categories: TItemsWithTotalLength<TCategory[]>;
  categoriesControl: TItemsWithTotalLength<TCategory[]>;
  create: TStateStatus;
  updateProductsCategoryByKeyword: TStateStatus;
  update: TStateStatus;
  delete: TStateStatus;
  chosen: TChosen;
};
