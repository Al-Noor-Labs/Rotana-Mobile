import { apiClient } from './ApiClient';

export interface CartItemRequest {
  variantId: string;
  quantity: number;
}

export interface CartProductResponse {
  id: string;
  name: string;
  images: string[];
  slug: string | null;
}

export interface CartVariantResponse {
  id: string;
  productId: string;
  sku: string;
  barcode: string;
  hsnCode: string | null;
  name: string;
  unitValue: string;
  unitLabel: string;
  costPrice: string;
  sellingPrice: string;
  mrp: string;
  wholesalePrice: string | null;
  taxRate: string;
  taxInclusive: boolean;
  specialPrice: string | null;
  specialPriceFrom: string | null;
  specialPriceTo: string | null;
  minOrderQty: number;
  maxOrderQty: number | null;
  weightGrams: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  countryOfOrigin: string | null;
  shelfLifeDays: number | null;
  minRemainingShelfDays: number | null;
  storageTemp: string | null;
  fssaiLicenseNo: string | null;
  reorderLevel: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  product: CartProductResponse;
  bulkOrderConfig: any;
}

export interface CartItemResponse {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  variant: CartVariantResponse;
}

export interface CartApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class CartService {
  async addToCart(variantId: string, quantity = 1): Promise<CartApiResponse<CartItemResponse>> {
    console.log('[CART] addToCart', { variantId, quantity });
    const response = await apiClient.post<CartItemResponse>('/api/v1/cart', {
      variantId,
      quantity,
    });

    if (!response.success) {
      console.error('[CART] addToCart failed', response.error);
    } else {
      console.log('[CART] addToCart succeeded', response.data);
    }

    return response;
  }

  async getCartItems(): Promise<CartItemResponse[]> {
    console.log('[CART] Fetching cart items from /api/v1/cart');
    const response = await apiClient.get<CartItemResponse[]>('/api/v1/cart');

    if (!response.success) {
      console.error('[CART] getCartItems failed', response.error);
      throw new Error(response.error?.message || 'Failed to fetch cart items');
    }

    return response.data || [];
  }

  async removeFromCart(variantId: string): Promise<CartApiResponse<null>> {
    console.log('[CART] removeFromCart', { variantId });
    const response = await apiClient.delete<null>(`/api/v1/cart/${variantId}`);

    if (!response.success) {
      console.error('[CART] removeFromCart failed', response.error);
    } else {
      console.log('[CART] removeFromCart succeeded', response.data);
    }

    return response;
  }
}

export const cartService = new CartService();
