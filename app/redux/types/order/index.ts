import { TProduct } from '../product';
import { EPriceType, TUser } from '../user';

export enum EOrderStatus {
  IN_PROGRESS = 'inProgress',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  ORDERED = 'ordered',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
}

export type TOrderItem = {
  _id: string;
  itemCount: number;
  inProgress: boolean;
  order: string;
  product: TProduct;
  author: TUser;
};
export type TOrder = {
  _id?: string;
  items: TOrderItem[];
  status: EOrderStatus;
  author: TUser | null;
  necessaryNotes: string;
  createdAt: string | null;
  confirmedTime: string | null;
  deliveredTime: string | null;
  rejectedTime: string | null;
};

export type TAdminOrder = {
  _id?: string;
  counterpartyName: string;
  counterpartyId: string;
  items: TOrderItem[];
  necessaryNotes: string;
  priceType: EPriceType;
  discountPercent: number;
  status: EOrderStatus;
  author: TUser | null;
  confirmedTime: string | null;
  completedTime: string | null;
  rejectedTime: string | null;
  createdAt: string | null;
};

export interface IStateCounterpartyWithId extends TStateCounterparty {
  orderId: string;
  necessaryNotes: string;
  items: TOrderItem[];
}

export type TStateCounterparty = {
  id: string;
  name: string;
};

export interface IAdminOrderWithIsEdit extends TAdminOrder {
  isEdited?: boolean;
}

export type TUpdatePricePayload = {
  itemId: string;
  newPrice: number;
};
