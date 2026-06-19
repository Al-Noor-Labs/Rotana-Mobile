import { apiClient } from './ApiClient';
import { Order, CreateOrderRequest, CreateOrderResponse } from '../types/orders.types';

class OrdersService {
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    console.log('[ORDERS] Creating order with request:', JSON.stringify(request, null, 2));
    console.log('[ORDERS] Request items:', request.items.map(i => ({
      variantId: i.variantId,
      quantity: i.quantity,
      price: i.price
    })));

    const response = await apiClient.post<CreateOrderResponse>('/api/v1/orders', request);

    console.log('[ORDERS] Full API Response:', JSON.stringify(response, null, 2));

    if (!response.success || !response.data) {
      const errorMsg = response.error?.message || 'Failed to create order';
      const errorDetails = response.error?.details;
      console.error('[ORDERS] Error message:', errorMsg);
      console.error('[ORDERS] Error code:', response.error?.code);
      console.error('[ORDERS] Error details:', errorDetails);
      throw new Error(errorMsg);
    }

    return response.data.order;
  }

  async getOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/api/v1/orders');

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch orders');
    }

    return response.data || [];
  }

  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/api/v1/orders/${orderId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to fetch order');
    }

    return response.data;
  }
}

export const ordersService = new OrdersService();
