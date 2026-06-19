import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();

export const useAuthState = () =>
  useAppSelector((state) => ({
    user: state.auth.user,
    accessToken: state.auth.accessToken,
    refreshToken: state.auth.refreshToken,
    isLoading: state.auth.isLoading,
    isAuthenticated: state.auth.isAuthenticated,
    error: state.auth.error,
    phoneNumber: state.auth.phoneNumber,
  }));

export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);

export const useIsLoading = () => useAppSelector((state) => state.auth.isLoading);

export const useAuthError = () => useAppSelector((state) => state.auth.error);

export const useAuthUser = () => useAppSelector((state) => state.auth.user);
