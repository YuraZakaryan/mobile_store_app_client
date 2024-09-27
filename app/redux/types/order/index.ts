import { TProduct } from '../product';
import { TUser } from '../user';

export enum EOrderStatus {
  IN_PROGRESS = 'inProgress',
  ORDERED = 'ordered',
  ACCEPTED = 'accepted',
  DELIVERED = 'delivered',
  REJECTED = 'rejected',
}

export enum EPackage {
  BOX = 'box',
  BAG = 'bag',
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
  packaging: EPackage;
  author: TUser | null;
  necessaryNotes: string;
  createdAt: string | null;
  confirmedTime: string | null;
  acceptedTime: string | null;
  deliveredTime: string | null;
  rejectedTime: string | null;
};

export type TAdminOrder = {
  _id?: string;
  counterpartyName: string;
  counterpartyId: string;
  items: TOrderItem[];
  necessaryNotes: string;
  status: EOrderStatus;
  author: TUser | null;
  confirmedTime: string | null;
  createdAt: string | null;
};
