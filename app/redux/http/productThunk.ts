import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { FormikValues } from 'formik';

import { $authHost } from './index';
import {
  IFetchByCategoryOptions,
  ISearchProductOptions,
  TCreateItemAndNavigate,
  TDeleteItem,
  TErrorDataResponse,
  TFetchOptions,
  TItemsWithTotalLength,
  TProduct,
  TUpdateItem,
} from '../types';

export const fetchProductsThunk = createAsyncThunk(
  'fetch/products',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TProduct[]>>(
        `product/all?limit=${limit}&skip=${skip}`
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
export const fetchControlProductsThunk = createAsyncThunk(
  'fetchForControl/products',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TProduct[]>>(
        `product/all?limit=${limit}&skip=${skip}&title=${query}`
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
export const fetchControlNotActivatedProductsThunk = createAsyncThunk(
  'fetchForControl/NotActivatedProducts',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TProduct[]>>(
        `product/all?limit=${limit}&skip=${skip}&title=${query}&not-activated`
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
export const fetchProductThunk = createAsyncThunk(
  'fetch/product',
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.get<TProduct>(`product/${productId}`);
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
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
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
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
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
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
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
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const searchProductsThunk = createAsyncThunk(
  'search/products',
  async ({ page = 1, limit = 10, query }: ISearchProductOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TProduct[]>>(
        `product/search?limit=${limit}&skip=${skip}&title=${query}`
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
export const createProductThunk = createAsyncThunk(
  'create/product',
  async ({ formData, navigate }: TCreateItemAndNavigate<FormData>, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post('product/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('products-control');
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
export const createProductByDocumentThunk = createAsyncThunk(
  'createByDocument/product',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post('product/create/by-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
export const updateProductThunk = createAsyncThunk(
  'update/product',
  async ({ id, formData }: TUpdateItem<FormikValues>, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put(`product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
export const deleteProductThunk = createAsyncThunk(
  'delete/product',
  async ({ _id, navigate }: TDeleteItem, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.delete<string>(`product/${_id}`);
      navigate('products-control');
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
