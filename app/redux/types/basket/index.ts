import { TProductsWithStocks } from '../../../components/screens/profile/order-view/types';
import { TItemsWithTotalLength } from '../global';
import { TAdminOrder, TOrder } from '../order';
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

export interface IAdminOrderWithStatus extends TAdminOrder {
  requestStatus: TStateStatus;
}

export type TInitialBasketState = {
  newItemForm: TNewItemForm;
  orders: TItemsWithTotalLength<TOrder[]>;
  ordersHistory: TItemsWithTotalLength<TOrder[]>;
  adminActiveOrders: TItemsWithTotalLength<TAdminOrder[]>;
  adminHistoryOrders: TItemsWithTotalLength<TAdminOrder[]>;
  productsWithStocks: TItemsWithTotalLength<TProductsWithStocks[]>;
  basket: TOrder;
  adminOrder: IAdminOrderWithStatus;
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
