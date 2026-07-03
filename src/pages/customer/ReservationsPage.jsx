import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReservations, updateReservationStatusApi } from '../../store/slices/reservationSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';

const STATUS = {
  pending:   { cls: 's-pending',   label: 'Pending' },
  confirmed: { cls: 's-confirmed', label: 'Confirmed' },
  collected: { cls: 's-collected', label: 'Collected' },
  cancelled: { cls: 's-cancelled', label: 'Cancelled' },
};

export default function ReservationsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const all = useSelector(s => s.reservations.items);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const filtered = tab === 'all' ? all : all.filter(r => r.status === tab);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ padding: '2.5rem 2rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '2px', marginBottom: '1.25rem' }}>MY RESERVATIONS</h1>
        <div className="tabs" style={{ maxWidth: 480 }}>
          {[['all', 'All'], ['pending', 'Pending'], ['confirmed', 'Confirmed'], ['collected', 'Collected'], ['cancelled', 'Cancelled']].map(([k, l]) => (
            <button key={k} className={`tab-btn ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '2rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '2px', marginBottom: '0.75rem' }}>NO RESERVATIONS</p>
            <p style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>Reserve products at nearby stores and pick them up at your convenience</p>
            <button className="btn btn-primary" onClick={() => navigate('/catalog')}>BROWSE PRODUCTS</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {filtered.map(res => (
              <div key={res.id} style={{ background: 'var(--bg)', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <code style={{ fontSize: '0.72rem', color: 'var(--text2)', background: 'var(--bg3)', padding: '2px 8px' }}>{res.id}</code>
                    <span className={`status-pill ${STATUS[res.status]?.cls}`}>{STATUS[res.status]?.label}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>{res.productName.toUpperCase()}</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text2)', flexWrap: 'wrap' }}>
                    <span>📍 {res.storeName}</span>
                    <span>📦 Size: {res.size}</span>
                    <span>📅 Reserved: {res.createdAt}</span>
                    <span>⏳ Expires: {res.expiresAt}</span>
                  </div>
                  {res.staffNote && (
                    <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text2)', padding: '0.5rem 0.875rem', background: 'var(--bg2)', borderLeft: '2px solid var(--purple2)' }}>
                      Staff: {res.staffNote}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  {/* Status steps */}
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    {['pending', 'confirmed', 'collected'].map((s, i) => {
                      const idx = ['pending', 'confirmed', 'collected'].indexOf(res.status);
                      return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, border: `1.5px solid ${idx >= i ? 'var(--text)' : 'var(--border)'}`, background: idx >= i ? 'var(--text)' : 'transparent', color: idx >= i ? 'var(--bg)' : 'var(--text3)' }}>
                            {idx >= i ? '✓' : (i + 1)}
                          </div>
                          {i < 2 && <div style={{ width: 20, height: 1, background: idx > i ? 'var(--text)' : 'var(--border)' }} />}
                        </div>
                      );
                    })}
                  </div>
                  {res.status === 'pending' && (
                    <button onClick={() => { dispatch(updateReservationStatusApi({ id: res.id, status: 'cancelled' })); dispatch(addToast({ type: 'info', message: 'Reservation cancelled' })); }}
                      style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '0.4rem 0.875rem', border: '1px solid rgba(239,68,68,0.4)', color: 'var(--red)', background: 'rgba(239,68,68,0.08)', cursor: 'pointer' }}>
                      CANCEL
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
