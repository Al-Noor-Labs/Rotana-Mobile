import { secureStorage } from './SecureStorageService';

const API_BASE_URL = 'https://rotana-web-app.vercel.app';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class ApiClient {
  private baseUrl: string;
  private authFailureHandler?: () => void;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setAuthFailureHandler(handler: () => void) {
    this.authFailureHandler = handler;
  }

  private async addAuthHeader(headers: HeadersInit = {}): Promise<Record<string, string>> {
    const token = await secureStorage.getAccessToken();
    const headersObj = typeof headers === 'object' && !Array.isArray(headers)
      ? (headers as Record<string, string>)
      : {};

    if (token) {
      return {
        ...headersObj,
        Authorization: `Bearer ${token}`,
      };
    }
    return headersObj;
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      console.log('[API] Attempting to refresh access token...');
      const refreshToken = await secureStorage.getRefreshToken();

      if (!refreshToken) {
        console.warn('[API] No refresh token available');
        this.authFailureHandler?.();
        return false;
      }

      console.log('[API] Refresh token found, calling /api/v1/auth/refresh');
      console.log('[API] Refresh token preview:', refreshToken.substring(0, 30) + '...');

      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      console.log('[API] Refresh response status:', response.status);
      const json: any = await response.json();
      console.log('[API] Refresh response:', JSON.stringify(json, null, 2));

      if (json.success && json.data?.accessToken) {
        await secureStorage.saveTokens(json.data.accessToken, json.data.refreshToken || refreshToken);
        console.log('[API] Token refreshed successfully');
        return true;
      } else {
        console.warn('[API] Token refresh failed:', json.error?.message);
        // Clear invalid tokens and user info so the session is fully reset
        await secureStorage.deleteTokens();
        await secureStorage.deleteUser();
        console.log('[API] Tokens and user cleared - user needs to log in again');
        this.authFailureHandler?.();
        return false;
      }
    } catch (error) {
      console.error('[API] Token refresh error:', error);
      this.authFailureHandler?.();
      return false;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      const headers = await this.addAuthHeader({
        'Content-Type': 'application/json',
        ...options.headers,
      } as Record<string, string>);

      const token = await secureStorage.getAccessToken();
      const method = options.method || 'GET';

      console.log(`[API] ${method} ${endpoint}`);
      if (method !== 'GET') {
        console.log('[API] Request body:', options.body);
      }
      console.log('[API] Auth header present:', !!headers.Authorization);
      console.log('[API] Token available:', token ? `Yes (${token.length} chars)` : 'NO - Will get 401!');

      const response = await fetch(url, {
        ...options,
        headers: headers as HeadersInit,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const json: ApiResponse<T> = await response.json();

      console.log('[API] Response status:', response.status);
      console.log('[API] Response success:', json.success);
      if (!json.success) {
        console.log('[API] Error code:', json.error?.code);
        console.log('[API] Error message:', json.error?.message);
      }

      if (response.status === 401) {
        console.warn('[API] Unauthorized - Status 401');
        console.log('[API] Response:', json);

        // Try to refresh token and retry
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          console.log('[API] Retrying request after token refresh...');
          return this.request<T>(endpoint, options);
        }

        // If refresh failed, clear auth state
        this.authFailureHandler?.();
        return {
          success: false,
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Session expired',
          },
        } as ApiResponse<T>;
      } else if (response.status === 403) {
        console.warn('[API] Forbidden - Status 403 (Permission Denied)');
        console.log('[API] Response:', json);
        // Don't retry - this is a permission issue
      }

      return json;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  async patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
