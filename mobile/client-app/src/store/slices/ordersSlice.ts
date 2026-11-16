import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrdersState } from '../../types/orders.types';

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
      state.error = null;
    },
    setCurrentOrder(state, action: PayloadAction<Order | null>) {
      state.currentOrder = action.payload;
    },
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
      state.currentOrder = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
  },
});

export const {
  setOrders,
  setCurrentOrder,
  addOrder,
  setLoading,
  setError,
  clearError,
  clearCurrentOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;
