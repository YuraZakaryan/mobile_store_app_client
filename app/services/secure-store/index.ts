import * as SecureStore from 'expo-secure-store';

export class SecureStoreService {
  static access_token = 'access_token';
  static refresh_token = 'refresh_token';

  static async saveAccessToken(token: string) {
    return await SecureStore.setItemAsync(this.access_token, token);
  }

  static async saveRefreshToken(token: string) {
    return await SecureStore.setItemAsync(this.refresh_token, token);
  }

  static async getAccessToken() {
    return await SecureStore.getItemAsync(this.access_token);
  }

  static async getRefreshToken() {
    return await SecureStore.getItemAsync(this.refresh_token);
  }

  static async deleteAccessToken() {
    return await SecureStore.deleteItemAsync(this.access_token);
  }

  static async deleteRefreshToken() {
    return await SecureStore.deleteItemAsync(this.refresh_token);
  }
}
