import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SHOW_ERROR, SHOW_SUCCESS } from '../../../toasts';
import {
  cancelOrderThunk,
  changeOrderStatusThunk,
  createOrAddOrderThunk,
  deleteOrderItemThunk,
  deliverOrderThunk,
  fetchAllOrdersThunk,
  fetchDeliveredOrdersThunk,
  fetchOrdersByAuthorThunk,
  getOrderByUserInProgressThunk,
  toOrderThunk,
} from '../../http/orderThunk';
import {
  TInitialBasketState,
  TItemsWithTotalLength,
  TNewItemForm,
  TUpdateFieldAction,
} from '../../types';
import { EOrderStatus, EPackage, TOrder, TOrderItem } from '../../types/order';

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
  create: {
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
    updateItemCount: (
      state: TInitialBasketState,
      action: PayloadAction<{ itemId: string; newValue: number }>
    ): void => {
      const { itemId, newValue } = action.payload;
      state.basket.items = state.basket.items.map((item) =>
        item._id === itemId ? { ...item, itemCount: newValue } : item
      );
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
        } else if (action.payload === 409) {
          SHOW_ERROR('Ձեր էջը հաստատված չէ, փորձել մի փոքր ուշ');
        } else if (action.payload === 410) {
          SHOW_ERROR('Ձեր հաշիվը արգելափակված է');
        } else if (action.payload === 502) {
          SHOW_ERROR('Ոչ բավարար ապրանքի քանակ');
        } else if (action.payload === 401) {
          SHOW_ERROR('Կխնդրեինք առաջին հերթին մուտք գործել');
        } else {
          SHOW_ERROR('Ապրանքի զամբյուղում ավելացնելու հետ կապված խնդրի է առաջացել');
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
        SHOW_ERROR('Ապրանքի ջնջման հետ կապված խնդիր է առաջացել');
      })
      .addCase(toOrderThunk.fulfilled, (state: TInitialBasketState): void => {
        state.basket = initialState.basket;
        state.toOrder.isLoading = false;
        state.toOrder.isError = false;
        state.toOrder.isNetworkError = false;
        SHOW_SUCCESS('Պատվերը հաջողությամբ հաստատվեց');
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
        } else if (action.payload === 502) {
          SHOW_ERROR('Ոչ բավարար ապրանքի քանակ');
        } else {
          SHOW_ERROR('Պատվերի հաստատման հետ կապված խնդիր է առաջացել');
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
        SHOW_SUCCESS('Պատվերի կարգավիճակը փոխվեց');
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
        SHOW_SUCCESS('Պատվերը հաջողությամբ չեղարկվեց');
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
        SHOW_SUCCESS('Պատվերը նշվեց որպես առաքված');
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
      }),
});
export const orderReducer = orderSlice.reducer;
export const { changeForm, setProductId, setPackaging, updateItemCount, setNecessaryNotes } =
  orderSlice.actions;
