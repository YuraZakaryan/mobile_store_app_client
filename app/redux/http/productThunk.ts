import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { FormikValues } from 'formik';

import { $authHost } from './index';
import {
  IFetchByCategoryOptions,
  ISearchProductOptions,
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
export const fetchDiscountedProductsThunk = createAsyncThunk(
  'fetchDiscounted/products',
  async ({ page = 1, limit = 5 }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TProduct[]>>(
        `product/all?limit=${limit}&skip=${skip}&discount=true`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to fetch discounted products');
    }
  }
);
export const fetchProductsForHomeCategoryThunk = createAsyncThunk(
  'fetchForHomeCategory/products',
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
export const fetchDiscountedProductsForHomeCategoryThunk = createAsyncThunk(
  'fetchDiscountedForHomeCategory/products',
  async ({ page = 1, limit = 5 }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TProduct[]>>(
        `product/all?limit=${limit}&skip=${skip}&discount=true`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to fetch discounted products');
    }
  }
);
export const fetchProductsByCategoryThunk = createAsyncThunk(
  'fetchByCategory/products',
  async ({ page = 1, limit = 10, category }: IFetchByCategoryOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TProduct[]>>(
        `product/all?limit=${limit}&skip=${skip}&category=${category}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to fetch products by category');
    }
  }
);
export const searchProductsThunk = createAsyncThunk(
  'search/products',
  async ({ page = 1, limit = 10, query }: ISearchProductOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TProduct[]>>(
        `product/search?limit=${limit}&skip=${skip}&title=${query}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to search product(s)');
    }
  }
);
export const createProductThunk = createAsyncThunk(
  'create/product',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TProduct>('product/create', formData, {
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
