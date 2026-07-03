import { createSlice } from '@reduxjs/toolkit';

const saved = localStorage.getItem('aura_theme') || 'dark';
if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', saved);

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: saved,
    toasts: [],
    cartOpen: false,
    activeModal: null,
    sidebarOpen: false,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('aura_theme', state.theme);
    },
    toggleCart(state) { state.cartOpen = !state.cartOpen; },
    setCartOpen(state, a) { state.cartOpen = a.payload; },
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen(state, a) { state.sidebarOpen = a.payload; },
    addToast(state, a) { state.toasts.push({ id: Date.now(), ...a.payload }); },
    removeToast(state, a) { state.toasts = state.toasts.filter(t => t.id !== a.payload); },
    setModal(state, a) { state.activeModal = a.payload; },
  },
});
export const { toggleTheme, toggleCart, setCartOpen, toggleSidebar, setSidebarOpen, addToast, removeToast, setModal } = uiSlice.actions;
export default uiSlice.reducer;
