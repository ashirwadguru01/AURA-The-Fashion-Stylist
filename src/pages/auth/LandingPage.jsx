import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import AnimatedPage from '../../components/shared/AnimatedPage';

const DEMO_ACCOUNTS = [
  { email: 'customer@aura.com', password: 'demo123', name: 'Rahul Sharma', role: 'customer' },
  { email: 'staff@aura.com', password: 'demo123', name: 'Staff Member', role: 'staff' },
  { email: 'admin@aura.com', password: 'demo123', name: 'Admin User', role: 'admin' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('signin'); // signin | signup
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const go = dest => navigate(dest, { replace: true });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (tab === 'signin') {
      const result = await dispatch(loginUser({ email: form.email, password: form.password }));
      if (loginUser.fulfilled.match(result)) {
        const user = result.payload.user;
        dispatch(addToast({ type: 'success', message: `Welcome back, ${user.name}! 👋` }));
        const dest = user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/home';
        go(dest);
      } else {
        dispatch(addToast({ type: 'error', message: result.payload || 'Invalid credentials.' }));
      }
    } else {
      const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
      if (registerUser.fulfilled.match(result)) {
        dispatch(addToast({ type: 'success', message: 'Account created! Welcome to AURA ✨' }));
        go('/home');
      } else {
        dispatch(addToast({ type: 'error', message: result.payload || 'Registration failed.' }));
      }
    }
    setLoading(false);
  };

  const quickDemo = async (acc) => {
    setLoading(true);
    const result = await dispatch(loginUser({ email: acc.email, password: acc.password }));
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload.user;
      dispatch(addToast({ type: 'success', message: `Logged in as ${user.role}` }));
      const dest = user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/home';
      go(dest);
    } else {
      dispatch(addToast({ type: 'error', message: 'Demo identity login failed.' }));
    }
    setLoading(false);
  };

  return (
    <AnimatedPage>
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'hidden'
      }}>
        {/* Blurry luxury background image overlay */}
        <div className="login-bg-overlay" />

        {/* Premium Glassmorphic Login Card */}
        <div className="login-card" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '3rem 2.5rem',
          position: 'relative'
        }}>
          {/* Logo flag header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1.8rem',
              fontWeight: 900,
              letterSpacing: '5px',
              color: 'var(--text)',
              textTransform: 'uppercase'
            }}>
              AURA
            </span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
              {tab === 'signin' ? 'Sign in to access your luxury atelier' : 'Register an account to begin styling'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="tabs" style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
            <button 
              type="button"
              onClick={() => setTab('signin')} 
              style={{
                flex: 1, padding: '0.75rem', background: 'none', border: 'none',
                color: tab === 'signin' ? 'var(--text)' : 'var(--text3)',
                fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase',
                borderBottom: tab === 'signin' ? '2px solid var(--purple2)' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.3s'
              }}>
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => setTab('signup')} 
              style={{
                flex: 1, padding: '0.75rem', background: 'none', border: 'none',
                color: tab === 'signup' ? 'var(--text)' : 'var(--text3)',
                fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase',
                borderBottom: tab === 'signup' ? '2px solid var(--purple2)' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.3s'
              }}>
              Register
            </button>
          </div>

          {/* Demo Credentials Box */}
          {tab === 'signin' && (
            <div style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--purple2)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                ⚡ SELECT DEMO IDENTITY
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {DEMO_ACCOUNTS.map(acc => (
                  <button 
                    key={acc.role} 
                    type="button"
                    onClick={() => quickDemo(acc)}
                    style={{
                      padding: '0.6rem 0.3rem',
                      border: '1px solid var(--border)',
                      background: 'var(--bg2)',
                      cursor: 'pointer',
                      color: 'var(--text)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
                    {acc.role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form fields */}
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {tab === 'signup' && (
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Full Name
                </label>
                <input 
                  className="input" 
                  type="text" 
                  placeholder="Rahul Sharma" 
                  required 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                />
              </div>
            )}
            
            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <input 
                className="input" 
                type="email" 
                placeholder="yourname@domain.com" 
                required 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  className="input" 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  required 
                  value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  style={{ paddingRight: '3rem' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, color: 'var(--text)'
                  }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', fontWeight: 800, marginTop: '1rem' }} 
              disabled={loading}>
              {loading ? (
                <span style={{
                  width: 16, height: 16, border: '2px solid transparent',
                  borderTop: '2px solid var(--bg)', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', display: 'inline-block'
                }} />
              ) : (
                tab === 'signin' ? 'LOG IN →' : 'REGISTER →'
              )}
            </button>
          </form>

        </div>
      </div>
    </AnimatedPage>
  );
}
