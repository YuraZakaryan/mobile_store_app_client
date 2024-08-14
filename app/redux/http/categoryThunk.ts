import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { FormikValues } from 'formik'

import {
  TCategory,
  TCreateItemAndNavigate,
  TDeleteItem,
  TFetchOptions,
  TItemsWithTotalLength,
  TUpdateItem,
} from '../types'
import { $authHost } from './index'

export const fetchCategoriesThunk = createAsyncThunk(
  'fetch/categories',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TCategory[]>>(
        `category/all?limit=${limit}&skip=${skip}`
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
export const fetchControlCategoriesThunk = createAsyncThunk(
  'fetchForControl/categories',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TCategory[]>>(
        `category/all?limit=${limit}&skip=${skip}&title=${query}`
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
export const createCategoryThunk = createAsyncThunk(
  'create/category',
  async ({ formData, navigate }: TCreateItemAndNavigate<FormData>, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TCategory>('category/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('categories-control');
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
export const updateCategoryThunk = createAsyncThunk(
  'update/category',
  async ({ id, formData }: TUpdateItem<FormikValues>, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put<TCategory>(`category/${id}`, formData, {
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
export const updateProductsCategoryByKeywordThunk = createAsyncThunk(
  'update/productsCategoryByKeyword',
  async ({ id, keyword }: { id: string; keyword: string }, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put(
        `category/update-products-category-by-keyword/${id}`,
        {
          keyword,
        },
        { timeout: 0 }
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
export const deleteCategoryThunk = createAsyncThunk(
  'delete/category',
  async ({ _id, navigate }: TDeleteItem, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.delete<string>(`category/${_id}`);
      navigate('categories-control');
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
