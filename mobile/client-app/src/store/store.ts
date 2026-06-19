import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';
import addressesReducer from './slices/addressesSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    products: productsReducer,
    orders: ordersReducer,
    addresses: addressesReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/registerUser/fulfilled', 'auth/verifyOTP/fulfilled', 'auth/restoreToken/fulfilled'],
        ignoredPaths: ['auth.accessToken', 'auth.refreshToken'],
        warnAfter: 128, // Increase threshold from 32ms to 128ms
      },
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
