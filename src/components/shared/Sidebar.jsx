import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { setSidebarOpen, toggleTheme } from '../../store/slices/uiSlice';
import {
  Home, Search, Heart, Calendar, Cpu, Camera,
  LayoutDashboard, Package, BarChart3, Store, Users, LogOut, X, Sunset
} from 'lucide-react';

const customerNav = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/catalog', icon: Search, label: 'Browse Store' },
  { to: '/wishlist', icon: Heart, label: 'My Wishlist' },
  { to: '/reservations', icon: Calendar, label: 'Reservations' },
  { to: '/recommendations', icon: Cpu, label: 'AI Stylist Picks' },
  { to: '/tryon', icon: Camera, label: 'Virtual Try-On' },
];

const staffNav = [
  { to: '/staff', icon: LayoutDashboard, label: 'Overview' },
  { to: '/staff/reservations', icon: Calendar, label: 'Reservations' },
];

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Insights Console' },
  { to: '/admin/products', icon: Package, label: 'Product Manager' },
  { to: '/admin/inventory', icon: Store, label: 'Stores & Stock' },
  { to: '/admin/reservations', icon: Calendar, label: 'All Reservations' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Financials & Data' },
  { to: '/admin/users', icon: Users, label: 'Manage Users' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const sidebarOpen = useSelector(s => s.ui.sidebarOpen);
  const wishlistCount = useSelector(s => s.wishlist.items.length);
  const { theme } = useSelector(s => s.ui);

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'staff' ? staffNav : customerNav;
  const roleLabel = user?.role === 'admin' ? 'Admin Panel' : user?.role === 'staff' ? 'Staff Panel' : 'Customer';
  const roleColor = user?.role === 'admin' ? 'var(--purple2)' : user?.role === 'staff' ? 'var(--amber)' : 'var(--text2)';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      {/* Mobile background overlay */}
      {sidebarOpen && (
        <div onClick={() => dispatch(setSidebarOpen(false))}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99, backdropFilter: 'blur(4px)' }} />
      )}

      <aside className={`sidebar ${user?.role === 'customer' ? 'customer-drawer' : ''} ${sidebarOpen ? 'open' : ''}`}>
        {/* Top Header Logo */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: 'var(--text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '1rem', color: 'var(--bg)',
              fontFamily: "'Bebas Neue', sans-serif"
            }}>A</div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, fontSize: '1.4rem', letterSpacing: '2px', color: 'var(--text)', lineHeight: 1 }}>AURA</div>
              <div style={{ fontSize: '0.62rem', color: roleColor, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: 2 }}>{roleLabel}</div>
            </div>
          </div>
          
          <button onClick={() => dispatch(setSidebarOpen(false))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', display: 'none' }}
            className="mobile-close">
            <X size={20} />
          </button>
        </div>

        {/* Profile Card */}
        {user && (
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)',
              }}>{user.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Links */}
        <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => dispatch(setSidebarOpen(false))}>
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {label === 'My Wishlist' && wishlistCount > 0 && (
                <span className="badge-count" style={{ marginLeft: 'auto' }}>{wishlistCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer Controls */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Quick theme toggle */}
          <button onClick={() => dispatch(toggleTheme())}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.8rem', borderRadius: '4px', border: '1px solid var(--border)',
              background: 'var(--bg3)', cursor: 'pointer', color: 'var(--text2)',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
            <Sunset size={14} />
            <span>{theme === 'dark' ? '☀ LIGHT MODE' : '🌙 DARK MODE'}</span>
          </button>

          {/* Logout */}
          <button onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.8rem', borderRadius: '4px', border: 'none',
              background: 'transparent', cursor: 'pointer', color: 'var(--red)',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
