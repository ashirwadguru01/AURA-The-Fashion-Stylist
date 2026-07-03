import { useDispatch, useSelector } from 'react-redux';
import { setCartOpen } from '../../store/slices/uiSlice';
import { removeFromCart, clearCart } from '../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartOpen = useSelector(s => s.ui.cartOpen);
  const items = useSelector(s => s.cart.items);
  const total = items.reduce((a,i) => a + i.price * i.qty, 0);

  return (
    <>
      {cartOpen && <div onClick={() => dispatch(setCartOpen(false))} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:149 }} />}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div style={{ padding:'1.5rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.5rem', letterSpacing:'2px' }}>
            YOUR CART ({items.length})
          </h2>
          <button onClick={() => dispatch(setCartOpen(false))} style={{ background:'none', border:'1px solid var(--border)', padding:'0.4rem 0.75rem', cursor:'pointer', color:'var(--text)', fontSize:'0.75rem', fontWeight:700, letterSpacing:'1px' }}>CLOSE ✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'1rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🛒</div>
              <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.3rem', letterSpacing:'2px', marginBottom:'0.5rem' }}>YOUR CART IS EMPTY</p>
              <p style={{ fontSize:'0.82rem', color:'var(--text2)', marginBottom:'1.5rem' }}>Add products to continue</p>
              <button className="btn btn-primary" onClick={() => { dispatch(setCartOpen(false)); navigate('/catalog'); }}>BROWSE PRODUCTS</button>
            </div>
          ) : items.map(item => (
            <div key={`${item.id}-${item.size}`} style={{ display:'flex', gap:'1rem', padding:'1rem 0', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:72, height:72, flexShrink:0, overflow:'hidden', background:'var(--bg3)' }}>
                <img src={item.images[0]} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:'0.7rem', color:'var(--purple2)', fontWeight:700, letterSpacing:'1px', marginBottom:'0.15rem' }}>{item.brand}</p>
                <p style={{ fontWeight:600, fontSize:'0.875rem', marginBottom:'0.25rem' }}>{item.name}</p>
                <p style={{ fontSize:'0.75rem', color:'var(--text2)', marginBottom:'0.4rem' }}>Size: {item.size} · Qty: {item.qty}</p>
                <p style={{ fontWeight:800, fontSize:'0.9rem' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => dispatch(removeFromCart({ id:item.id, size:item.size }))}
                style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:'1rem', alignSelf:'flex-start', padding:'0.25rem' }}>✕</button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding:'1.5rem', borderTop:'1px solid var(--border)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
              <span style={{ fontSize:'0.8rem', color:'var(--text2)', fontWeight:600 }}>TOTAL</span>
              <span style={{ fontWeight:900, fontSize:'1.2rem' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => { dispatch(setCartOpen(false)); navigate('/checkout'); }}
              style={{ width:'100%', justifyContent:'center', padding:'0.875rem' }}>
              CHECKOUT →
            </button>
            <button onClick={() => dispatch(clearCart())} style={{ width:'100%', marginTop:'0.5rem', padding:'0.6rem', background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' }}>
              CLEAR CART
            </button>
          </div>
        )}
      </div>
    </>
  );
}
