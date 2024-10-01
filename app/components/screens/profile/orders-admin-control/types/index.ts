export type TabKeys = 'active' | 'history';

export interface IOrdersAdminList {
  ordersSelector: (state: any) => any;
  fetchOrdersThunk: any;
}
