import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cartService, CartItemResponse } from '../../services/CartService';
import type { RootState } from '../store';

const CART_STALE_MS = 60_000;

export interface CartState {
  items: CartItemResponse[];
  quantities: Record<string, number>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetchedAt: number | null;
  removeBackup: Record<string, CartItemResponse>;
}

const initialState: CartState = {
  items: [],
  quantities: {},
  status: 'idle',
  error: null,
  lastFetchedAt: null,
  removeBackup: {},
};

const buildQuantities = (items: CartItemResponse[]) =>
  items.reduce<Record<string, number>>((acc, item) => {
    acc[item.variantId] = item.quantity;
    return acc;
  }, {});

export const fetchCart = createAsyncThunk<CartItemResponse[], void, { rejectValue: string; state: RootState }>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCartItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch cart';
      return rejectWithValue(message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState().cart;
      if (state.status === 'loading') return false;
      const now = Date.now();
      const isFresh = state.lastFetchedAt !== null && now - state.lastFetchedAt < CART_STALE_MS;
      return !isFresh;
    },
  }
);

export const fetchCartIfNeeded = () => (dispatch: any, getState: () => RootState) => {
  const state = getState().cart;
  const now = Date.now();
  const needsFetch =
    state.status !== 'loading' &&
    (state.lastFetchedAt === null || now - state.lastFetchedAt >= CART_STALE_MS || state.items.length === 0);

  if (!needsFetch) {
    return;
  }

  return dispatch(fetchCart());
};

export const addToCart = createAsyncThunk<
  CartItemResponse,
  { variantId: string; quantity: number },
  { rejectValue: string }
>(
  'cart/addToCart',
  async ({ variantId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(variantId, quantity);
      if (!response.success || !response.data) {
        return rejectWithValue(response.error?.message || 'Failed to add item to cart');
      }
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add item to cart';
      return rejectWithValue(message);
    }
  }
);

export const removeFromCart = createAsyncThunk<string, string, { rejectValue: string }>(
  'cart/removeFromCart',
  async (variantId, { rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(variantId);
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to remove item from cart');
      }
      return variantId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove item from cart';
      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    incrementQuantity: (state, action: PayloadAction<{ variantId: string; quantity: number }>) => {
      const { variantId, quantity } = action.payload;
      state.quantities[variantId] = (state.quantities[variantId] ?? 0) + quantity;
    },
    setQuantities: (state, action: PayloadAction<Record<string, number>>) => {
      state.quantities = action.payload;
    },
    mergeQuantities: (state, action: PayloadAction<Array<{ variantId: string; quantity: number }>>) => {
      action.payload.forEach(({ variantId, quantity }) => {
        state.quantities[variantId] = (state.quantities[variantId] ?? 0) + quantity;
      });
    },
    clearCart: (state) => {
      state.items = [];
      state.quantities = {};
      state.status = 'idle';
      state.error = null;
      state.lastFetchedAt = null;
      state.removeBackup = {};
    },
    markCartStale: (state) => {
      state.lastFetchedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.quantities = buildQuantities(action.payload);
        state.lastFetchedAt = Date.now();
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to fetch cart';
      })
      .addCase(addToCart.pending, (state, action) => {
        const { variantId, quantity } = action.meta.arg;
        state.error = null;
        state.quantities[variantId] = (state.quantities[variantId] ?? 0) + quantity;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const index = state.items.findIndex((cartItem) => cartItem.variantId === item.variantId);
        if (index >= 0) {
          state.items[index] = item;
        } else {
          state.items.push(item);
        }
        state.quantities[item.variantId] = item.quantity;
        state.lastFetchedAt = Date.now();
      })
      .addCase(addToCart.rejected, (state, action) => {
        const { variantId, quantity } = action.meta.arg;
        const currentQty = state.quantities[variantId] ?? 0;
        const nextQty = currentQty - quantity;
        if (nextQty <= 0) {
          delete state.quantities[variantId];
        } else {
          state.quantities[variantId] = nextQty;
        }
        state.error = action.payload || action.error.message || 'Failed to add item to cart';
      })
      .addCase(removeFromCart.pending, (state, action) => {
        const variantId = action.meta.arg;
        const currentQty = state.quantities[variantId] ?? 0;
        const existingItem = state.items.find((cartItem) => cartItem.variantId === variantId);
        if (existingItem) {
          state.removeBackup[variantId] = existingItem;
          state.items = state.items.filter((cartItem) => cartItem.variantId !== variantId);
        }
        delete state.quantities[variantId];
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const variantId = action.payload;
        delete state.removeBackup[variantId];
        state.lastFetchedAt = Date.now();
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        const variantId = action.meta.arg;
        const backup = state.removeBackup[variantId];
        if (backup) {
          state.items.push(backup);
          state.quantities[variantId] = backup.quantity;
          delete state.removeBackup[variantId];
        }
        state.error = action.payload || action.error.message || 'Failed to remove item from cart';
      });
  },
});

export const {
  clearCart,
  incrementQuantity,
  mergeQuantities,
  markCartStale,
  setQuantities,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartQuantities = (state: RootState) => state.cart.quantities;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartLastFetchedAt = (state: RootState) => state.cart.lastFetchedAt;
export const selectCartCount = (state: RootState) =>
  Object.values(state.cart.quantities).reduce((sum, qty) => sum + qty, 0);

export default cartSlice.reducer;
