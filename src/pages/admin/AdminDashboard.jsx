import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';
import { fetchReservations, updateReservationStatusApi } from '../../store/slices/reservationSlice';
import { fetchProducts } from '../../store/slices/productSlice';
import { addToast } from '../../store/slices/uiSlice';
import { MOCK_STORES, MOCK_USERS, ANALYTICS_DATA } from '../../data/mockData';
import api from '../../utils/api';
import {
  LayoutDashboard, Package, Store, Calendar, BarChart3, Users,
  TrendingUp, Plus, Edit2, Trash2, Search,
  ArrowUp, ArrowDown
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'inventory', label: 'Inventory', icon: Store },
  { key: 'reservations', label: 'Reservations', icon: Calendar },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'users', label: 'Users', icon: Users },
];

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const reservations = useSelector(s => s.reservations.items);
  const allProducts = useSelector(s => s.products.items);
  const [activeSection, setActiveSection] = useState('overview');
  const [productSearch, setProductSearch] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchReservations());
  }, [dispatch]);

  useEffect(() => {
    if (allProducts) {
      const timer = setTimeout(() => {
        setProducts(allProducts);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [allProducts]);

  const revenue = ANALYTICS_DATA.revenue;
  const revenueChange = ((revenue.thisMonth - revenue.lastMonth) / revenue.lastMonth * 100).toFixed(1);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleStatusChange = async (id, status) => {
    const result = await dispatch(updateReservationStatusApi({ id, status }));
    if (updateReservationStatusApi.fulfilled.match(result)) {
      dispatch(addToast({ type: 'success', message: `Reservation updated to ${status}` }));
    } else {
      dispatch(addToast({ type: 'error', message: 'Failed to update reservation status' }));
    }
  };

  const [inventoryList, setInventoryList] = useState([]);

  useEffect(() => {
    api.get('/api/inventory')
      .then(res => setInventoryList(res.data.inventory))
      .catch(err => console.error('Error fetching admin inventory:', err));
  }, [allProducts]);

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    dispatch(addToast({ type: 'info', message: 'Product removed' }));
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-with-sidebar">
        <Topbar title="Admin Dashboard" subtitle="AURA Management Console" />
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
          {/* Sub-nav */}
          <div style={{ width: 200, background: 'var(--aura-surface)', borderRight: '1px solid var(--aura-border)', padding: '1rem 0.75rem' }}>
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveSection(key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.7rem 0.875rem', borderRadius: 10, border: 'none',
                  background: activeSection === key ? 'rgba(201,168,76,0.12)' : 'transparent',
                  color: activeSection === key ? 'var(--aura-gold)' : 'var(--aura-text-muted)',
                  cursor: 'pointer', fontSize: '0.85rem', fontWeight: activeSection === key ? 700 : 500,
                  marginBottom: 2, transition: 'all 0.2s ease', textAlign: 'left',
                  borderLeft: activeSection === key ? '2px solid var(--aura-gold)' : '2px solid transparent',
                }}>
                <Icon size={16} />{label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
            {/* OVERVIEW */}
            {activeSection === 'overview' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Monthly Revenue', value: `PKR ${(revenue.thisMonth / 1000000).toFixed(2)}M`, change: `+${revenueChange}%`, up: true, color: 'var(--aura-gold)' },
                    { label: 'Active Reservations', value: reservations.filter(r => r.status !== 'cancelled').length, change: '+12% this week', up: true, color: 'var(--aura-success)' },
                    { label: 'Total Products', value: products.length, change: `${products.filter(p => p.inStock).length} in stock`, up: true, color: 'var(--aura-accent-2)' },
                    { label: 'Registered Users', value: MOCK_USERS.length, change: '+3 this month', up: true, color: 'var(--aura-accent)' },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <p style={{ fontSize: '0.72rem', color: 'var(--aura-text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                      <p style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, marginBottom: '0.4rem', lineHeight: 1 }}>{s.value}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: s.up ? 'var(--aura-success)' : 'var(--aura-error)' }}>
                        {s.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {s.change}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts row */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  {/* Weekly visitors bar chart */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--aura-text-muted)' }}>Weekly Visitors</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 120 }}>
                      {ANALYTICS_DATA.dailyVisitors.map((v, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                          <div className="chart-bar" style={{ width: '100%', height: `${(v / 210) * 100}px` }} />
                          <span style={{ fontSize: '0.65rem', color: 'var(--aura-text-muted)' }}>{ANALYTICS_DATA.weekLabels[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category breakdown */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--aura-text-muted)' }}>Sales by Category</h3>
                    {ANALYTICS_DATA.categoryBreakdown.map(c => (
                      <div key={c.name} style={{ marginBottom: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 500 }}>{c.name}</span>
                          <span style={{ color: 'var(--aura-gold)', fontWeight: 700 }}>{c.percent}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${c.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top products */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--aura-text-muted)' }}>Top Performing Products</h3>
                  <table className="aura-table">
                    <thead><tr><th>Product</th><th>Units Sold</th><th>Revenue</th><th>Trend</th></tr></thead>
                    <tbody>
                      {ANALYTICS_DATA.topProducts.map((p, i) => (
                        <tr key={p.name}>
                          <td style={{ fontWeight: 600 }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--aura-text-muted)', marginRight: '0.5rem' }}>#{i+1}</span>
                            {p.name}
                          </td>
                          <td style={{ color: 'var(--aura-gold)', fontWeight: 700 }}>{p.sales}</td>
                          <td style={{ fontWeight: 600 }}>PKR {p.revenue.toLocaleString()}</td>
                          <td><span style={{ color: 'var(--aura-success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 2 }}><TrendingUp size={12} /> +{((p.sales % 15) + 5)}%</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {activeSection === 'products' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
                    <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--aura-text-muted)' }} />
                    <input className="input-field" style={{ paddingLeft: '2.25rem' }} placeholder="Search products..."
                      value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                  </div>
                  <button className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}
                    onClick={() => dispatch(addToast({ type: 'info', message: 'Add product form — coming in backend integration!' }))}>
                    <Plus size={15} /> Add Product
                  </button>
                </div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <table className="aura-table">
                    <thead><tr><th>Product</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img src={p.images[0]} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--aura-gold)', fontWeight: 600, fontSize: '0.85rem' }}>{p.brand}</td>
                          <td>{p.category}</td>
                          <td style={{ fontWeight: 700 }}>PKR {p.price.toLocaleString()}</td>
                          <td><span className={`badge ${p.inStock ? 'badge-success' : 'badge-error'}`}>{p.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--aura-gold)', cursor: 'pointer' }}>
                                <Edit2 size={12} />
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--aura-error)', cursor: 'pointer' }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* INVENTORY */}
            {activeSection === 'inventory' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  {MOCK_STORES.map(store => (
                    <div key={store.id} className="card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div>
                          <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{store.name}</h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--aura-text-muted)' }}>{store.address}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--aura-text-muted)' }}>{store.hours}</p>
                        </div>
                        <span className="badge badge-success" style={{ flexShrink: 0 }}>Active</span>
                      </div>
                      <div style={{ borderTop: '1px solid var(--aura-border)', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--aura-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>Stock by Product</p>
                        {inventoryList.filter(item => item.storeId === store.id).slice(0, 5).map(item => {
                          return (
                            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{item.product}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div className="progress-bar" style={{ width: 60 }}>
                                  <div className="progress-fill" style={{ width: `${Math.min(100, (item.stock || 0) / 20 * 100)}%` }} />
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: (item.stock || 0) === 0 ? 'var(--aura-error)' : (item.stock || 0) <= 3 ? 'var(--aura-warning)' : 'var(--aura-success)', minWidth: 24 }}>
                                  {item.stock || 0}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESERVATIONS */}
            {activeSection === 'reservations' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  {Object.entries(ANALYTICS_DATA.reservations).map(([key, val]) => (
                    <div key={key} className="stat-card">
                      <p style={{ fontSize: '0.72rem', color: 'var(--aura-text-muted)', textTransform: 'capitalize', marginBottom: '0.3rem' }}>{key}</p>
                      <p style={{ fontSize: '1.6rem', fontWeight: 900, color: key === 'pending' ? 'var(--aura-warning)' : key === 'confirmed' ? 'var(--aura-success)' : key === 'cancelled' ? 'var(--aura-error)' : 'var(--aura-gold)' }}>{val}</p>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <table className="aura-table">
                    <thead><tr><th>ID</th><th>Customer</th><th>Product</th><th>Store</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                      {reservations.map(res => (
                        <tr key={res.id}>
                          <td><code style={{ fontSize: '0.78rem', color: 'var(--aura-text-muted)' }}>{res.id}</code></td>
                          <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{res.userName}</td>
                          <td style={{ fontSize: '0.85rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.productName}</td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--aura-text-muted)' }}>{res.storeName}</td>
                          <td>
                            <select value={res.status} onChange={e => handleStatusChange(res.id, e.target.value)}
                              style={{ padding: '3px 6px', fontSize: '0.75rem', borderRadius: 6 }}>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="collected">Collected</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--aura-text-muted)' }}>{res.createdAt}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                              {res.status === 'pending' && <button onClick={() => handleStatusChange(res.id, 'confirmed')} style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', border: 'none', color: 'var(--aura-success)', cursor: 'pointer', fontSize: '0.72rem' }}>✓</button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ANALYTICS */}
            {activeSection === 'analytics' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Revenue This Month', value: `PKR ${(revenue.thisMonth/1000000).toFixed(2)}M`, sub: `vs PKR ${(revenue.lastMonth/1000000).toFixed(2)}M last month`, color: 'var(--aura-gold)' },
                    { label: 'Avg. Daily Visitors', value: Math.round(ANALYTICS_DATA.dailyVisitors.reduce((a,b)=>a+b,0)/7), sub: 'This week', color: 'var(--aura-accent-2)' },
                    { label: 'Reservation Rate', value: '78%', sub: 'Pending → Collected', color: 'var(--aura-success)' },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <p style={{ fontSize: '0.72rem', color: 'var(--aura-text-muted)', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                      <p style={{ fontSize: '2rem', fontWeight: 900, color: s.color, marginBottom: '0.3rem', lineHeight: 1 }}>{s.value}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--aura-text-muted)' }}>{s.sub}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem' }}>Daily Traffic (This Week)</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: 140 }}>
                      {ANALYTICS_DATA.dailyVisitors.map((v, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--aura-text-muted)', fontWeight: 600 }}>{v}</span>
                          <div className="chart-bar" style={{ width: '100%', height: `${(v / 210) * 110}px` }} />
                          <span style={{ fontSize: '0.65rem', color: 'var(--aura-text-muted)' }}>{ANALYTICS_DATA.weekLabels[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Products Revenue</h3>
                    {ANALYTICS_DATA.topProducts.map((p, i) => (
                      <div key={p.name} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                          <span style={{ fontWeight: 500 }}>#{i+1} {p.name.split(' ').slice(0,3).join(' ')}</span>
                          <span style={{ color: 'var(--aura-gold)', fontWeight: 700 }}>PKR {(p.revenue/1000000).toFixed(2)}M</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${(p.revenue / ANALYTICS_DATA.topProducts[0].revenue) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}
            {activeSection === 'users' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <table className="aura-table">
                    <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Orders</th><th>Wishlist</th><th>Status</th></tr></thead>
                    <tbody>
                      {MOCK_USERS.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem', color: 'var(--aura-gold)' }}>{u.avatar}</div>
                              <span style={{ fontWeight: 600 }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--aura-text-muted)', fontSize: '0.85rem' }}>{u.email}</td>
                          <td><span className={`badge ${u.role === 'admin' ? 'badge-purple' : u.role === 'staff' ? 'badge-info' : 'badge-gold'}`}>{u.role}</span></td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--aura-text-muted)' }}>{u.joinDate}</td>
                          <td style={{ fontWeight: 700, color: 'var(--aura-gold)' }}>{u.totalOrders}</td>
                          <td style={{ color: 'var(--aura-error)' }}>❤️ {u.wishlistCount}</td>
                          <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--aura-success)' }}><div className="status-dot online" />Active</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
