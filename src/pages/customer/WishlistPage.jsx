import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWishlist, removeWishlistApi, clearWishlist } from '../../store/slices/wishlistSlice';
import { addToast } from '../../store/slices/uiSlice';
import { setSelectedProduct } from '../../store/slices/productSlice';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(s => s.wishlist.items);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleView = (product) => {
    dispatch(setSelectedProduct(product));
    navigate(`/product/${product.id}`);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ padding: '2.5rem 2rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '2px' }}>
              MY WISHLIST
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.82rem', marginTop: '0.25rem' }}>{items.length} saved items · Shared with AI for recommendations</p>
          </div>
          {items.length > 0 && (
            <button onClick={() => { dispatch(clearWishlist()); dispatch(addToast({ type: 'info', message: 'Wishlist cleared' })); }}
              style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text2)', background: 'none', border: '1px solid var(--border)', padding: '0.5rem 1rem', cursor: 'pointer' }}>
              CLEAR ALL
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', letterSpacing: '1px', marginBottom: '1rem', opacity: 0.2 }}>♡</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '2px', marginBottom: '0.75rem' }}>YOUR WISHLIST IS EMPTY</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '2rem' }}>Save products you love and we'll notify you when they're on sale</p>
          <button className="btn btn-primary" onClick={() => navigate('/catalog')}>START SHOPPING</button>
        </div>
      ) : (
        <>
          {/* AI banner */}
          <div style={{ margin: '1.5rem 2rem', padding: '1.25rem 1.5rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.5rem' }}>🤖</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.15rem' }}>AI is analysing your wishlist</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Based on {items.length} saved items, generating personalised recommendations</p>
            </div>
            <button className="btn btn-purple" style={{ fontSize: '0.72rem', padding: '0.5rem 1rem' }} onClick={() => navigate('/recommendations')}>SEE AI PICKS →</button>
          </div>

          <div className="products-grid" style={{ padding: '1px' }}>
            {items.map(product => {
              const discount = Math.round((1 - product.price / product.originalPrice) * 100);
              return (
                <div key={product.id} className="product-card" onClick={() => handleView(product)}
                  style={{ cursor: 'pointer', position: 'relative' }}>
                  <div className="product-img-wrap" style={{ height: 280 }}>
                    <img className="product-img" src={product.images[0]} alt={product.name} />
                    {discount > 0 && <span className="badge badge-sale" style={{ position: 'absolute', top: 10, right: 10 }}>-{discount}%</span>}
                  </div>
                  <div className="product-info">
                    <p className="product-brand">{product.brand}</p>
                    <p className="product-name">{product.name}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                      <button onClick={e => { e.stopPropagation(); dispatch(removeWishlistApi(product.id)); dispatch(addToast({ type: 'info', message: 'Removed from wishlist' })); }}
                        style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--text2)', background: 'none', border: '1px solid var(--border)', padding: '0.3rem 0.6rem', cursor: 'pointer' }}>
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
