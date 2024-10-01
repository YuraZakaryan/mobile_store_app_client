import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  IFetchByAuthorOptions,
  INewItemFormForStock,
  TErrorDataResponse,
  TFetchOptions,
  TItemsWithTotalLength,
  TNewItemForm,
  TProduct,
} from '../types';
import {
  EOrderStatus,
  IAdminOrderWithIsEdit,
  TAdminOrder,
  TOrder,
  TOrderItem,
} from '../types/order';
import { $authHost } from './index';

export const createOrAddOrderThunk = createAsyncThunk(
  'createOrAdd/order',
  async (formData: TNewItemForm, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TProduct>('order', formData);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const getOrderByUserInProgressThunk = createAsyncThunk(
  'getByUser/order',
  async (_id: string, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.get<TOrder>(`order/in-progress/${_id}`);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const deleteOrderItemThunk = createAsyncThunk(
  'delete/orderItem',
  async (_id: string, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.delete<string>(`order/item/${_id}`);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const deleteAdminOrderItemThunk = createAsyncThunk(
  'delete/orderAdminItem',
  async (_id: string, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.delete<string>(`order/stock/item/${_id}`);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const toOrderThunk = createAsyncThunk(
  'toOrder/order',
  async (basket: TOrder, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put<TOrder>(`order/to-order/${basket._id}`, {
        packaging: basket.packaging,
        necessaryNotes: basket.necessaryNotes,
        items: basket.items,
      });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const fetchDeliveredOrdersThunk = createAsyncThunk(
  'fetchDelivered/order',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TOrder[]>>(
        `order/history?skip=${skip}&limit=${limit}&name=${query}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const fetchAllOrdersThunk = createAsyncThunk(
  'fetchAllOrders/order',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TOrder[]>>(
        `order/all?limit=${limit}&skip=${skip}&name=${query}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const getOneAdminOrderThunk = createAsyncThunk(
  'getOneAdmin/order',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.get<TAdminOrder>(`order/stock/${orderId}`);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const fetchOrdersByAuthorThunk = createAsyncThunk(
  'fetchOrdersByAuthor/order',
  async ({ page = 1, limit = 5, authorId }: IFetchByAuthorOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TOrder[]>>(
        `order/author/${authorId}?limit=${limit}&skip=${skip}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const changeOrderStatusThunk = createAsyncThunk(
  'status/order',
  async (
    {
      _id,
      status,
      navigateTo,
      navigate,
      items,
    }: {
      _id: string;
      status: EOrderStatus;
      navigate: (route: string) => void;
      navigateTo: string;
      items: TOrderItem[];
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await $authHost.put<TOrder>(`order/status/${_id}`, {
        status,
        items,
      });
      navigate(navigateTo);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const cancelOrderThunk = createAsyncThunk(
  'cancel/order',
  async (
    { _id, navigate }: { _id: string; navigate: (route: string) => void },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await $authHost.put<TOrder>(`order/status/${_id}`, {
        status: EOrderStatus.ACCEPTED,
      });
      navigate('orders-completed');
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const deliverOrderThunk = createAsyncThunk(
  'deliver/order',
  async (
    {
      _id,
      navigate,
      items,
    }: { _id: string; navigate: (route: string) => void; items: TOrderItem[] },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await $authHost.put<TOrder>(`order/status/${_id}`, {
        status: EOrderStatus.DELIVERED,
        items,
      });
      navigate('orders-control');
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const getProductsWithStocksThunk = createAsyncThunk(
  'getStocks/order',
  async (ids: string[], { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post('product/stocks/withCount', { ids });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const fetchAdminActiveOrdersThunk = createAsyncThunk(
  'fetchAdminActive/orders',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;
    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TAdminOrder[]>>(
        `order/stock/all?status=inProgress&limit=${limit}&skip=${skip}&name=${query}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;

      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const fetchAdminHistoryOrdersThunk = createAsyncThunk(
  'fetchAdminHistory/orders',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TAdminOrder[]>>(
        `order/stock/all?status=confirmed&limit=${limit}&skip=${skip}&name=${query}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const createEmptyAdminOrderThunk = createAsyncThunk(
  'adminEmpty/order',
  async (_: void, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post('order/stock');
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const updateAdminOrderThunk = createAsyncThunk(
  'updateAdmin/order',
  async (adminOrder: IAdminOrderWithIsEdit, { rejectWithValue }) => {
    const { _id } = adminOrder;
    try {
      const { data } = await $authHost.put(`order/stock/${_id}`, adminOrder);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);

export const confirmAdminOrderThunk = createAsyncThunk(
  'confirmAdmin/order',
  async (adminOrder: TAdminOrder, { rejectWithValue }) => {
    const { _id, counterpartyId, items } = adminOrder;
    try {
      const { data } = await $authHost.post('order/stock/confirm-order', {
        orderId: _id,
        counterpartyId,
        items,
      });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        const data: TErrorDataResponse = error.response.data as TErrorDataResponse;
        return rejectWithValue(data.message);
      }
    }
  }
);

export const addItemToAdminBasketThunk = createAsyncThunk(
  'addItem/stockOrder',
  async (newItem: INewItemFormForStock, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put('order/stock/add', newItem);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
