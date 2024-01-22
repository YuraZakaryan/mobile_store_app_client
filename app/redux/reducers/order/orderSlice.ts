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
    total_items: 0,
    items: [],
  },
  ordersHistory: {
    isLoading: false,
    isError: false,
    total_items: 0,
    items: [],
  },
  create: {
    isLoading: false,
    isError: false,
  },
  fetchBasketOrder: {
    isLoading: false,
    isError: false,
  },
  deleteItem: {
    isLoading: false,
    isError: false,
  },
  toOrder: {
    isLoading: false,
    isError: false,
  },
  changeStatus: {
    isLoading: false,
    isError: false,
  },
  cancelOrder: {
    isLoading: false,
    isError: false,
  },
  deliverOrder: {
    isLoading: false,
    isError: false,
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
        SHOW_SUCCESS('Ապրանքը հաջողությամբ ավելացվեց զամբյուղում');
      })
      .addCase(createOrAddOrderThunk.pending, (state: TInitialBasketState): void => {
        state.create.isLoading = true;
        state.create.isError = false;
      })
      .addCase(createOrAddOrderThunk.rejected, (state: TInitialBasketState, action): void => {
        state.create.isLoading = false;
        state.create.isError = true;
        if (action.payload) {
          if (action.payload === 409) {
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
        }
      })
      .addCase(
        getOrderByUserInProgressThunk.fulfilled,
        (state: TInitialBasketState, action: PayloadAction<TOrder>): void => {
          state.basket = action.payload;
          state.fetchBasketOrder.isLoading = false;
          state.fetchBasketOrder.isError = false;
        }
      )
      .addCase(getOrderByUserInProgressThunk.pending, (state: TInitialBasketState): void => {
        state.fetchBasketOrder.isLoading = true;
        state.fetchBasketOrder.isError = false;
      })
      .addCase(getOrderByUserInProgressThunk.rejected, (state: TInitialBasketState): void => {
        state.fetchBasketOrder.isLoading = false;
        state.fetchBasketOrder.isError = true;
      })
      .addCase(deleteOrderItemThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.basket.items = state.basket.items.filter(
          (item: TOrderItem): boolean => item._id !== action.payload
        );
        state.deleteItem.isLoading = false;
        state.deleteItem.isError = false;
      })
      .addCase(deleteOrderItemThunk.pending, (state: TInitialBasketState): void => {
        state.deleteItem.isLoading = true;
        state.deleteItem.isError = false;
      })
      .addCase(deleteOrderItemThunk.rejected, (state: TInitialBasketState): void => {
        state.deleteItem.isLoading = false;
        state.deleteItem.isError = true;
        SHOW_ERROR('Ապրանքի ջնջման հետ կապված խնդիր է առաջացել');
      })
      .addCase(toOrderThunk.fulfilled, (state: TInitialBasketState): void => {
        state.basket = initialState.basket;
        state.toOrder.isLoading = false;
        state.toOrder.isError = false;
        SHOW_SUCCESS('Պատվերը հաջողությամբ հաստատվեց');
      })
      .addCase(toOrderThunk.pending, (state: TInitialBasketState): void => {
        state.toOrder.isLoading = true;
        state.toOrder.isError = false;
      })
      .addCase(toOrderThunk.rejected, (state: TInitialBasketState, action): void => {
        state.toOrder.isLoading = false;
        state.toOrder.isError = true;
        if (action.payload === 502) {
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
            isLoading: false,
          };
        }
      )
      .addCase(fetchAllOrdersThunk.pending, (state: TInitialBasketState): void => {
        state.orders.isLoading = true;
        state.orders.isError = false;
      })
      .addCase(fetchAllOrdersThunk.rejected, (state: TInitialBasketState): void => {
        state.orders = {
          total_items: 0,
          items: [],
          isError: true,
          isLoading: false,
        };
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
            isLoading: false,
          };
        }
      )
      .addCase(fetchDeliveredOrdersThunk.pending, (state: TInitialBasketState): void => {
        state.ordersHistory.isLoading = true;
        state.ordersHistory.isError = false;
      })
      .addCase(fetchDeliveredOrdersThunk.rejected, (state: TInitialBasketState): void => {
        state.ordersHistory = {
          total_items: 0,
          items: [],
          isError: true,
          isLoading: false,
        };
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
            isLoading: false,
          };
        }
      )
      .addCase(fetchOrdersByAuthorThunk.pending, (state: TInitialBasketState): void => {
        state.ordersHistory.isLoading = true;
        state.ordersHistory.isError = false;
      })
      .addCase(fetchOrdersByAuthorThunk.rejected, (state: TInitialBasketState): void => {
        state.ordersHistory = {
          total_items: 0,
          items: [],
          isError: true,
          isLoading: false,
        };
      })
      .addCase(changeOrderStatusThunk.fulfilled, (state: TInitialBasketState): void => {
        state.changeStatus.isLoading = false;
        state.changeStatus.isError = false;
        SHOW_SUCCESS('Պատվերի կարգավիճակը փոխվեց');
      })
      .addCase(changeOrderStatusThunk.pending, (state: TInitialBasketState): void => {
        state.changeStatus.isLoading = true;
        state.changeStatus.isError = false;
      })
      .addCase(changeOrderStatusThunk.rejected, (state: TInitialBasketState): void => {
        state.changeStatus.isLoading = false;
        state.changeStatus.isError = true;
      })
      .addCase(cancelOrderThunk.fulfilled, (state: TInitialBasketState): void => {
        state.cancelOrder.isLoading = false;
        state.cancelOrder.isError = false;
        SHOW_SUCCESS('Պատվերը հաջողությամբ չեղարկվեց');
      })
      .addCase(cancelOrderThunk.pending, (state: TInitialBasketState): void => {
        state.cancelOrder.isLoading = true;
        state.cancelOrder.isError = false;
      })
      .addCase(cancelOrderThunk.rejected, (state: TInitialBasketState): void => {
        state.cancelOrder.isLoading = false;
        state.cancelOrder.isError = true;
      })
      .addCase(deliverOrderThunk.fulfilled, (state: TInitialBasketState): void => {
        state.deliverOrder.isLoading = false;
        state.deliverOrder.isError = false;
        SHOW_SUCCESS('Պատվերը նշվեց որպես առաքված');
      })
      .addCase(deliverOrderThunk.pending, (state: TInitialBasketState): void => {
        state.deliverOrder.isLoading = true;
        state.deliverOrder.isError = false;
      })
      .addCase(deliverOrderThunk.rejected, (state: TInitialBasketState): void => {
        state.deliverOrder.isLoading = false;
        state.deliverOrder.isError = true;
      }),
});
export const orderReducer = orderSlice.reducer;
export const { changeForm, setProductId, setPackaging, updateItemCount, setNecessaryNotes } =
  orderSlice.actions;
