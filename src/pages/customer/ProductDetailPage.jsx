import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductDetail } from '../../store/slices/productSlice';
import { toggleWishlistApi } from '../../store/slices/wishlistSlice';
import { createReservationApi } from '../../store/slices/reservationSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { addToast, toggleCart } from '../../store/slices/uiSlice';
import ProductCard from '../../components/shared/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, items } = useSelector(s => s.products);
  const isWishlisted = useSelector(s => s.wishlist.items.some(p => p.id === product?.id));

  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(id));
    }
  }, [dispatch, id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '1rem', color: 'var(--text)' }}>LOADING ARTISAN PIECE...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', letterSpacing: '2px', marginBottom: '1rem' }}>PRODUCT NOT FOUND</p>
        <button className="btn btn-primary" onClick={() => navigate('/catalog')}>BACK TO SHOP</button>
      </div>
    </div>
  );

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const related = items.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) { dispatch(addToast({ type: 'warning', message: 'Please select a size' })); return; }
    dispatch(addToCart({ product, size: selectedSize }));
    dispatch(addToast({ type: 'success', message: `${product.name} added to cart!` }));
    dispatch(toggleCart());
  };

  const handleReserve = () => {
    if (!selectedSize) { dispatch(addToast({ type: 'warning', message: 'Please select a size' })); return; }
    setShowModal(true);
  };

  const confirmReservation = async () => {
    if (!selectedStore) { dispatch(addToast({ type: 'warning', message: 'Select a store' })); return; }
    const result = await dispatch(createReservationApi({
      productId: product.id,
      storeId: selectedStore.id,
      size: selectedSize
    }));
    if (createReservationApi.fulfilled.match(result)) {
      setDone(true);
      setTimeout(() => {
        setShowModal(false);
        setDone(false);
        dispatch(addToast({ type: 'success', message: 'Reservation confirmed! 🎉' }));
        dispatch(fetchProductDetail(product.id));
      }, 1500);
    } else {
      dispatch(addToast({ type: 'error', message: result.payload || 'Reservation failed.' }));
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div>
        <div style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--text2)', display: 'flex', gap: '0.5rem', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: 'inherit' }}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/catalog')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: 'inherit' }}>Shop</button>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(320px, 420px)', minHeight: 'calc(100vh - 100px)', maxWidth: 1200, margin: '0 auto', flexWrap: 'wrap' }}>
        {/* Images */}
        <div style={{ position: 'sticky', top: 60, alignSelf: 'start' }}>
          <div style={{ height: 'calc(100vh - 120px)', minHeight: '400px', overflow: 'hidden', background: 'var(--bg3)', position: 'relative' }}>
            <img src={product.images[selectedImg] || product.images[0]} alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
            {product.images.length > 1 && (
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setSelectedImg(i)}
                    style={{ width: 52, height: 52, overflow: 'hidden', cursor: 'pointer', opacity: selectedImg === i ? 1 : 0.5, border: selectedImg === i ? '2px solid #fff' : '2px solid transparent', transition: 'all 0.2s' }}>
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details panel */}
        <div style={{ padding: '2.5rem 2rem', overflowY: 'auto', borderLeft: '1px solid var(--border)' }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {product.tags.map(t => (
              <span key={t} className={`badge ${t === 'new' ? 'badge-new' : t === 'sale' ? 'badge-sale' : t === 'trending' ? 'badge-hot' : 'badge-ok'}`}
                style={{ textTransform: 'uppercase' }}>{t}</span>
            ))}
          </div>

          {/* Name */}
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--text2)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{product.brand}</p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '1px', marginBottom: '0.75rem', lineHeight: 1.1 }}>{product.name.toUpperCase()}</h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} width="14" height="14" viewBox="0 0 24 24"
                  fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{product.rating} · {product.reviews.toLocaleString('en-IN')} reviews</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.8rem', letterSpacing: '1px' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: '1rem', color: 'var(--text2)', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="badge badge-sale">-{discount}%</span>
              </>
            )}
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.75rem' }}>{product.description}</p>

          {/* Size */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Select Size {selectedSize && <span style={{ color: 'var(--purple2)' }}>· {selectedSize}</span>}
              </span>
              <button style={{ fontSize: '0.72rem', color: 'var(--text2)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Size Guide</button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.sizes.map(sz => (
                <button key={sz} className={`size-btn ${selectedSize === sz ? 'active' : ''}`} onClick={() => setSelectedSize(sz)}>{sz}</button>
              ))}
            </div>
          </div>

          {/* QTY */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>QTY</span>
            <div className="qty-ctrl" style={{ maxWidth: '130px' }}>
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.875rem' }} onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <button onClick={() => { dispatch(toggleWishlistApi(product)); dispatch(addToast({ type: isWishlisted ? 'info' : 'success', message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ♡' })); }}
              style={{ width: 50, border: '1.5px solid var(--border)', background: 'none', cursor: 'pointer', color: isWishlisted ? '#ef4444' : 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: '2rem' }} onClick={handleReserve}>
            📍 RESERVE IN-STORE
          </button>

          {/* Store availability */}
          {product.stores.length > 0 && (
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📍 AVAILABLE AT NEARBY STORES
              </p>
              {product.stores.map(store => (
                <div key={store.id} className="store-row">
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{store.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{store.km} km away</p>
                  </div>
                  <span className={`badge ${store.stock > 0 ? 'badge-ok' : 'badge-no'}`}>
                    {store.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border)' }}>
          <div className="section-header">
            <h2 className="section-title">YOU MAY ALSO LIKE</h2>
          </div>
          <div className="products-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Reserve Modal */}
      {showModal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            {done ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>RESERVED!</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Staff has been notified. Pick up within 4 days.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '2px', marginBottom: '0.25rem' }}>RESERVE IN-STORE</h2>
                <p style={{ color: 'var(--text2)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>Choose a store to hold this product</p>
                <div style={{ background: 'var(--bg3)', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text2)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Product</p>
                    <p style={{ fontWeight: 700 }}>{product.name}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text2)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Size</p>
                    <p style={{ fontWeight: 700 }}>UK {selectedSize}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--text2)' }}>Select Store</p>
                {product.stores.filter(s => s.stock > 0).map(store => (
                  <label key={store.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', marginBottom: '0.5rem', border: `1.5px solid ${selectedStore?.id === store.id ? 'var(--text)' : 'var(--border)'}`, cursor: 'pointer', transition: 'border 0.2s', background: selectedStore?.id === store.id ? 'var(--surface)' : 'transparent' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input type="radio" name="storeSelect" checked={selectedStore?.id === store.id} onChange={() => setSelectedStore(store)} style={{ accentColor: 'var(--text)' }} />
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{store.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{store.km} km away</p>
                      </div>
                    </div>
                    <span className="badge badge-ok">✓ In Stock</span>
                  </label>
                ))}
                <p style={{ fontSize: '0.75rem', color: 'var(--green)', margin: '1rem 0', padding: '0.75rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  ✓ No payment required — pay when you collect in-store
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>CANCEL</button>
                  <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={confirmReservation}>CONFIRM RESERVATION</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
