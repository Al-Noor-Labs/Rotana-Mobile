import * as SecureStore from 'expo-secure-store';
import { User } from '../types/auth.types';

const KEYS = {
  ACCESS_TOKEN: 'rotana_access_token',
  REFRESH_TOKEN: 'rotana_refresh_token',
  USER: 'rotana_user',
} as const;

class SecureStorageService {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      console.log('[SECURE_STORAGE] Saving tokens...');
      console.log('[SECURE_STORAGE] Access token length:', accessToken?.length || 0);
      console.log('[SECURE_STORAGE] Refresh token length:', refreshToken?.length || 0);

      await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken);
      await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);

      console.log('[SECURE_STORAGE] Tokens saved successfully');
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
      console.log('[SECURE_STORAGE] Retrieved access token:', token ? `Present (${token.length} chars)` : 'NOT FOUND');
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
      console.log('[SECURE_STORAGE] Retrieved refresh token:', token ? `Present (${token.length} chars)` : 'NOT FOUND');
      return token;
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async deleteTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error deleting tokens:', error);
      throw error;
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userJson = await SecureStore.getItemAsync(KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async deleteUser(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.USER);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await Promise.all([this.deleteTokens(), this.deleteUser()]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}

export const secureStorage = new SecureStorageService();
