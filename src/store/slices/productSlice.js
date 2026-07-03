import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { search, category, minPrice, maxPrice } = filters;
      const params = {};
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (minPrice !== undefined) params.min_price = minPrice;
      if (maxPrice !== undefined) params.max_price = maxPrice;

      const response = await api.get('/api/products', { params });
      return response.data.products; // List of products from backend
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch products');
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data; // Product with stores inventory levels
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch product details');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    filtered: [],
    searchQuery: '',
    selectedCategory: 'All',
    priceRange: [0, 40000],
    sortBy: 'trending',
    selectedProduct: null,
    browsingHistory: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearch(state, action) {
      state.searchQuery = action.payload;
    },
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setPriceRange(state, action) {
      state.priceRange = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
      if (action.payload && !state.browsingHistory.find(p => p.id === action.payload.id)) {
        state.browsingHistory = [action.payload, ...state.browsingHistory].slice(0, 10);
      }
    },
    clearFilters(state) {
      state.searchQuery = '';
      state.selectedCategory = 'All';
      state.priceRange = [0, 40000];
      state.sortBy = 'trending';
    },
    localFilter(state) {
      // Apply filters locally on state.items
      let results = [...state.items];
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        results = results.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      if (state.selectedCategory !== 'All') {
        results = results.filter(p => p.category === state.selectedCategory);
      }
      results = results.filter(p => p.price >= state.priceRange[0] && p.price <= state.priceRange[1]);
      
      // Sort logic
      switch (state.sortBy) {
        case 'price-asc': results.sort((a, b) => a.price - b.price); break;
        case 'price-desc': results.sort((a, b) => b.price - a.price); break;
        case 'rating': results.sort((a, b) => b.rating - a.rating); break;
        case 'newest': results.sort((a, b) => (b.tags?.includes('new') ? 1 : 0) - (a.tags?.includes('new') ? 1 : 0)); break;
        default: results.sort((a, b) => (b.tags?.includes('trending') ? 1 : 0) - (a.tags?.includes('trending') ? 1 : 0));
      }
      state.filtered = results;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Apply filters locally
        let results = [...action.payload];
        if (state.searchQuery) {
          const q = state.searchQuery.toLowerCase();
          results = results.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
          );
        }
        if (state.selectedCategory !== 'All') {
          results = results.filter(p => p.category === state.selectedCategory);
        }
        state.filtered = results;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Detail
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        if (action.payload && !state.browsingHistory.find(p => p.id === action.payload.id)) {
          state.browsingHistory = [action.payload, ...state.browsingHistory].slice(0, 10);
        }
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSearch, setCategory, setPriceRange, setSortBy, setSelectedProduct, clearFilters, localFilter } = productSlice.actions;
export default productSlice.reducer;
