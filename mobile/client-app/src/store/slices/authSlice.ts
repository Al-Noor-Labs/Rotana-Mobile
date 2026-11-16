import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/AuthService';
import { AuthState, User } from '../../types/auth.types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  phoneNumber: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Async Thunks

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      await authService.sendOTP(phoneNumber);
      return phoneNumber;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (
    { phoneNumber, otp }: { phoneNumber: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.verifyOTP(phoneNumber, otp);
      return {
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    credentials: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register(
        credentials.name,
        credentials.email,
        credentials.password
      );
      return {
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(credentials.email, credentials.password);
      return {
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const restoreToken = createAsyncThunk(
  'auth/restoreToken',
  async (_, { rejectWithValue }) => {
    try {
      const { accessToken, refreshToken, user } = await authService.restoreToken();
      return { accessToken, refreshToken, user };
    } catch (error) {
      return rejectWithValue('Failed to restore token');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    return null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Logout failed';
    return rejectWithValue(errorMessage);
  }
});

// Slice

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.phoneNumber = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = 'Session expired. Please log in again.';
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.phoneNumber = action.payload;
        state.error = null;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register User
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Restore Token
    builder
      .addCase(restoreToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken || null;
        state.refreshToken = action.payload.refreshToken || null;
        state.user = action.payload.user || null;
        state.isAuthenticated = !!action.payload.accessToken;

        // Log for debugging
        console.log(
          '[AUTH] Token restored:',
          action.payload.accessToken ? 'Token found' : 'No token found'
        );
      })
      .addCase(restoreToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.phoneNumber = null;
        state.user = null;
        console.log('[AUTH] Token restoration failed');
      });

    // Logout User
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.phoneNumber = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Still logout even if API call fails
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.phoneNumber = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
