import { apiClient } from './ApiClient';

export interface Category {
  id: string;
  name: string;
  slug?: string;
}

export interface ProductVariant {
  id: string;
  unitValue: number;
  unitLabel: string;
  sellingPrice: number;
  mrp: number;
}

export interface InventoryBalance {
  available: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  categoryId: string;
  category: Category;
  variants: ProductVariant[];
  inventoryBalances: InventoryBalance[];
}

class ProductsService {
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/api/v1/products?limit=100');

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch products');
    }

    return response.data || [];
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    console.log('[PRODUCTS_SERVICE] Fetching products for category:', categoryId);

    try {
      const response = await apiClient.get<any>(
        `/api/v1/products?categoryId=${categoryId}&search=&page=1&limit=100`
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch products');
      }

      // Handle paginated response format
      const products = response.data?.products || response.data || [];
      const count = Array.isArray(products) ? products.length : 0;
      console.log('[PRODUCTS_SERVICE] Fetched:', count, 'products for category', categoryId);
      return products;
    } catch (error) {
      console.error('[PRODUCTS_SERVICE] Error fetching products:', error);
      throw error;
    }
  }
}

export const productsService = new ProductsService();
