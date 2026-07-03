import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/reservations');
      return response.data.reservations;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch reservations');
    }
  }
);

export const createReservationApi = createAsyncThunk(
  'reservations/createReservationApi',
  async ({ productId, storeId, size }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/reservations', {
        product_id: productId,
        store_id: storeId,
        size: size
      });
      return response.data.reservation;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create reservation');
    }
  }
);

export const updateReservationStatusApi = createAsyncThunk(
  'reservations/updateReservationStatusApi',
  async ({ id, status, staffNote }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/reservations/${id}`, {
        status: status,
        staff_note: staffNote
      });
      return response.data.reservation;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to update reservation');
    }
  }
);

const reservationSlice = createSlice({
  name: 'reservations',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReservations(state) {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createReservationApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReservationApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createReservationApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateReservationStatusApi.fulfilled, (state, action) => {
        const index = state.items.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export const { clearReservations } = reservationSlice.actions;
export default reservationSlice.reducer;
