import { TItemsWithTotalLength } from '../global';
import { TOrder } from '../order';
import { TProduct } from '../product';
import { TStateStatus, TUser } from '../user';

export type TNewItemForm = {
  itemCount: number;
  product: string;
  author: string;
  [key: string]: string | number | null;
};

export interface IBasketItem extends TProduct {
  orderCount: number;
  user: TUser;
}
export type TInitialBasketState = {
  newItemForm: TNewItemForm;
  orders: TItemsWithTotalLength<TOrder[]>;
  ordersHistory: TItemsWithTotalLength<TOrder[]>;
  basket: TOrder;
  create: TStateStatus;
  deleteItem: TStateStatus;
  toOrder: TStateStatus;
  fetchBasketOrder: TStateStatus;
  changeStatus: TStateStatus;
  cancelOrder: TStateStatus;
  deliverOrder: TStateStatus;
};
export type TUpdateFieldAction = {
  name: keyof TNewItemForm;
  value: string | number | null;
};
