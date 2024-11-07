import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { FormikValues } from 'formik';

import { TInitialLoginFormValue } from '../../components/screens/auth/types';
import { SecureStoreService } from '../../services';
import {
  EPriceType,
  TCounterParty,
  TCreateItemAndNavigate,
  TDeleteItem,
  TErrorDataResponse,
  TFetchOptions,
  TItemsWithTotalLength,
  TOtpData,
  TPayloadActionUser,
  TUpdateItem,
  TUser,
  TUserCreateOrUpdateErrorResponseMessage,
} from '../types';
import { $authHost } from './index';

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
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        const data: TErrorDataResponse = error.response.data as TErrorDataResponse;
        return rejectWithValue(data.message);
      }
    }
  }
);
export const registrationThunk = createAsyncThunk(
  'registration/user',
  async (formData: FormikValues, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TPayloadActionUser>('auth/registration', {
        ...formData,
        priceType: EPriceType.RETAIL,
        discountPercent: 0,
        role: 'USER',
        confirmed: false,
      });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        const responseData: TErrorDataResponse = error.response.data as TErrorDataResponse;
        return rejectWithValue(responseData.message);
      }
    }
  }
);
export const fetchUsersThunk = createAsyncThunk(
  'fetch/users',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TUser[]>>(
        `user/all?limit=${limit}&skip=${skip}&confirmed=true&name=${query}&banned=false`
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

export const fetchUnconfirmedUsers = createAsyncThunk(
  'fetchRegistrationRequests/users',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TUser[]>>(
        `user/all?limit=${limit}&skip=${skip}&name=${query}&confirmed=false`
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
export const fetchBannedUsers = createAsyncThunk(
  'fetchBanned/users',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TUser[]>>(
        `user/all?limit=${limit}&skip=${skip}&name=${query}&banned=true`
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

export const fetchCounterPartiesThunk = createAsyncThunk(
  'fetch/counterParties',
  async ({ page = 1, limit = 5, query = '' }: TFetchOptions, { rejectWithValue }) => {
    const skip: number = Math.max(page - 1, 0) * limit;

    try {
      const { data } = await $authHost.get<TItemsWithTotalLength<TCounterParty[]>>(
        `user/counterparties/all?limit=${limit}&skip=${skip}&name=${query}`
      );
      return { ...data, page };
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

export const sendOtpToMailThunk = createAsyncThunk(
  'sendOtp/user',
  async (mail: string, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.put<TOtpData>(`user/mail/otp`, { mail });
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
export const confirmOtpThunk = createAsyncThunk(
  'confirmOtp/user',
  async ({ mail, otp }: { mail: string; otp: string }, { rejectWithValue }) => {
    try {
      const { data } = await $authHost.post<TOtpData>(`user/confirm/otp`, { mail, otp });
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
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
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

      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        const responseData = error.response.data as TUserCreateOrUpdateErrorResponseMessage;
        return rejectWithValue(responseData.message);
      }
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
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        const responseData = error.response.data as TUserCreateOrUpdateErrorResponseMessage;
        return rejectWithValue(responseData.message);
      }
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
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
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
    if (!error.response) {
      return rejectWithValue('NetworkError');
    } else {
      return rejectWithValue(error.response.status);
    }
  }
});
export const fetchUser = createAsyncThunk('fetch/user', async (_, { rejectWithValue }) => {
  try {
    const { data } = await $authHost.get('auth/me');
    return data;
  } catch (err) {
    const error = err as AxiosError;
    if (!error.response) {
      return rejectWithValue('NetworkError');
    } else {
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
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
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
      if (!error.response) {
        return rejectWithValue('NetworkError');
      } else {
        return rejectWithValue(error.response.status);
      }
    }
  }
);
