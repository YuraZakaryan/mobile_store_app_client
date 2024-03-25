import { EOrderStatus, TOrder } from '../../../../../redux/types/order';

export interface TOrderViewRouteParams {
  item?: TOrder;
}
export interface IButtonStatusViewOrder {
  label: string;
  type: EOrderStatus;
  isLoading?: boolean;
  handleChangeStatus: (status: EOrderStatus) => void;
}
