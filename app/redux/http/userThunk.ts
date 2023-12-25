import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { FormikValues } from 'formik';

import { $authHost } from './index';
import { TInitialLoginFormValue } from '../../components/screens/auth/types';
import { SecureStoreService } from '../../services';
import {
  TFetchOptions,
  TItemsWithTotalLength,
  TPayloadActionUser,
  TUpdateItem,
  TUser,
} from '../types';

export const loginThunk = createAsyncThunk(
  'login/user',
  async (formData: TInitialLoginFormValue, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TPayloadActionUser>('auth/login', formData);
      await SecureStoreService.saveAccessToken(data.tokens.access_token);
      await SecureStoreService.saveRefreshToken(data.tokens.refresh_token);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to login');
    }
  }
);
export const registrationThunk = createAsyncThunk(
  'registration/user',
  async (formData: FormikValues, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TPayloadActionUser>('auth/registration', {
        ...formData,
        role: 'USER',
        confirmed: false,
      });
      await SecureStoreService.saveAccessToken(data.tokens.access_token);
      await SecureStoreService.saveRefreshToken(data.tokens.refresh_token);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed registration');
    }
  }
);
export const fetchUsersThunk = createAsyncThunk(
  'fetch/users',
  async ({ page = 1, limit = 5 }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TUser[]>>(
        `user/all?limit=${limit}&skip=${skip}&confirmed=true`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const fetchUnconfirmedUsers = createAsyncThunk(
  'fetchRegistrationRequests/users',
  async ({ page = 1, limit = 5 }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TUser[]>>(
        `user/all?limit=${limit}&skip=${skip}&confirmed=false`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to fetch unconfirmed users');
    }
  }
);
export const updateUserThunk = createAsyncThunk(
  'update/user',
  async ({ id, formData }: TUpdateItem<FormikValues>, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put<TUser>(`user/${id}`, formData);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const createUserThunk = createAsyncThunk(
  'create/user',
  async (formData: FormikValues, { rejectWithValue }) => {
    console.log(formData);
    try {
      const { data } = await $authHost.post<TPayloadActionUser>('auth/registration', {
        ...formData,
        confirmed: true,
      });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);
export const fetchMe = createAsyncThunk('me/user', async () => {
  const { data } = await $authHost.get('auth/me');
  return data;
});
