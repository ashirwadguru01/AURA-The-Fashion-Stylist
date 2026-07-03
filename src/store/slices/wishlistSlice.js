import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/wishlist');
      return response.data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch wishlist');
    }
  }
);

export const toggleWishlistApi = createAsyncThunk(
  'wishlist/toggleWishlistApi',
  async (product, { getState, rejectWithValue }) => {
    const { wishlist } = getState();
    const isWishlisted = wishlist.items.some(p => p.id === product.id);
    try {
      if (isWishlisted) {
        await api.delete(`/api/wishlist/${product.id}`);
        return { product, action: 'removed' };
      } else {
        await api.post('/api/wishlist', { product_id: product.id });
        return { product, action: 'added' };
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to update wishlist');
    }
  }
);

export const removeWishlistApi = createAsyncThunk(
  'wishlist/removeWishlistApi',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/wishlist/${productId}`);
      return productId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to remove from wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist(state) {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Wishlist
      .addCase(toggleWishlistApi.fulfilled, (state, action) => {
        const { product, action: mode } = action.payload;
        if (mode === 'removed') {
          state.items = state.items.filter(p => p.id !== product.id);
        } else {
          state.items.push(product);
        }
      })
      // Remove specific
      .addCase(removeWishlistApi.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
