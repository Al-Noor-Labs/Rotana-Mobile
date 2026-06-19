import { apiClient } from './ApiClient';
import { secureStorage } from './SecureStorageService';
import { AuthResponse, RegisterRequest } from '../types/auth.types';

class AuthService {
  /**
   * Send OTP to phone number
   */
  async sendOTP(phoneNumber: string): Promise<void> {
    const response = await apiClient.post('/api/v1/auth/send-otp', {
      phoneNumber,
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to send OTP');
    }
  }

  /**
   * Verify OTP and get authentication tokens
   */
  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse['data']>('/api/v1/auth/verify-otp', {
      phoneNumber,
      otp,
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'OTP verification failed');
    }

    // Save tokens and user data
    if (response.data) {
      await secureStorage.saveTokens(response.data.accessToken, response.data.refreshToken);
      await secureStorage.saveUser(response.data.user);
      console.log('[AUTH] OTP verified - Tokens saved to secure storage');
    }

    return {
      success: true,
      data: response.data!,
    };
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('[AUTH_SERVICE] Attempting login with email:', email);
    const response = await apiClient.post<AuthResponse['data']>('/api/v1/auth/login', {
      email,
      password,
    });

    console.log('[AUTH_SERVICE] Login response:', {
      success: response.success,
      hasData: !!response.data,
      hasAccessToken: !!response.data?.accessToken,
      hasRefreshToken: !!response.data?.refreshToken,
      error: response.error?.message,
      errorCode: response.error?.code,
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Login failed');
    }

    // Save tokens and user data
    if (response.data) {
      console.log('[AUTH_SERVICE] Saving tokens...');
      console.log('[AUTH_SERVICE] Access token length:', response.data.accessToken?.length || 0);
      console.log('[AUTH_SERVICE] Refresh token length:', response.data.refreshToken?.length || 0);

      await secureStorage.saveTokens(response.data.accessToken, response.data.refreshToken);
      await secureStorage.saveUser(response.data.user);

      console.log('[AUTH] Login successful - Tokens saved to secure storage');
    }

    return {
      success: true,
      data: response.data!,
    };
  }

  /**
   * Register a new user
   */
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const body: RegisterRequest = { name, email, password };

    const response = await apiClient.post<AuthResponse['data']>('/api/v1/auth/register', body);

    if (!response.success) {
      throw new Error(response.error?.message || 'Registration failed');
    }

    // Save tokens and user data
    if (response.data) {
      await secureStorage.saveTokens(response.data.accessToken, response.data.refreshToken);
      await secureStorage.saveUser(response.data.user);
      console.log('[AUTH] Registration successful - Tokens saved to secure storage');
    }

    return {
      success: true,
      data: response.data!,
    };
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if needed
      // await apiClient.post('/api/v1/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }

    // Clear local storage
    await secureStorage.clearAll();
  }

  /**
   * Restore token from secure storage
   * Simply retrieves the token without making API calls
   */
  async restoreToken(): Promise<{ accessToken: string | null; refreshToken: string | null; user: any | null }> {
    try {
      const accessToken = await secureStorage.getAccessToken();
      const refreshToken = await secureStorage.getRefreshToken();
      const user = await secureStorage.getUser();

      if (!accessToken) {
        console.log('[AUTH_SERVICE] No access token found in storage');
        return { accessToken: null, refreshToken: null, user: null };
      }

      console.log('[AUTH_SERVICE] Tokens found in storage, restoring session');
      console.log('[AUTH_SERVICE] Access token:', accessToken ? `Present (${accessToken.length} chars)` : 'MISSING');
      console.log('[AUTH_SERVICE] Refresh token:', refreshToken ? `Present (${refreshToken.length} chars)` : 'MISSING');

      return { accessToken, refreshToken, user };
    } catch (error) {
      console.error('[AUTH_SERVICE] Error restoring token:', error);
      return { accessToken: null, refreshToken: null, user: null };
    }
  }
}

export const authService = new AuthService();
