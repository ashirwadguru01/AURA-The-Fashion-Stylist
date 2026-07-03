import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/slices/cartSlice';
import { addToast } from '../../store/slices/uiSlice';
import AnimatedPage from '../../components/shared/AnimatedPage';
import { CreditCard, Truck, Landmark, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(s => s.cart.items);
  const total = items.reduce((a, i) => a + i.price * i.qty, 0);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'card', // card | upi | cod
    deliveryOption: 'home', // home | pickup
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (items.length === 0 && !orderPlaced) {
    return (
      <AnimatedPage>
        <div style={{ textAlign: 'center', padding: '8rem 2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🛒</span>
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '2rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '1rem' }}>YOUR CART IS EMPTY</h1>
          <p style={{ color: 'var(--text2)', marginBottom: '2rem', maxWidth: '400px' }}>You cannot checkout without items in your shopping cart.</p>
          <button className="btn btn-primary" onClick={() => navigate('/catalog')} style={{ padding: '0.85rem 2rem' }}>BROWSE THE COLLECTION</button>
        </div>
      </AnimatedPage>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockId = 'AUR-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(mockId);
    setOrderPlaced(true);
    dispatch(clearCart());
    dispatch(addToast({ type: 'success', message: 'Order Placed Successfully! 🎉' }));
  };

  return (
    <AnimatedPage>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '3rem 4rem 6rem' }}>
        
        {/* Success Modal Overlay */}
        {orderPlaced && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(8px)', animation: 'catalogFadeIn 0.4s ease both'
          }}>
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              width: '90%', maxWidth: '520px', padding: '3rem 2.5rem', textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)', borderRadius: '0'
            }} className="catalog-card-anim">
              <CheckCircle2 size={64} style={{ color: 'var(--purple2)', margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '2rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '0.5rem' }}>ORDER PLACED!</h2>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'var(--text2)', fontSize: '1.05rem', marginBottom: '2rem' }}>
                Thank you for choosing AURA luxury couture.
              </p>
              
              <div style={{ background: 'var(--bg3)', padding: '1.25rem', border: '1px solid var(--border)', marginBottom: '2rem', textAlign: 'left' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Order Information</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text2)' }}>Order ID:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text2)' }}>Estimated Delivery:</span>
                  <span style={{ fontWeight: 700, color: 'var(--green)' }}>2-3 Business Days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text2)' }}>Delivery Type:</span>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{form.deliveryOption} Delivery</span>
                </div>
              </div>

              <button className="btn btn-primary" onClick={() => navigate('/home')} style={{ width: '100%', padding: '0.85rem' }}>
                CONTINUE SHOPPING →
              </button>
            </div>
          </div>
        )}

        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem', marginBottom: '3.5rem' }} className="catalog-header-anim">
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--purple2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Secure Checkout</span>
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '3rem', fontWeight: 900, letterSpacing: '1px' }}>CHECKOUT</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '4rem' }} className="catalog-card-anim">
          
          {/* Left Column - Billing, Delivery & Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Delivery Methods */}
            <div>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.15rem', fontWeight: 800, letterSpacing: '1px', borderBottom: '1.5px solid var(--text)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>1. DELIVERY OPTION</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div 
                  onClick={() => setForm({ ...form, deliveryOption: 'home' })}
                  style={{
                    border: form.deliveryOption === 'home' ? '2px solid var(--purple2)' : '1px solid var(--border)',
                    padding: '1.5rem', cursor: 'pointer', background: 'var(--bg2)', transition: 'all 0.2s',
                    display: 'flex', gap: '1rem', alignItems: 'center'
                  }}>
                  <Truck size={24} style={{ color: form.deliveryOption === 'home' ? 'var(--purple2)' : 'var(--text2)' }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>Home Delivery</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>Dispatch inside 24 hours</p>
                  </div>
                </div>
                <div 
                  onClick={() => setForm({ ...form, deliveryOption: 'pickup' })}
                  style={{
                    border: form.deliveryOption === 'pickup' ? '2px solid var(--purple2)' : '1px solid var(--border)',
                    padding: '1.5rem', cursor: 'pointer', background: 'var(--bg2)', transition: 'all 0.2s',
                    display: 'flex', gap: '1rem', alignItems: 'center'
                  }}>
                  <Landmark size={24} style={{ color: form.deliveryOption === 'pickup' ? 'var(--purple2)' : 'var(--text2)' }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>In-store Pickup</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>Collect at nearby Flagship</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.15rem', fontWeight: 800, letterSpacing: '1px', borderBottom: '1.5px solid var(--text)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>2. SHIPPING DETAILS</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>First Name</label>
                  <input className="input" type="text" placeholder="Rahul" required value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Last Name</label>
                  <input className="input" type="text" placeholder="Sharma" required value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
                  <input className="input" type="email" placeholder="rahul@domain.com" required value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Phone Number</label>
                  <input className="input" type="tel" placeholder="+91 98765 43210" required value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Delivery Address</label>
                <input className="input" type="text" placeholder="Flat No / Street / Landmark" required value={form.address} onChange={e=>setForm({...form, address: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>City</label>
                  <input className="input" type="text" placeholder="Mumbai" required value={form.city} onChange={e=>setForm({...form, city: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>ZIP Code</label>
                  <input className="input" type="text" placeholder="400001" required value={form.zip} onChange={e=>setForm({...form, zip: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.15rem', fontWeight: 800, letterSpacing: '1px', borderBottom: '1.5px solid var(--text)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>3. SECURE PAYMENT</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} /> },
                  { id: 'upi', label: 'UPI (Paytm / GPay / PhonePe)', icon: <span>⚡</span> },
                  { id: 'cod', label: 'Cash on Delivery (COD)', icon: <span>💵</span> }
                ].map(p => (
                  <label key={p.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.25rem', background: 'var(--bg2)', border: form.paymentMethod === p.id ? '2px solid var(--purple2)' : '1px solid var(--border)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={form.paymentMethod === p.id} 
                        onChange={() => setForm({ ...form, paymentMethod: p.id })}
                        style={{ accentColor: 'var(--purple2)' }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.label}</span>
                    </div>
                    <span style={{ color: 'var(--text2)' }}>{p.icon}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '2rem', sticky: 'top', top: '100px' }}>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.1rem', fontWeight: 800, letterSpacing: '1px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>ORDER SUMMARY</h3>
              
              {/* Product list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, overflow: 'hidden', background: 'var(--bg3)', flexShrink: 0 }}>
                      <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.78rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>Size: {item.size} · Qty: {item.qty}</p>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text2)' }}>
                  <span>Cart Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text2)' }}>
                  <span>GST (18%)</span>
                  <span>₹{Math.round(total * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text2)' }}>
                  <span>Delivery Fee</span>
                  <span style={{ color: 'var(--green)' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.2rem', color: 'var(--text)', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <span>Grand Total</span>
                  <span>₹{Math.round(total * 1.18).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Secure tag */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', background: 'var(--bg3)', padding: '0.75rem', color: 'var(--text2)', fontSize: '0.72rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                <ShieldCheck size={14} style={{ color: 'var(--purple2)' }} />
                <span>SSL Encrypted Transaction Guarantee</span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontWeight: 800 }}>
                PLACE SECURE ORDER →
              </button>
            </div>
          </div>

        </form>

      </div>
    </AnimatedPage>
  );
}
