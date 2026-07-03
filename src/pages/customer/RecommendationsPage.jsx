import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/shared/ProductCard';
import api from '../../utils/api';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const wishlist = useSelector(s => s.wishlist.items);
  const history  = useSelector(s => s.products.browsingHistory);
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 0);
    api.get('/api/recommendations')
      .then(res => {
        const mapped = res.data.recommendations.map((p) => ({
          ...p,
          reason: p.reason || `Top rated in ${p.category}`,
          score: p.score || 85
        }));
        setRecs(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading recommendations:', err);
        setLoading(false);
      });
    return () => clearTimeout(timer);
  }, [wishlist]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '2.5rem 2rem', background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, var(--bg) 70%)', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '2px', marginBottom: '0.5rem' }}>AI PICKS FOR YOU</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Based on {wishlist.length} wishlist items · {history.length} recently viewed</p>
      </div>

      {/* Analysis card */}
      <div style={{ padding: '1.5rem 2rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', border: '2px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', animation: loading ? 'spin 1.5s linear infinite' : 'none' }}>
              {loading ? '⚙' : '🤖'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                {loading ? 'AI IS ANALYSING YOUR PROFILE...' : 'YOUR STYLE PROFILE IS READY'}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>
                {loading ? 'Processing wishlist, trends, and category data...' : `${wishlist.length} wishlist items analysed · Multi-dimensional vector styling active`}
              </p>
            </div>
            {!loading && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: 'var(--purple2)', lineHeight: 1 }}>
                  {recs.length > 0 ? `${Math.round(recs[0].score)}%` : '100%'}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>PEAK MATCH QUALITY</p>
              </div>
            )}
          </div>
          {loading && (
            <div className="progress" style={{ marginTop: '1rem' }}>
              <div className="progress-fill" style={{ width: '75%', background: 'var(--purple)', animation: 'pulse 1.5s ease infinite' }} />
            </div>
          )}
        </div>

        {loading ? (
          <div className="products-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: 'var(--bg)' }}>
                <div className="skeleton" style={{ height: 280 }} />
                <div style={{ padding: '1rem' }}>
                  <div className="skeleton" style={{ height: 10, width: '50%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '75%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 18, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: 'var(--border)' }}>
              {recs.map((product, i) => (
                <div key={product.id} style={{ background: 'var(--bg)', position: 'relative', animationDelay: `${i * 0.08}s` }} className="reveal">
                  <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, background: 'var(--purple)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', padding: '3px 8px' }}>
                    {product.score}% MATCH
                  </div>
                  <ProductCard product={product} />
                  <div style={{ padding: '0.5rem 1rem', background: 'rgba(124,58,237,0.08)', borderTop: 'none', fontSize: '0.72rem', color: 'var(--purple2)', minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                    ✦ {product.reason}
                  </div>
                </div>
              ))}
            </div>
            {wishlist.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem', border: '1px dashed var(--border)' }}>
                <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>Add more products to wishlist for better AI recommendations</p>
                <button className="btn btn-secondary" onClick={() => navigate('/catalog')}>BROWSE & WISHLIST</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
