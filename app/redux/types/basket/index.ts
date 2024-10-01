import { TProductsWithStocks } from '../../../components/screens/profile/order-view/types';
import { TItemsWithTotalLength } from '../global';
import { TAdminOrder, TOrder } from '../order';
import { TProduct } from '../product';
import { TStateStatus, TUser } from '../user';

export type TNewItemForm = {
  itemCount: number;
  product: string;
  author: string;
  [key: string]: string | number | boolean | null;
};

export interface IBasketItem extends TProduct {
  orderCount: number;
  user: TUser;
}

export interface IAdminOrderWithStatus extends TAdminOrder {
  requestStatus: TStateStatus;
}

export interface INewItemFormForStock extends TNewItemForm {
  forStock: boolean;
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
  createEmpty: TStateStatus;
  deleteItem: TStateStatus;
  toOrder: TStateStatus;
  fetchBasketOrder: TStateStatus;
  changeStatus: TStateStatus;
  cancelOrder: TStateStatus;
  deliverOrder: TStateStatus;
  addItemToAdminBasket: TStateStatus;
  saveAdminOrder: TStateStatus;
  confirmAdminOrder: TStateStatus;
};
export type TUpdateFieldAction = {
  name: keyof TNewItemForm;
  value: string | number | null;
};
