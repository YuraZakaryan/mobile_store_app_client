import { TProduct } from '../../../../../redux/types';

export interface TProductCreateEditRouteParams {
  item?: TProduct;
}

export type TInitialProductCreateEditFormValue = {
  title: string;
  category: string;
  price: number | string;
  discount: number | string;
  code: number | string;
  picture: string | null;
};
