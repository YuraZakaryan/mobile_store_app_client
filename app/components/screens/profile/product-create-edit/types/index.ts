import { TProduct } from '../../../../../redux/types';

export interface TProductCreateEditRouteParams {
  item?: TProduct;
}

export type TInitialProductCreateEditFormValue = {
  title: string;
  information: string;
  price: number | string | null;
  discount: number | string;
  code: string;
  count: number | string | null;
  picture: string | null;
  category: string;
  author: string;
};
