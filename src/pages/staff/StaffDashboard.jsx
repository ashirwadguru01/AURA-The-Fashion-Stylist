import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';
import { fetchReservations, updateReservationStatusApi } from '../../store/slices/reservationSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Search, Calendar, Check, X, Package, Heart, Clock } from 'lucide-react';

const statusConfig = {
  pending: { badge: 'badge-warning' },
  confirmed: { badge: 'badge-success' },
  collected: { badge: 'badge-info' },
  cancelled: { badge: 'badge-error' },
};

export default function StaffDashboard() {
  const dispatch = useDispatch();
  const reservations = useSelector(s => s.reservations.items);
  const [activeTab, setActiveTab] = useState('reservations');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState('');

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  // Construct dynamic users list from database reservations
  const uniqueCustomers = [];
  reservations.forEach(r => {
    if (r.userId && !uniqueCustomers.find(c => c.id === r.userId)) {
      uniqueCustomers.push({
        id: r.userId,
        name: r.userName,
        email: `${r.userName.toLowerCase().replace(/\s/g, '')}@aura.com`,
        avatar: r.userName.split(' ').map(n => n[0]).join('').toUpperCase(),
        role: 'customer',
        joinDate: r.createdAt || '2025-06-01',
        totalOrders: reservations.filter(res => res.userId === r.userId && res.status === 'collected').length,
        wishlistCount: 3
      });
    }
  });

  const filteredUsers = uniqueCustomers.filter(u =>
    u.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    u.email.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  const handleStatusChange = async (id, status) => {
    const result = await dispatch(updateReservationStatusApi({ id, status }));
    if (updateReservationStatusApi.fulfilled.match(result)) {
      dispatch(addToast({ type: 'success', message: `Reservation ${status}` }));
    } else {
      dispatch(addToast({ type: 'error', message: 'Failed to update reservation' }));
    }
  };

  const pendingCount = reservations.filter(r => r.status === 'pending').length;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-with-sidebar">
        <Topbar title="Staff Dashboard" subtitle="Manage reservations & customer insights" />
        <div style={{ padding: '1.5rem 2rem' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Reservations', value: reservations.length, icon: '📅', color: 'var(--aura-gold)' },
              { label: 'Pending', value: pendingCount, icon: '⏳', color: 'var(--aura-warning)' },
              { label: 'Confirmed Today', value: reservations.filter(r => r.status === 'confirmed').length, icon: '✓', color: 'var(--aura-success)' },
              { label: 'Customers', value: uniqueCustomers.length, icon: '👥', color: 'var(--aura-accent-2)' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--aura-text-muted)', marginBottom: '0.3rem' }}>{s.label}</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</p>
                  </div>
                  <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tab-nav" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            <button className={`tab-item ${activeTab === 'reservations' ? 'active' : ''}`} onClick={() => setActiveTab('reservations')}>
              Reservations {pendingCount > 0 && <span style={{ background: 'var(--aura-error)', color: '#fff', borderRadius: 99, fontSize: '0.65rem', padding: '0 5px', marginLeft: 4 }}>{pendingCount}</span>}
            </button>
            <button className={`tab-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>Customer Insights</button>
          </div>

          {activeTab === 'reservations' && (
            <div>
              <table className="aura-table">
                <thead>
                  <tr>
                    <th>Reservation ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Store</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(res => (
                    <tr key={res.id}>
                      <td><code style={{ fontSize: '0.78rem', color: 'var(--aura-text-muted)' }}>{res.id}</code></td>
                      <td style={{ fontWeight: 600 }}>{res.userName}</td>
                      <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.productName}</td>
                      <td style={{ color: 'var(--aura-text-muted)', fontSize: '0.85rem' }}>{res.storeName}</td>
                      <td style={{ color: 'var(--aura-gold)', fontWeight: 700 }}>UK {res.size}</td>
                      <td><span className={`badge ${statusConfig[res.status]?.badge}`}>{res.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {res.status === 'pending' && (
                            <>
                              <button onClick={() => handleStatusChange(res.id, 'confirmed')}
                                style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--aura-success)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Check size={11} /> Confirm
                              </button>
                              <button onClick={() => handleStatusChange(res.id, 'cancelled')}
                                style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--aura-error)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <X size={11} /> Reject
                              </button>
                            </>
                          )}
                          {res.status === 'confirmed' && (
                            <button onClick={() => handleStatusChange(res.id, 'collected')}
                              style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: 'var(--aura-accent-2)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Package size={11} /> Collected
                            </button>
                          )}
                          {(res.status === 'collected' || res.status === 'cancelled') && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--aura-text-muted)' }}>—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'customers' && (
            <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
              {/* Customer list */}
              <div>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--aura-text-muted)' }} />
                  <input className="input-field" style={{ paddingLeft: '2.25rem' }} placeholder="Search customer by name or email..."
                    value={searchCustomer} onChange={e => setSearchCustomer(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredUsers.map(u => {
                    const userRes = reservations.filter(r => r.userId === u.id);
                    return (
                      <div key={u.id} onClick={() => setSelectedUser(u)}
                        style={{
                          padding: '1rem', borderRadius: 14, cursor: 'pointer',
                          border: `1px solid ${selectedUser?.id === u.id ? 'var(--aura-gold)' : 'var(--aura-border)'}`,
                          background: selectedUser?.id === u.id ? 'rgba(201,168,76,0.06)' : 'var(--aura-surface)',
                          transition: 'all 0.2s ease',
                          display: 'flex', alignItems: 'center', gap: '1rem',
                        }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: 'rgba(201,168,76,0.15)', border: '2px solid rgba(201,168,76,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '1rem', color: 'var(--aura-gold)', flexShrink: 0,
                        }}>{u.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{u.name}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--aura-text-muted)' }}>{u.email}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '0.72rem', color: 'var(--aura-text-muted)', marginBottom: '0.2rem' }}>{userRes.length} reservations</p>
                          <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{u.role}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer profile */}
              {selectedUser && (
                <div style={{ animation: 'slideInLeft 0.3s ease' }}>
                  <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--aura-border)' }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '2px solid var(--aura-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: 'var(--aura-gold)' }}>
                        {selectedUser.avatar}
                      </div>
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedUser.name}</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--aura-text-muted)' }}>{selectedUser.email}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--aura-text-muted)' }}>Member since {selectedUser.joinDate}</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      {[
                        { label: 'Total Orders', value: selectedUser.totalOrders, icon: Package },
                        { label: 'Wishlist Items', value: selectedUser.wishlistCount, icon: Heart },
                        { label: 'Reservations', value: reservations.filter(r => r.userId === selectedUser.id).length, icon: Calendar },
                        { label: 'Active Res.', value: reservations.filter(r => r.userId === selectedUser.id && r.status === 'pending').length, icon: Clock },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ padding: '0.75rem', background: 'var(--aura-surface-2)', borderRadius: 10 }}>
                          <p style={{ fontSize: '0.7rem', color: 'var(--aura-text-muted)', marginBottom: '0.2rem' }}>{label}</p>
                          <p style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--aura-gold)' }}>{value}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--aura-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent Reservations</p>
                      {reservations.filter(r => r.userId === selectedUser.id).slice(0, 3).map(r => (
                        <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', background: 'var(--aura-surface-2)', borderRadius: 8, marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{r.productName}</span>
                          <span className={`badge ${statusConfig[r.status]?.badge}`} style={{ fontSize: '0.65rem' }}>{r.status}</span>
                        </div>
                      ))}
                      {reservations.filter(r => r.userId === selectedUser.id).length === 0 && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--aura-text-muted)', textAlign: 'center', padding: '1rem' }}>No reservations yet</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
