import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart(state, action) {
      const { product, size } = action.payload;
      const existing = state.items.find(i => i.id === product.id && i.size === size);
      if (existing) { existing.qty += 1; } 
      else { state.items.push({ ...product, size, qty: 1 }); }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => !(i.id === action.payload.id && i.size === action.payload.size));
    },
    clearCart(state) { state.items = []; },
  },
});
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
