import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleWishlistApi } from '../../store/slices/wishlistSlice';
import { addToast } from '../../store/slices/uiSlice';
import { setSelectedProduct } from '../../store/slices/productSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWishlisted = useSelector(s => s.wishlist.items.some(p => p.id === product.id));
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const totalStock = product.stores ? product.stores.reduce((a, s) => a + s.stock, 0) : (product.inStock ? 1 : 0);

  const handleClick = () => {
    dispatch(setSelectedProduct(product));
    navigate(`/product/${product.id}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlistApi(product));
    dispatch(addToast({ type: isWishlisted ? 'info' : 'success', message: isWishlisted ? 'Removed from wishlist' : `${product.name} added to wishlist` }));
  };

  return (
    <div className="product-card" onClick={handleClick}>
      {/* Image */}
      <div className="product-img-wrap" style={{ height: 280, position: 'relative' }}>
        <img className="product-img" src={product.images[0]} alt={product.name} loading="lazy" />
        {/* Top badges */}
        <div style={{ position:'absolute', top:10, left:10, display:'flex', flexDirection:'column', gap:4 }}>
          {product.tags.includes('new') && <span className="badge badge-new">New</span>}
          {product.tags.includes('sale') && discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
          {product.tags.includes('trending') && <span className="badge badge-hot">🔥</span>}
        </div>
        {/* Wishlist */}
        <button onClick={handleWishlist}
          style={{
            position:'absolute', bottom:10, right:10, width:36, height:36,
            border:'1px solid rgba(255,255,255,0.3)', background:'rgba(0,0,0,0.5)',
            backdropFilter:'blur(8px)', cursor:'pointer', display:'flex',
            alignItems:'center', justifyContent:'center', color: isWishlisted ? '#ef4444' : '#fff',
            transition:'all 0.2s',
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        {/* Out of stock */}
        {!product.inStock || totalStock === 0 ? (
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'#fff', fontWeight:700, fontSize:'0.78rem', letterSpacing:'2px', textTransform:'uppercase' }}>Out of Stock</span>
          </div>
        ) : null}
      </div>
      {/* Info */}
      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <p className="product-name">{product.name}</p>
        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.4rem' }}>
          <div style={{ display:'flex', gap:1 }}>
            {[1,2,3,4,5].map(s => (
              <svg key={s} width="10" height="10" viewBox="0 0 24 24"
                fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                stroke="#f59e0b" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span style={{ fontSize:'0.72rem', color:'var(--text2)' }}>{product.rating} · {product.reviews.toLocaleString('en-IN')} reviews</span>
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap:'0.5rem' }}>
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className="product-price-old">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
        <div style={{ marginTop:'0.4rem', fontSize:'0.72rem', color: totalStock > 0 ? 'var(--green)' : 'var(--red)' }}>
          {totalStock > 0 ? (product.stores ? `✓ Available at ${product.stores.filter(s=>s.stock>0).length} stores` : '✓ In Stock') : '✗ Currently unavailable'}
        </div>
      </div>
    </div>
  );
}
