export interface CartItem {
  variantId: string;
  quantity: number;
  price: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  gst: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  paymentMethod: string;
  orderType?: string; // B2C_ONLINE, B2C_STORE, etc. For customers: defaults to B2C_ONLINE
  customerId?: string; // Auto-set by backend for CUSTOMER role
  sourceLocationId?: string; // Defaults to primary warehouse for customers
  deliveryAddressId?: string;
  discountAmount?: number; // Forced to 0 for customers
  deliveryCharge?: number;
  couponCode?: string;
  loyaltyPointsToRedeem?: number;
}

export interface CreateOrderResponse {
  success: boolean;
  data?: {
    order: Order;
    orderId: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}
