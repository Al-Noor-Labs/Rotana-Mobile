export interface Address {
  id?: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export interface AddressResponse {
  success: boolean;
  data?: Address;
  error?: {
    code: string;
    message: string;
  };
}

export interface AddressesResponse {
  success: boolean;
  data?: Address[];
  error?: {
    code: string;
    message: string;
  };
}
