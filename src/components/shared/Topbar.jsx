import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleCart } from '../../store/slices/uiSlice';
import { Menu, ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title, subtitle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistCount = useSelector(s => s.wishlist.items.length);
  const cartCount = useSelector(s => s.cart.items.reduce((acc, i) => acc + i.qty, 0));

  return (
    <header className="topbar">
      {/* Left: Sidebar trigger (hamburger on small screens) + Context info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => dispatch(toggleSidebar())}
          style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)', padding: '0.4rem 0.5rem', display: 'flex', alignItems: 'center' }}>
          <Menu size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '1px', textTransform: 'uppercase', lineHeight: 1.2 }}>
            {title || 'AURA'}
          </h1>
          {subtitle && <p style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: 2 }}>{subtitle}</p>}
        </div>
      </div>

      {/* Center: Search/Welcome */}
      <div style={{ display: 'none' }} className="desktop-search-wrap">
        {/* Placeholder for future global search integration */}
      </div>

      {/* Right: Actions (Wishlist, Cart) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Wishlist Link */}
        <button onClick={() => navigate('/wishlist')}
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', padding: '6px', display: 'flex', alignItems: 'center' }}
          title="Wishlist">
          <Heart size={18} />
          {wishlistCount > 0 && <span className="badge-count" style={{ position: 'absolute', top: -4, right: -4, fontSize: '0.55rem', padding: '1px 4px' }}>{wishlistCount}</span>}
        </button>

        {/* Cart Drawer Trigger */}
        <button onClick={() => dispatch(toggleCart())}
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', padding: '6px', display: 'flex', alignItems: 'center' }}
          title="Cart">
          <ShoppingBag size={18} />
          {cartCount > 0 && <span className="badge-count" style={{ position: 'absolute', top: -4, right: -4, fontSize: '0.55rem', padding: '1px 4px', background: 'var(--purple2)' }}>{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
