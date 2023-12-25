import { TProduct } from '../product';
import { TUser } from '../user';

export type TNewItemForm = {
  _id: string | null;
  title: string;
  count: number;
  [key: string]: string | number | null;
};

export interface IBasketItem extends TProduct {
  orderCount: number;
  user: TUser;
}

export enum EPacking {
  BAG = 'bag',
  BOX = 'box',
}

export type TNewItemFormData = {
  items: IBasketItem[];
  packaging: EPacking;
  necessaryNotes: string;
  user: TUser;
  status: 'neutral' | 'onTheRoad' | 'completed';
  orderStartTime: string;
  orderCompletedTime: string;
  created_at: string;
};

export type TInitialBasketState = {
  newItemForm: TNewItemForm;
  formData: TNewItemFormData;
  orders: IOrder[];
};
export interface IOrder extends TNewItemFormData {
  _id: string;
}
export type TUpdateFieldAction = {
  name: keyof TNewItemForm;
  value: string | number | null;
};
