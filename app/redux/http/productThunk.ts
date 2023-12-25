import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { FormikValues } from 'formik';

import { $authHost } from './index';
import {
  TCategory,
  TDeleteItem,
  TFetchOptions,
  TItemsWithTotalLength,
  TProduct,
  TUpdateItem,
} from '../types';

export const fetchProductsThunk = createAsyncThunk(
  'fetch/products',
  async ({ page = 1, limit = 5 }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TProduct[]>>(
        `product/all?limit=${limit}&skip=${skip}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);
export const createProductThunk = createAsyncThunk(
  'create/product',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TCategory>('product/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to create product');
    }
  }
);
export const updateProductThunk = createAsyncThunk(
  'update/product',
  async ({ id, formData }: TUpdateItem<FormikValues>, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put<TProduct>(`product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to create product');
    }
  }
);
export const deleteProductThunk = createAsyncThunk(
  'delete/product',
  async ({ _id, navigate }: TDeleteItem, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.delete<string>(`product/${_id}`);
      navigate('products-control');
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to create product');
    }
  }
);
