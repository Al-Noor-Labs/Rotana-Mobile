import { apiClient } from './ApiClient';
import { secureStorage } from './SecureStorageService';

export const testOrdersAPI = async () => {
  try {
    console.log('[TEST] Starting Orders API test...');

    // Check token
    const token = await secureStorage.getAccessToken();
    console.log('[TEST] Token exists:', !!token);
    if (token) {
      console.log('[TEST] Token preview:', token.substring(0, 30) + '...');
    }

    // Try to get orders
    console.log('[TEST] Calling GET /api/v1/orders...');
    const response = await apiClient.get('/api/v1/orders');
    console.log('[TEST] Response:', response);

    if (response.success) {
      console.log('[TEST] Orders fetched successfully:', response.data);
    } else {
      console.log('[TEST] Error from API:', response.error);
    }
  } catch (error) {
    console.error('[TEST] API test error:', error);
  }
};
