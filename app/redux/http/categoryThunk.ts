import { ParamListBase } from '@react-navigation/native';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { FormikValues } from 'formik';

import { $authHost } from './index';
import {
  TCategory,
  TDeleteItem,
  TFetchOptions,
  TItemsWithTotalLength,
  TUpdateItem,
} from '../types';

export const fetchCategoriesThunk = createAsyncThunk(
  'fetch/categories',
  async ({ page = 1, limit = 5 }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TCategory[]>>(
        `category/all?limit=${limit}&skip=${skip}`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);
export const createCategoryThunk = createAsyncThunk(
  'create/category',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TCategory>('category/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to create category');
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
      return rejectWithValue(error.message || 'Failed to create category');
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
      return rejectWithValue(error.message || 'Failed to create category');
    }
  }
);