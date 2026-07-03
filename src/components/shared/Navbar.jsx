import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toggleTheme, toggleCart, toggleSidebar, addToast } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { setCategory } from '../../store/slices/productSlice';
import { Search, User, Heart, ShoppingBag, Sun, Moon, Menu } from 'lucide-react';

const CATS = [
  { label: 'New In',       to: '/catalog', action: 'All' },
  { label: 'Men',          to: '/catalog', action: 'Men' },
  { label: 'Women',        to: '/catalog', action: 'Women' },
  { label: 'Kids',         to: '/catalog', action: 'Kids' },
  { label: 'Footwear',     to: '/catalog', action: 'Footwear' },
  { label: 'Accessories',  to: '/catalog', action: 'Accessories' },
  { label: 'AR Try-On',    to: '/tryon',  special: true },
  { label: 'AI Stylist',   to: '/recommendations', special: true },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useSelector(s => s.ui);
  const { user } = useSelector(s => s.auth);
  const wishlistCount = useSelector(s => s.wishlist.items.length);
  const cartCount = useSelector(s => s.cart.items.reduce((a,i) => a+i.qty, 0));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ type: 'info', message: 'Signed out.' }));
    navigate('/');
  };

  const handleCatClick = (item) => {
    if (item.special) {
      if (location.pathname !== item.to) {
        navigate(item.to);
      }
    } else {
      dispatch(setCategory(item.action));
      if (location.pathname !== item.to) {
        navigate(item.to);
      }
    }
  };

  return (
    <nav className="navbar" 
         style={{ 
           position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
           padding: '0 4rem', height: scrolled ? '70px' : '80px',
           background: 'var(--bg)',
           borderBottom: '1px solid var(--border)',
           boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
           transition: 'all 0.3s ease'
         }}>
      
      {/* Left side: Brand Logo styled like Tommy Hilfiger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'flex-start' }}>
        <button className="mobile-menu-trigger" onClick={() => dispatch(toggleSidebar())} style={{ marginRight: '0.5rem' }}>
          <Menu size={20} />
        </button>

        <NavLink to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: '1.25rem', 
            letterSpacing: '4px', 
            color: 'var(--text)',
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>AURA</span>
        </NavLink>
      </div>

      {/* Center Categories - matching the Tommy Hilfiger spacing, colors, and fonts */}
      <div className="nav-cats" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 'none' }}>
        {CATS.map(c => (
          <button key={c.label} 
            className={`nav-cat ${c.special ? 'special' : ''}`}
            onClick={() => handleCatClick(c)}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: c.special ? 'var(--purple2)' : 'var(--text)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.7}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Right Side Utility Actions - clean outlines as in Tommy Hilfiger */}
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
        {/* Search */}
        <button onClick={() => navigate('/catalog')} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center' }}
          title="Search">
          <Search size={20} strokeWidth={1.8} />
        </button>

        {/* Profile / Account Toggle */}
        <button onClick={() => user ? handleLogout() : navigate('/')} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center' }}
          title={user ? "Logout" : "Login"}>
          <User size={20} strokeWidth={1.8} />
        </button>

        {/* Wishlist */}
        <button onClick={() => navigate('/wishlist')} 
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center' }}
          title="Wishlist">
          <Heart size={20} strokeWidth={1.8} />
          {wishlistCount > 0 && (
            <span className="badge-count" style={{ position: 'absolute', top: -4, right: -6, background: 'var(--red)', color: '#fff', fontSize: '0.5rem', minWidth: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Cart */}
        <button onClick={() => dispatch(toggleCart())} 
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center' }}
          title="Cart">
          <ShoppingBag size={20} strokeWidth={1.8} />
          {cartCount > 0 && (
            <span className="badge-count" style={{ position: 'absolute', top: -4, right: -6, background: 'var(--purple2)', color: '#fff', fontSize: '0.5rem', minWidth: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartCount}
            </span>
          )}
        </button>

        {/* Theme */}
        <button onClick={() => dispatch(toggleTheme())} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center' }}
          title="Theme">
          {theme === 'dark' ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}
        </button>
      </div>
    </nav>
  );
}
