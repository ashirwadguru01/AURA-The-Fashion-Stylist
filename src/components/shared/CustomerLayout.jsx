import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import Sidebar from './Sidebar';

export default function CustomerLayout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Sidebar drawer (for mobile/tablet overlay) */}
      <Sidebar />

      {/* Top Navbar */}
      <Navbar />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Full-width storefront canvas */}
      <main style={{ flex: 1, paddingTop: '70px' }}>
        {children}
      </main>
    </div>
  );
}
