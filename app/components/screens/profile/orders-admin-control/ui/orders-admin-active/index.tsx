import { fetchAdminActiveOrdersThunk } from '../../../../../../redux/http/orderThunk'
import { OrdersAdminList } from '../orders-admin-list'

export const OrdersAdminActive = () => (
  <OrdersAdminList
    ordersSelector={(state) => state.order.adminActiveOrders}
    fetchOrdersThunk={fetchAdminActiveOrdersThunk}
  />
);
