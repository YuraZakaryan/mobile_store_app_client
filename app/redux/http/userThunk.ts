import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { FormikValues } from 'formik';

import { $authHost } from './index';
import { TInitialLoginFormValue } from '../../components/screens/auth/types';
import { TInitialUserCreateEditFormValue } from '../../components/screens/profile/user-create-edit/types';
import { SecureStoreService } from '../../services';
import {
  TCreateItemAndNavigate,
  TDeleteItem,
  TFetchOptions,
  TItemsWithTotalLength,
  TOtpData,
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
        `user/all?limit=${limit}&skip=${skip}&confirmed=true&banned=false`
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
export const fetchBannedUsers = createAsyncThunk(
  'fetchBanned/users',
  async ({ page = 1, limit = 5 }: TFetchOptions, { rejectWithValue }) => {
    const skip = (page - 1) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TUser[]>>(
        `user/all?limit=${limit}&skip=${skip}&banned=true`
      );
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to fetch banned users');
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
export const sendOtpToMailThunk = createAsyncThunk(
  'sendOtp/user',
  async (mail: string, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put<TOtpData>(`user/mail/otp`, { mail });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const confirmOtpThunk = createAsyncThunk(
  'confirmOtp/user',
  async ({ mail, otp }: { mail: string; otp: string }, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TOtpData>(`user/confirm/otp`, { mail, otp });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const resetPasswordThunk = createAsyncThunk(
  'resetPassword/user',
  async (
    {
      mail,
      newPassword,
      otp,
      navigate,
    }: { mail: string; newPassword: string; otp: string; navigate: (navigateTo: string) => void },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await $authHost.put<TOtpData>(`user/reset/password`, {
        mail,
        newPassword,
        otp,
      });
      navigate('auth-screen');
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const createUserThunk = createAsyncThunk(
  'create/user',
  async ({ formData, navigate }: TCreateItemAndNavigate<FormikValues>, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TPayloadActionUser>('auth/registration', {
        ...formData,
        confirmed: true,
      });
      navigate('users-control');
      return data;
    } catch (err) {
      const error = err as AxiosError;
      console.log(error.response);
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);
export const updatePasswordThunk = createAsyncThunk(
  'updatePassword/user',
  async ({ id, formData }: TUpdateItem<FormikValues>, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put<string>(`user/update/password/${id}`, formData);
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
export const fetchMe = createAsyncThunk('me/user', async (_, { rejectWithValue }) => {
  try {
    const { data } = await $authHost.get('auth/me');
    return data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      return rejectWithValue(error.response.status);
    }
  }
});
export const toggleBanThunk = createAsyncThunk(
  'toggleBan/user',
  async ({ _id, navigate }: TDeleteItem, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put<{ message: string }>(`user/ban/${_id}`);
      navigate('users-control');
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to toggle bun');
    }
  }
);
export const cancelUserThunk = createAsyncThunk(
  'cancel/user',
  async ({ _id, navigate }: TDeleteItem, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.delete<string>(`user/${_id}`);
      navigate('users-control');
      return data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.message || 'Failed to cancel user');
    }
  }
);
