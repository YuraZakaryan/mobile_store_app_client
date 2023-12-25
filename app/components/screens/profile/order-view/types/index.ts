import { IOrder } from '../../../../../redux/types';

export interface TOrderViewRouteParams {
  item?: IOrder;
}
export interface IButtonStatusViewOrder {
  label: string;
  active?: boolean
}
