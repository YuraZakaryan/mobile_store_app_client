import { TItemsWithTotalLength } from '../global';
import { TStateStatus } from '../user';

export type TCategory = {
  _id: string;
  title: string;
  description: string;
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
  create: TStateStatus;
  update: TStateStatus;
  delete: TStateStatus;
  chosen: TChosen;
};
