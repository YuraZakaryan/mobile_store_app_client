import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { $authHost } from './index';
import {
  IFetchByAuthorOptions,
  TFetchOptions,
  TItemsWithTotalLength,
  TNewItemForm,
} from '../types';
import { EOrderStatus, TOrder } from '../types/order';

export const createOrAddOrderThunk = createAsyncThunk(
  'createOrAdd/order',
  async (formData: TNewItemForm, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post('order', formData);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const getOrderByUserInProgressThunk = createAsyncThunk(
  ' getByUser/order',
  async (_id: string, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.get<TOrder>(`order/in-progress/${_id}`);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to get order by user');
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
      return rejectWithValue(error.message || 'Failed to delete order item');
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
      return rejectWithValue(error.message || 'Failed to delete order item');
    }
  }
);
export const fetchDeliveredOrdersThunk = createAsyncThunk(
  'fetchDelivered/order',
  async ({ page = 1, limit = 5 }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TOrder[]>>(
        `order/delivered?status=${skip}&limit=${limit}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to fetch all orders by status');
    }
  }
);
export const fetchAllOrdersThunk = createAsyncThunk(
  'fetchAllOrders/order',
  async ({ page = 1, limit = 5 }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TOrder[]>>(
        `order/all?limit=${limit}&skip=${skip}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to fetch all orders');
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
      return rejectWithValue(error.message || 'Failed to fetch orders by author id');
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
    }: { _id: string; status: EOrderStatus; navigate: (route: string) => void; navigateTo: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await $authHost.put<TOrder>(`order/status/${_id}`, { status });
      navigate(navigateTo);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to change order status');
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
      return rejectWithValue(error.message || 'Failed to change order status');
    }
  }
);
export const deliverOrderThunk = createAsyncThunk(
  'deliver/order',
  async (
    { _id, navigate }: { _id: string; navigate: (route: string) => void },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await $authHost.put<TOrder>(`order/status/${_id}`, {
        status: EOrderStatus.DELIVERED,
      });
      navigate('orders-control');
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to change order status');
    }
  }
);