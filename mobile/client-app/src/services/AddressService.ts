import { apiClient } from './ApiClient';
import { Address } from '../types/address.types';

class AddressService {
  async getAddresses(): Promise<Address[]> {
    console.log('[ADDRESS_SERVICE] Fetching addresses from /api/v1/addresses');

    try {
      const response = await apiClient.get<Address[]>('/api/v1/addresses');

      if (!response.success) {
        const errorMsg = response.error?.message || 'Failed to fetch addresses';
        console.error('[ADDRESS_SERVICE] Error:', errorMsg);
        throw new Error(errorMsg);
      }

      const count = response.data?.length || 0;
      console.log('[ADDRESS_SERVICE] Fetched successfully:', count, 'addresses');
      return response.data || [];
    } catch (error) {
      console.error('[ADDRESS_SERVICE] Error fetching addresses:', error);
      throw error;
    }
  }

  async addAddress(address: Address): Promise<Address> {
    console.log('[ADDRESS_SERVICE] Adding new address:', address.label);

    try {
      // Prepare payload - omit id and empty optional fields
      const payload: any = {
        label: address.label,
        line1: address.line1,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault,
      };

      // Only include line2 if it has content
      if (address.line2?.trim()) {
        payload.line2 = address.line2;
      }

      // Only include coordinates if provided
      if (address.latitude !== undefined && address.longitude !== undefined) {
        payload.latitude = address.latitude;
        payload.longitude = address.longitude;
      }

      const response = await apiClient.post<Address>('/api/v1/addresses', payload);

      if (!response.success) {
        const errorMsg = response.error?.message || 'Failed to add address';
        console.error('[ADDRESS_SERVICE] Error:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[ADDRESS_SERVICE] Address added successfully');
      return response.data!;
    } catch (error) {
      console.error('[ADDRESS_SERVICE] Error adding address:', error);
      throw error;
    }
  }

  async updateAddress(id: string, address: Address): Promise<Address> {
    console.log('[ADDRESS_SERVICE] Updating address:', id);

    try {
      const response = await apiClient.patch<Address>(`/api/v1/addresses/${id}`, address);

      if (!response.success) {
        const errorMsg = response.error?.message || 'Failed to update address';
        console.error('[ADDRESS_SERVICE] Error:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[ADDRESS_SERVICE] Address updated successfully');
      return response.data!;
    } catch (error) {
      console.error('[ADDRESS_SERVICE] Error updating address:', error);
      throw error;
    }
  }

  async deleteAddress(id: string): Promise<void> {
    console.log('[ADDRESS_SERVICE] Deleting address:', id);

    try {
      const response = await apiClient.delete(`/api/v1/addresses/${id}`);

      if (!response.success) {
        const errorMsg = response.error?.message || 'Failed to delete address';
        console.error('[ADDRESS_SERVICE] Error:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[ADDRESS_SERVICE] Address deleted successfully');
    } catch (error) {
      console.error('[ADDRESS_SERVICE] Error deleting address:', error);
      throw error;
    }
  }

  async setDefaultAddress(id: string): Promise<Address> {
    console.log('[ADDRESS_SERVICE] Setting address as default:', id);

    try {
      const response = await apiClient.post<Address>(`/api/v1/addresses/${id}/set-default`, {});

      if (!response.success) {
        const errorMsg = response.error?.message || 'Failed to set default address';
        console.error('[ADDRESS_SERVICE] Error:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[ADDRESS_SERVICE] Default address set successfully');
      return response.data!;
    } catch (error) {
      console.error('[ADDRESS_SERVICE] Error setting default address:', error);
      throw error;
    }
  }
}

export const addressService = new AddressService();
