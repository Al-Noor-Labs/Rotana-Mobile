import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressService } from '../../services/AddressService';
import { Address } from '../../types/address.types';

interface AddressesState {
  addresses: Address[];
  selectedAddressId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AddressesState = {
  addresses: [],
  selectedAddressId: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[ADDRESSES] Fetching addresses...');
      const addresses = await addressService.getAddresses();

      // Auto-select first default address or first address
      const defaultAddr = addresses.find(a => a.isDefault);
      const selectedId = defaultAddr?.id || addresses[0]?.id || null;

      console.log('[ADDRESSES] Addresses fetched, selected:', selectedId);
      return { addresses, selectedAddressId: selectedId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch addresses';
      console.error('[ADDRESSES] Fetch error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const addAddress = createAsyncThunk(
  'addresses/addAddress',
  async (address: Address, { rejectWithValue }) => {
    try {
      console.log('[ADDRESSES] Adding address:', address.label);
      const newAddress = await addressService.addAddress(address);
      console.log('[ADDRESSES] Address added successfully');
      return newAddress;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add address';
      console.error('[ADDRESSES] Add error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async ({ id, address }: { id: string; address: Address }, { rejectWithValue }) => {
    try {
      console.log('[ADDRESSES] Updating address:', id);
      const updated = await addressService.updateAddress(id, address);
      console.log('[ADDRESSES] Address updated successfully');
      return updated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update address';
      console.error('[ADDRESSES] Update error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('[ADDRESSES] Deleting address:', id);
      await addressService.deleteAddress(id);
      console.log('[ADDRESSES] Address deleted successfully');
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete address';
      console.error('[ADDRESSES] Delete error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'addresses/setDefaultAddress',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('[ADDRESSES] Setting address as default:', id);
      const updated = await addressService.setDefaultAddress(id);
      console.log('[ADDRESSES] Default address set successfully');
      return updated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set default address';
      console.error('[ADDRESSES] Set default error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    selectAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Addresses
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload.addresses;
        state.selectedAddressId = action.payload.selectedAddressId;
        state.error = null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add Address
    builder
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses.push(action.payload);
        state.error = null;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Address
    builder
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.addresses.findIndex(a => a.id === action.payload.id);
        if (idx >= 0) state.addresses[idx] = action.payload;
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Address
    builder
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.filter(a => a.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Set Default Address
    builder
      .addCase(setDefaultAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.map(a => ({
          ...a,
          isDefault: a.id === action.payload.id,
        }));
        state.selectedAddressId = action.payload.id;
        state.error = null;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, selectAddress } = addressesSlice.actions;
export default addressesSlice.reducer;
