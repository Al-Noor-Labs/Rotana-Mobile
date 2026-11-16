export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface OTPResponse {
  success: boolean;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  phoneNumber: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
