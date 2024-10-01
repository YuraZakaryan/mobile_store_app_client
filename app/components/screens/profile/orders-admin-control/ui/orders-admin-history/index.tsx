import { fetchAdminHistoryOrdersThunk } from '../../../../../../redux/http/orderThunk';
import { OrdersAdminList } from '../orders-admin-list';

export const OrdersAdminHistory = () => (
  <OrdersAdminList
    ordersSelector={(state) => state.order.adminHistoryOrders}
    fetchOrdersThunk={fetchAdminHistoryOrdersThunk}
  />
);
