import axios, { AxiosError } from 'axios';

import { SecureStoreService } from '../../services';
import { API_URL } from '../../utils/constants';
import { TPayloadActionUser } from '../types';

export const $authHost = axios.create({
  baseURL: `${API_URL || 'http:localhost:5000'}/api/`,
  timeout: 10000,
});

$authHost.interceptors.request.use(
  async (config) => {
    try {
      const access_token = await SecureStoreService.getAccessToken();
      if (access_token) {
        config.headers.set({
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        });
      }
      return config;
    } catch (err) {
      return config;
    }
  },
  (err) => Promise.reject(err)
);

$authHost.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh_token = await SecureStoreService.getRefreshToken();
      if (refresh_token) {
        try {
          const { data } = await $authHost.put<TPayloadActionUser>('auth/token/refresh', {
            refresh_token,
          });
          await SecureStoreService.saveAccessToken(data.tokens.access_token);
          await SecureStoreService.saveRefreshToken(data.tokens.refresh_token);
          $authHost.defaults.headers['Authorization'] = `Bearer ${data.tokens.access_token}`;
          return $authHost(originalRequest);
        } catch (e) {
          const error = e as AxiosError;
          if (error.response) {
            console.log(error.response);
          }
        }
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
