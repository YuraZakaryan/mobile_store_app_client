import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TProductsWithStocks } from '../../../components/screens/profile/order-view/types';
import {
  addItemToAdminBasketThunk,
  cancelOrderThunk,
  changeOrderStatusThunk,
  confirmAdminOrderThunk,
  createEmptyAdminOrderThunk,
  createOrAddOrderThunk,
  deleteAdminOrderItemThunk,
  deleteOrderItemThunk,
  deliverOrderThunk,
  fetchAdminActiveOrdersThunk,
  fetchAdminHistoryOrdersThunk,
  fetchAllOrdersThunk,
  fetchDeliveredOrdersThunk,
  fetchOrdersByAuthorThunk,
  getOneAdminOrderThunk,
  getOrderByUserInProgressThunk,
  getProductsWithStocksThunk,
  toOrderThunk,
  updateAdminOrderThunk,
} from '../../http/orderThunk';
import {
  TInitialBasketState,
  TItemsWithTotalLength,
  TNewItemForm,
  TUpdateFieldAction,
} from '../../types';
import {
  EOrderStatus,
  EPackage,
  TAdminOrder,
  TOrder,
  TOrderItem,
  TStateCounterparty,
} from '../../types/order';

const initialState: TInitialBasketState = {
  newItemForm: {
    product: '',
    author: '',
    itemCount: 0,
  },
  basket: {
    status: EOrderStatus.IN_PROGRESS,
    items: [],
    packaging: EPackage.BAG,
    necessaryNotes: '',
    author: null,
    confirmedTime: null,
    acceptedTime: null,
    deliveredTime: null,
    rejectedTime: null,
    createdAt: null,
  },
  adminOrder: {
    requestStatus: {
      isLoading: null,
      isError: false,
      isNetworkError: false,
    },
    _id: '',
    counterpartyName: '',
    counterpartyId: '',
    items: [],
    status: EOrderStatus.IN_PROGRESS,
    necessaryNotes: '',
    author: null,
    createdAt: null,
    confirmedTime: null,
  },
  orders: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
    total_items: 0,
    items: [],
  },
  ordersHistory: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
    total_items: 0,
    items: [],
  },
  adminActiveOrders: {
    isLoading: true,
    isError: false,
    isNetworkError: false,
    total_items: 0,
    items: [],
  },
  adminHistoryOrders: {
    isLoading: true,
    isError: false,
    isNetworkError: false,
    total_items: 0,
    items: [],
  },
  productsWithStocks: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
    total_items: 0,
    items: [],
  },
  create: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
  createEmpty: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
  fetchBasketOrder: {
    isLoading: null,
    isError: false,
    isNetworkError: false,
  },
  deleteItem: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
  toOrder: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
  changeStatus: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
  cancelOrder: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
  deliverOrder: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
  addItemToAdminBasket: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
  saveAdminOrder: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
  confirmAdminOrder: {
    isLoading: false,
    isError: false,
    isNetworkError: false,
  },
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    changeForm(state: TInitialBasketState, action: PayloadAction<TUpdateFieldAction>): void {
      const { name, value } = action.payload;
      state.newItemForm = {
        ...state.newItemForm,
        [name]: value,
      };
    },
    setProductId(state: TInitialBasketState, action: PayloadAction<TNewItemForm>): void {
      state.newItemForm = {
        ...state.newItemForm,
        ...action.payload,
      };
    },
    setPackaging(state: TInitialBasketState, action: PayloadAction<EPackage>): void {
      state.basket.packaging = action.payload;
    },
    setNecessaryNotes(state: TInitialBasketState, action: PayloadAction<string>): void {
      state.basket.necessaryNotes = action.payload;
    },
    setAdminOrderNecessaryNotes(state: TInitialBasketState, action: PayloadAction<string>): void {
      state.adminOrder.necessaryNotes = action.payload;
    },
    updateItemCount: (
      state: TInitialBasketState,
      action: PayloadAction<{ itemId: string; newValue: number }>
    ): void => {
      const { itemId, newValue } = action.payload;
      state.basket.items = state.basket.items.map((item) =>
        item._id === itemId ? { ...item, itemCount: newValue } : item
      );
    },
    updateAdminItemCount: (
      state: TInitialBasketState,
      action: PayloadAction<{ itemId: string; newValue: number }>
    ): void => {
      const { itemId, newValue } = action.payload;
      state.adminOrder.items = state.adminOrder.items.map((item) =>
        item._id === itemId ? { ...item, itemCount: newValue } : item
      );
    },
    updateCounterPartyOfAdminOrder: (
      state: TInitialBasketState,
      action: PayloadAction<TStateCounterparty>
    ) => {
      const { id, name } = action.payload;

      if (id && name) {
        state.adminOrder = {
          ...state.adminOrder,
          counterpartyId: id,
          counterpartyName: name,
        };
      }
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(createOrAddOrderThunk.fulfilled, (state: TInitialBasketState): void => {
        state.create.isLoading = false;
        state.create.isError = false;
        state.create.isNetworkError = false;
      })
      .addCase(createOrAddOrderThunk.pending, (state: TInitialBasketState): void => {
        state.create.isLoading = true;
        state.create.isError = false;
        state.create.isNetworkError = false;
      })
      .addCase(createOrAddOrderThunk.rejected, (state: TInitialBasketState, action): void => {
        state.create.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.create.isNetworkError = true;
        }
      })
      .addCase(
        getOrderByUserInProgressThunk.fulfilled,
        (state: TInitialBasketState, action: PayloadAction<TOrder>): void => {
          state.basket = action.payload;
          state.fetchBasketOrder.isLoading = false;
          state.fetchBasketOrder.isError = false;
          state.fetchBasketOrder.isNetworkError = false;
        }
      )
      .addCase(getOrderByUserInProgressThunk.pending, (state: TInitialBasketState): void => {
        state.fetchBasketOrder.isLoading = true;
        state.fetchBasketOrder.isError = false;
        state.fetchBasketOrder.isNetworkError = false;
      })
      .addCase(
        getOrderByUserInProgressThunk.rejected,
        (state: TInitialBasketState, action): void => {
          state.fetchBasketOrder.isLoading = false;
          state.basket = initialState.basket;
          if (action.payload === 'NetworkError') {
            state.fetchBasketOrder.isNetworkError = true;
          } else if (action.payload !== 404) {
            state.fetchBasketOrder.isError = true;
          }
        }
      )
      .addCase(deleteOrderItemThunk.fulfilled, (state, action: PayloadAction<string>): void => {
        state.basket.items = state.basket.items.filter(
          (item: TOrderItem): boolean => item._id !== action.payload
        );
        state.deleteItem.isLoading = false;
        state.deleteItem.isError = false;
        state.deleteItem.isNetworkError = false;
      })
      .addCase(deleteOrderItemThunk.pending, (state: TInitialBasketState): void => {
        state.deleteItem.isLoading = true;
        state.deleteItem.isError = false;
        state.deleteItem.isNetworkError = false;
      })
      .addCase(deleteOrderItemThunk.rejected, (state: TInitialBasketState, action): void => {
        state.deleteItem.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.deleteItem.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.deleteItem.isError = true;
        }
      })
      .addCase(
        deleteAdminOrderItemThunk.fulfilled,
        (state, action: PayloadAction<string>): void => {
          state.basket.items = state.basket.items.filter(
            (item: TOrderItem): boolean => item._id !== action.payload
          );
          state.deleteItem.isLoading = false;
          state.deleteItem.isError = false;
          state.deleteItem.isNetworkError = false;
        }
      )
      .addCase(deleteAdminOrderItemThunk.pending, (state: TInitialBasketState): void => {
        state.deleteItem.isLoading = true;
        state.deleteItem.isError = false;
        state.deleteItem.isNetworkError = false;
      })
      .addCase(deleteAdminOrderItemThunk.rejected, (state: TInitialBasketState, action): void => {
        state.deleteItem.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.deleteItem.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.deleteItem.isError = true;
        }
      })
      .addCase(toOrderThunk.fulfilled, (state: TInitialBasketState): void => {
        state.basket = initialState.basket;
        state.toOrder.isLoading = false;
        state.toOrder.isError = false;
        state.toOrder.isNetworkError = false;
      })
      .addCase(toOrderThunk.pending, (state: TInitialBasketState): void => {
        state.toOrder.isLoading = true;
        state.toOrder.isError = false;
        state.toOrder.isNetworkError = false;
      })
      .addCase(toOrderThunk.rejected, (state: TInitialBasketState, action): void => {
        state.toOrder.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.toOrder.isNetworkError = true;
        }
      })
      .addCase(
        fetchAllOrdersThunk.fulfilled,
        (
          state: TInitialBasketState,
          action: PayloadAction<TItemsWithTotalLength<TOrder[]>>
        ): void => {
          const { total_items, items } = action.payload;
          state.orders = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchAllOrdersThunk.pending, (state: TInitialBasketState): void => {
        state.orders.isLoading = true;
        state.orders.isError = false;
        state.orders.isNetworkError = false;
      })
      .addCase(fetchAllOrdersThunk.rejected, (state: TInitialBasketState, action): void => {
        state.orders.total_items = 0;
        state.orders.items = [];
        state.orders.isLoading = false;

        if (action.payload === 'NetworkError') {
          state.orders.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.orders.isError = true;
        }
      })
      .addCase(
        fetchDeliveredOrdersThunk.fulfilled,
        (
          state: TInitialBasketState,
          action: PayloadAction<TItemsWithTotalLength<TOrder[]>>
        ): void => {
          const { total_items, items } = action.payload;
          state.ordersHistory = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchDeliveredOrdersThunk.pending, (state: TInitialBasketState): void => {
        state.ordersHistory.isLoading = true;
        state.ordersHistory.isError = false;
        state.ordersHistory.isNetworkError = false;
      })
      .addCase(fetchDeliveredOrdersThunk.rejected, (state: TInitialBasketState, action): void => {
        state.ordersHistory.total_items = 0;
        state.ordersHistory.items = [];
        state.ordersHistory.isLoading = false;

        if (action.payload === 'NetworkError') {
          state.ordersHistory.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.ordersHistory.isError = true;
        }
      })
      .addCase(
        getProductsWithStocksThunk.fulfilled,
        (state: TInitialBasketState, action: PayloadAction<TProductsWithStocks[]>): void => {
          state.productsWithStocks = {
            total_items: 0,
            items: action.payload,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(getProductsWithStocksThunk.pending, (state: TInitialBasketState): void => {
        state.ordersHistory.isLoading = true;
        state.ordersHistory.isError = false;
        state.ordersHistory.isNetworkError = false;
      })
      .addCase(getProductsWithStocksThunk.rejected, (state: TInitialBasketState, action): void => {
        state.ordersHistory.items = [];
        state.ordersHistory.isLoading = false;

        if (action.payload === 'NetworkError') {
          state.ordersHistory.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.ordersHistory.isError = true;
        }
      })
      .addCase(
        fetchOrdersByAuthorThunk.fulfilled,
        (
          state: TInitialBasketState,
          action: PayloadAction<TItemsWithTotalLength<TOrder[]>>
        ): void => {
          const { total_items, items } = action.payload;
          state.ordersHistory = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchOrdersByAuthorThunk.pending, (state: TInitialBasketState): void => {
        state.ordersHistory.isLoading = true;
        state.ordersHistory.isError = false;
        state.ordersHistory.isNetworkError = false;
      })
      .addCase(fetchOrdersByAuthorThunk.rejected, (state: TInitialBasketState, action): void => {
        state.ordersHistory.total_items = 0;
        state.ordersHistory.items = [];
        state.ordersHistory.isLoading = false;

        if (action.payload === 'NetworkError') {
          state.ordersHistory.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.ordersHistory.isError = true;
        }
      })
      .addCase(changeOrderStatusThunk.fulfilled, (state: TInitialBasketState): void => {
        state.changeStatus.isLoading = false;
        state.changeStatus.isError = false;
        state.changeStatus.isNetworkError = false;
      })
      .addCase(changeOrderStatusThunk.pending, (state: TInitialBasketState): void => {
        state.changeStatus.isLoading = true;
        state.changeStatus.isError = false;
        state.changeStatus.isError = false;
      })
      .addCase(changeOrderStatusThunk.rejected, (state: TInitialBasketState, action): void => {
        state.changeStatus.isLoading = false;

        if (action.payload === 'NetworkError') {
          state.changeStatus.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.changeStatus.isError = true;
        }
      })
      .addCase(cancelOrderThunk.fulfilled, (state: TInitialBasketState): void => {
        state.cancelOrder.isLoading = false;
        state.cancelOrder.isError = false;
        state.cancelOrder.isNetworkError = false;
      })
      .addCase(cancelOrderThunk.pending, (state: TInitialBasketState): void => {
        state.cancelOrder.isLoading = true;
        state.cancelOrder.isError = false;
        state.cancelOrder.isNetworkError = false;
      })
      .addCase(cancelOrderThunk.rejected, (state: TInitialBasketState, action): void => {
        state.cancelOrder.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.cancelOrder.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.cancelOrder.isError = true;
        }
      })
      .addCase(deliverOrderThunk.fulfilled, (state: TInitialBasketState): void => {
        state.deliverOrder.isLoading = false;
        state.deliverOrder.isError = false;
        state.deliverOrder.isNetworkError = false;
      })
      .addCase(deliverOrderThunk.pending, (state: TInitialBasketState): void => {
        state.deliverOrder.isLoading = true;
        state.deliverOrder.isError = false;
        state.deliverOrder.isNetworkError = false;
      })
      .addCase(deliverOrderThunk.rejected, (state: TInitialBasketState, action): void => {
        state.deliverOrder.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.deliverOrder.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.deliverOrder.isError = true;
        }
      })
      .addCase(
        fetchAdminActiveOrdersThunk.fulfilled,
        (
          state: TInitialBasketState,
          action: PayloadAction<TItemsWithTotalLength<TAdminOrder[]>>
        ): void => {
          const { total_items, items } = action.payload;
          state.adminActiveOrders = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchAdminActiveOrdersThunk.pending, (state: TInitialBasketState): void => {
        state.adminActiveOrders.isLoading = true;
        state.adminActiveOrders.isError = false;
        state.adminActiveOrders.isNetworkError = false;
      })
      .addCase(fetchAdminActiveOrdersThunk.rejected, (state: TInitialBasketState, action): void => {
        state.adminActiveOrders.total_items = 0;
        state.adminActiveOrders.items = [];
        state.adminActiveOrders.isLoading = false;

        if (action.payload === 'NetworkError') {
          state.adminActiveOrders.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.adminActiveOrders.isError = true;
        }
      })
      .addCase(
        fetchAdminHistoryOrdersThunk.fulfilled,
        (
          state: TInitialBasketState,
          action: PayloadAction<TItemsWithTotalLength<TAdminOrder[]>>
        ): void => {
          const { total_items, items } = action.payload;
          state.adminHistoryOrders = {
            total_items,
            items,
            isError: false,
            isNetworkError: false,
            isLoading: false,
          };
        }
      )
      .addCase(fetchAdminHistoryOrdersThunk.pending, (state: TInitialBasketState): void => {
        state.adminHistoryOrders.isLoading = true;
        state.adminHistoryOrders.isError = false;
        state.adminHistoryOrders.isNetworkError = false;
      })
      .addCase(
        fetchAdminHistoryOrdersThunk.rejected,
        (state: TInitialBasketState, action): void => {
          state.adminHistoryOrders.total_items = 0;
          state.adminHistoryOrders.items = [];
          state.adminHistoryOrders.isLoading = false;

          if (action.payload === 'NetworkError') {
            state.adminHistoryOrders.isNetworkError = true;
          } else if (action.payload !== 404) {
            state.adminHistoryOrders.isError = true;
          }
        }
      )
      .addCase(
        getOneAdminOrderThunk.fulfilled,
        (state: TInitialBasketState, action: PayloadAction<TAdminOrder>): void => {
          state.adminOrder = {
            requestStatus: {
              isLoading: false,
              isError: false,
              isNetworkError: false,
            },
            ...action.payload,
          };
        }
      )
      .addCase(getOneAdminOrderThunk.pending, (state: TInitialBasketState): void => {
        state.adminOrder.requestStatus.isLoading = true;
        state.adminOrder.requestStatus.isError = false;
        state.adminOrder.requestStatus.isNetworkError = false;
      })
      .addCase(getOneAdminOrderThunk.rejected, (state: TInitialBasketState, action): void => {
        const { isError, isNetworkError } = state.adminOrder.requestStatus;

        state.adminOrder = {
          ...initialState.adminOrder,
          requestStatus: {
            ...initialState.adminOrder.requestStatus,
            isError,
            isNetworkError,
          },
        };

        if (action.payload === 'NetworkError') {
          state.adminOrder.requestStatus.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.adminOrder.requestStatus.isError = true;
        }
      })
      .addCase(
        createEmptyAdminOrderThunk.fulfilled,
        (state: TInitialBasketState, action: PayloadAction<TAdminOrder>): void => {
          if (action.payload) {
            state.adminOrder = {
              requestStatus: {
                isLoading: false,
                isError: false,
                isNetworkError: false,
              },
              ...action.payload,
            };
          }

          state.createEmpty.isLoading = false;
          state.createEmpty.isError = false;
          state.createEmpty.isNetworkError = false;
        }
      )
      .addCase(createEmptyAdminOrderThunk.pending, (state: TInitialBasketState): void => {
        state.createEmpty.isLoading = true;
        state.createEmpty.isError = false;
        state.createEmpty.isNetworkError = false;
      })
      .addCase(createEmptyAdminOrderThunk.rejected, (state: TInitialBasketState, action): void => {
        state.createEmpty.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.createEmpty.isNetworkError = true;
        }
      })
      .addCase(addItemToAdminBasketThunk.fulfilled, (state: TInitialBasketState): void => {
        state.addItemToAdminBasket = {
          isLoading: false,
          isError: false,
          isNetworkError: false,
        };
      })
      .addCase(addItemToAdminBasketThunk.pending, (state: TInitialBasketState): void => {
        state.addItemToAdminBasket = {
          isLoading: true,
          isError: false,
          isNetworkError: false,
        };
      })
      .addCase(addItemToAdminBasketThunk.rejected, (state: TInitialBasketState, action): void => {
        state.addItemToAdminBasket.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.addItemToAdminBasket.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.addItemToAdminBasket.isError = true;
        }
      })
      .addCase(
        updateAdminOrderThunk.fulfilled,
        (state: TInitialBasketState, action: PayloadAction<TAdminOrder>): void => {
          if (action.payload) {
            state.adminOrder = {
              requestStatus: {
                isLoading: false,
                isError: false,
                isNetworkError: false,
              },
              ...action.payload,
            };
          }

          state.saveAdminOrder = {
            isLoading: false,
            isError: false,
            isNetworkError: false,
          };
        }
      )
      .addCase(updateAdminOrderThunk.pending, (state: TInitialBasketState): void => {
        state.saveAdminOrder = {
          isLoading: true,
          isError: false,
          isNetworkError: false,
        };
      })
      .addCase(updateAdminOrderThunk.rejected, (state: TInitialBasketState, action): void => {
        state.saveAdminOrder.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.saveAdminOrder.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.saveAdminOrder.isError = true;
        }
      })
      .addCase(
        confirmAdminOrderThunk.fulfilled,
        (state: TInitialBasketState, action: PayloadAction<TAdminOrder>): void => {
          if (action.payload) {
            state.adminOrder = {
              requestStatus: {
                isLoading: false,
                isError: false,
                isNetworkError: false,
              },
              ...action.payload,
            };
          }
          state.confirmAdminOrder = {
            isLoading: false,
            isError: false,
            isNetworkError: false,
          };
        }
      )
      .addCase(confirmAdminOrderThunk.pending, (state: TInitialBasketState): void => {
        state.confirmAdminOrder = {
          isLoading: true,
          isError: false,
          isNetworkError: false,
        };
      })
      .addCase(confirmAdminOrderThunk.rejected, (state: TInitialBasketState, action): void => {
        state.confirmAdminOrder.isLoading = false;
        if (action.payload === 'NetworkError') {
          state.confirmAdminOrder.isNetworkError = true;
        } else if (action.payload !== 404) {
          state.confirmAdminOrder.isError = true;
        }
      }),
});
export const orderReducer = orderSlice.reducer;
export const {
  changeForm,
  setProductId,
  setPackaging,
  updateItemCount,
  updateAdminItemCount,
  updateCounterPartyOfAdminOrder,
  setNecessaryNotes,
  setAdminOrderNecessaryNotes,
} = orderSlice.actions;
