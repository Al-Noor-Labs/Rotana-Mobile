import { apiClient } from './ApiClient';
import { secureStorage } from './SecureStorageService';

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  isActive?: boolean;
  createdAt?: string;
  children?: Category[];
}

class CategoriesService {
  async getCategories(): Promise<Category[]> {
    console.log('[CATEGORIES_SERVICE] Attempting to fetch categories from /api/v1/categories?limit=100');

    try {
      // Check token before making request
      const token = await secureStorage.getAccessToken();
      console.log('[CATEGORIES_SERVICE] Access token status:', token ? `Present (${token.length} chars)` : 'MISSING');

      const response = await apiClient.get<Category[]>('/api/v1/categories?limit=100');

      console.log('[CATEGORIES_SERVICE] API Response:', {
        success: response.success,
        count: response.data?.length || 0,
        error: response.error?.code,
      });

      if (!response.success) {
        const errorMsg = response.error?.message || 'Failed to fetch categories';
        const errorCode = response.error?.code;
        const errorDetails = response.error?.details;
        console.error('[CATEGORIES_SERVICE] API Error:', { code: errorCode, message: errorMsg, details: errorDetails });
        throw new Error(errorMsg);
      }

      const count = response.data?.length || 0;
      console.log('[CATEGORIES_SERVICE] Fetched successfully:', count, 'categories');

      // Log image URLs for debugging
      if (response.data) {
        console.log('[CATEGORIES_SERVICE] Category Images:');
        response.data.forEach((cat, idx) => {
          const type = cat.parentId ? 'SUB' : 'MAIN';
          console.log(`  [${idx + 1}] ${type} - ${cat.name}: ${cat.imageUrl || 'NO IMAGE'}`);
        });
      }

      return response.data || [];
    } catch (error) {
      console.error('[CATEGORIES_SERVICE] Error:', error);
      throw error;
    }
  }
}

export const categoriesService = new CategoriesService();
