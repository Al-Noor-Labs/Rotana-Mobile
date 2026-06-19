import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoriesService, Category } from '../../services/CategoriesService';
import { RootState } from '../store';

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const now = Date.now();

      // Check if we have cached data that's still fresh
      if (
        state.categories.categories.length > 0 &&
        state.categories.lastFetchedAt &&
        now - state.categories.lastFetchedAt < CACHE_DURATION
      ) {
        console.log('[CATEGORIES] Using cached categories (fresh)');
        return state.categories.categories;
      }

      // Fetch fresh data from API
      console.log('[CATEGORIES] Fetching categories from API...');
      const categories = await categoriesService.getCategories();
      console.log('[CATEGORIES] Fetched successfully:', categories.length, 'total items');

      // Analyze hierarchy
      const parentCategories = categories.filter(cat => !cat.parentId);
      const subCategories = categories.filter(cat => cat.parentId);

      console.log('[CATEGORIES] Breakdown:');
      console.log(`  - Parent categories (main): ${parentCategories.length}`);
      console.log(`  - Sub-categories (children): ${subCategories.length}`);

      // Log parent-child structure
      console.log('[CATEGORIES] Parent-Child Structure:');
      parentCategories.forEach((parent, idx) => {
        const children = subCategories.filter(sub => sub.parentId === parent.id);
        console.log(`  [${idx + 1}] ${parent.name} (ID: ${parent.id})`);
        if (children.length > 0) {
          children.forEach(child => {
            console.log(`      └─ ${child.name} (ID: ${child.id})`);
          });
        }
      });

      // Warn about orphaned sub-categories
      const orphaned = subCategories.filter(sub => !parentCategories.find(p => p.id === sub.parentId));
      if (orphaned.length > 0) {
        console.warn('[CATEGORIES] WARNING - Orphaned sub-categories (parent not found):');
        orphaned.forEach(cat => {
          console.warn(`  - ${cat.name} (parentId: ${cat.parentId})`);
        });
      }

      return categories;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      console.error('[CATEGORIES] Fetch error:', errorMessage);
      // Don't reject - return empty array so app can still load
      return [];
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.lastFetchedAt = Date.now();
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
