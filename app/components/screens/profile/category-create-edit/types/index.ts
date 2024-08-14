import { TCategory } from '../../../../../redux/types';

export interface TCategoryCreateEditRouteParams {
  item?: TCategory;
}

export type TInitialCategoryCreateEditFormValue = {
  title: string;
  description: string;
  picture: string | null;
  author: string;
};
export type TInitialCategoryKeywordFormValue = {
  keyword: string;
};
