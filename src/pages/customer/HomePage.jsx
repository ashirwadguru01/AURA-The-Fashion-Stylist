import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCategory } from '../../store/slices/productSlice';
import AnimatedPage from '../../components/shared/AnimatedPage';
import { ArrowLeft, ArrowRight, Camera, Sparkles, MapPin } from 'lucide-react';

// Slideshow Content for Hero (Formal Luxe style matching Tommy Hilfiger / Louis Philippe)
const HERO_SLIDES = [
  {
    title: 'THE LUXURY TAILORING',
    subtitle: 'COUTURE SHIRTS & BLAZERS',
    desc: 'Uncompromising craftsmanship. Meticulously cut from double-ply Egyptian cotton for a sharp silhouette.',
    bg: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&q=80',
    tag: 'PREMIUM COUTURE',
    category: 'Men'
  },
  {
    title: 'SUMMER ESSENTIALS',
    subtitle: 'THE MINIMAL STREETWEAR EDIT',
    desc: 'Oversized silhouettes meets clean utility. Designed to withstand warm urban environments with breathable tech styling.',
    bg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
    tag: 'NEW DROPS',
    category: 'Women'
  },
  {
    title: 'ELITE ATHLETIC WEAR',
    subtitle: 'PERFORMANCE IN MOTION',
    desc: 'Technical tees and hoodies crafted for ultimate breathability. Standardized pricing starting at ₹1,499 INR.',
    bg: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=1920&q=80',
    tag: 'PERFORMANCE READY',
    category: 'Kids'
  }
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useReveal();

  const [activeSlide, setActiveSlide] = useState(0);

  // Automatic slideshow transition
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goFilter = (catName) => {
    dispatch(setCategory(catName));
    navigate('/catalog');
  };

  const nextSlide = () => setActiveSlide(s => (s + 1) % HERO_SLIDES.length);
  const prevSlide = () => setActiveSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <AnimatedPage>
      <div style={{ background: 'var(--bg)', overflowX: 'hidden' }}>
        
        {/* ── HERO SLIDESHOW (Louis Philippe Luxury Carousel) ── */}
        <section style={{ height: '80vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
          {HERO_SLIDES.map((slide, idx) => (
            <div key={idx} 
                 style={{ 
                   position: 'absolute', inset: 0, 
                   opacity: idx === activeSlide ? 1 : 0, 
                   transition: 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                   zIndex: idx === activeSlide ? 1 : 0
                 }}>
              {/* Visual backdrop */}
              <div style={{ 
                position: 'absolute', inset: 0, 
                backgroundImage: `url(${slide.bg})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                filter: 'brightness(0.55)',
                transform: idx === activeSlide ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 6s ease'
              }} />
              
              {/* Slider Content */}
              <div style={{ 
                position: 'absolute', inset: 0, 
                display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                padding: '0 8%', zIndex: 2, color: '#fff'
              }}>
                <span style={{ 
                  fontSize: '0.75rem', fontWeight: 800, letterSpacing: '4px', 
                  color: 'var(--purple2)', textTransform: 'uppercase', marginBottom: '1rem',
                  transform: idx === activeSlide ? 'translateY(0)' : 'translateY(20px)',
                  opacity: idx === activeSlide ? 1 : 0,
                  transition: 'all 0.8s ease 0.2s'
                }}>
                  ✦ {slide.tag}
                </span>
                <h2 style={{ 
                  fontFamily: "'Montserrat', sans-serif", 
                  fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', 
                  fontWeight: 900,
                  lineHeight: 0.95, 
                  letterSpacing: '1px',
                  transform: idx === activeSlide ? 'translateY(0)' : 'translateY(30px)',
                  opacity: idx === activeSlide ? 1 : 0,
                  transition: 'all 0.8s ease 0.4s'
                }}>
                  {slide.title}
                </h2>
                <h3 style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', 
                  fontWeight: 300,
                  color: 'rgba(255, 255, 255, 0.85)',
                  margin: '0.5rem 0 1.5rem',
                  transform: idx === activeSlide ? 'translateY(0)' : 'translateY(30px)',
                  opacity: idx === activeSlide ? 1 : 0,
                  transition: 'all 0.8s ease 0.5s'
                }}>
                  {slide.subtitle}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', 
                  maxWidth: '520px', lineHeight: 1.6, marginBottom: '2.5rem',
                  transform: idx === activeSlide ? 'translateY(0)' : 'translateY(30px)',
                  opacity: idx === activeSlide ? 1 : 0,
                  transition: 'all 0.8s ease 0.6s'
                }}>
                  {slide.desc}
                </p>
                <div style={{ 
                  display: 'flex', gap: '1rem',
                  transform: idx === activeSlide ? 'translateY(0)' : 'translateY(30px)',
                  opacity: idx === activeSlide ? 1 : 0,
                  transition: 'all 0.8s ease 0.7s'
                }}>
                  <button className="btn-hero solid" onClick={() => goFilter(slide.category)}>
                    EXPLORE COLLECTION →
                  </button>
                  <button className="btn-hero outline" onClick={() => navigate('/catalog')}>
                    VIEW FULL CATALOG
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel controls */}
          <div style={{ position: 'absolute', bottom: '2rem', right: '5%', zIndex: 10, display: 'flex', gap: '1rem' }}>
            <button onClick={prevSlide} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', cursor: 'pointer', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={16} />
            </button>
            <button onClick={nextSlide} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', cursor: 'pointer', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Slide Indicators */}
          <div style={{ position: 'absolute', bottom: '2.5rem', left: '8%', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)} 
                style={{ 
                  width: i === activeSlide ? '30px' : '8px', 
                  height: '8px', 
                  borderRadius: '99px',
                  background: i === activeSlide ? 'var(--purple2)' : 'rgba(255,255,255,0.4)', 
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s' 
                }} />
            ))}
          </div>
        </section>

        {/* ── USP FLOATER ── */}
        <div className="feature-bar" style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', justifyContent: 'space-around' }}>
          {['Premium Craftsmanship', 'Live YOLO AR Try-On', 'Instant In-store Reservation', 'Styling via AI Recommendation'].map((usp, i) => (
            <span key={i} style={{ color: 'var(--text2)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>✦ {usp}</span>
          ))}
        </div>

        {/* ── SECTION 1: TOMMY HILFIGER-STYLE 5-COLUMN CATEGORY CARD GRID ── */}
        <section style={{ padding: '6rem 4rem 4rem', background: 'var(--bg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem' }} className="reveal">
            {[
              { label: 'Shop Tops & Sweaters', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80', action: 'Men' },
              { label: 'Shop Bottoms', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80', action: 'Women' },
              { label: 'Shop Dresses & Skirts', img: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80', action: 'Women' },
              { label: 'Shop Jackets & Coats', img: 'https://images.unsplash.com/photo-1584545284372-f22510eb7c26?w=600&q=80', action: 'Kids' },
              { label: 'Shop Shoes & Accessories', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', action: 'Footwear' },
            ].map((item, idx) => (
              <div key={idx} 
                   onClick={() => goFilter(item.action)}
                   style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Product image container with off-white style background */}
                <div style={{ 
                  background: 'var(--bg3)', 
                  height: '340px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '1.5rem',
                  overflow: 'hidden'
                }}>
                  <img src={item.img} alt={item.label} 
                       style={{ 
                         maxWidth: '100%', 
                         maxHeight: '100%', 
                         objectFit: 'contain',
                         transition: 'transform 0.4s ease'
                       }}
                       onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                       onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                </div>
                
                {/* Underlined title links */}
                <div style={{ textAlign: 'left' }}>
                  <span style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    borderBottom: '1.5px solid var(--text)',
                    paddingBottom: '2px',
                    display: 'inline-block'
                  }}>
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: EDITORIAL SPOTLIGHT (Split layout showcasing style collection) ── */}
        <section style={{ padding: '4rem', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }} className="reveal">
            
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '3px', color: 'var(--purple2)', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Luxe Couture</span>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.05, letterSpacing: '1px', marginBottom: '1.5rem' }}>
                THE ART OF TAILORED FORMALS
              </h2>
              <p style={{ color: 'var(--text2)', fontSize: '0.92rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                Our bespoke suiting line blends structural perfection with custom wool-blended textiles. Engineered for the modern businessman who appreciates detailed sartorial precision.
              </p>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <button className="btn btn-primary" onClick={() => goFilter('Lifestyle')}>EXPLORE COLLECTION</button>
                <button className="btn btn-secondary" onClick={() => navigate('/catalog')}>ALL SUITS</button>
              </div>
            </div>

            <div style={{ position: 'relative', height: '520px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80" alt="Couture Suit model"
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.25rem' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--purple2)', letterSpacing: '1px', textTransform: 'uppercase' }}>EXCLUSIVE LINE</span>
                <p style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '0.2rem' }}>Royal Tuxedo Set</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: '0.25rem' }}>Reserve online for trials starting at ₹18,500 INR</p>
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION 3: INNOVATIVE AR VIRTUAL TRY-ON (Split Showcase) ── */}
        <section style={{ padding: '6rem 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            
            <div style={{ position: 'relative', height: '400px', border: '1.5px dashed var(--purple2)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="reveal">
              {/* Camera mock graphic overlays */}
              <div style={{ position: 'absolute', top: 15, left: 15, width: 25, height: 25, borderTop: '3px solid var(--purple2)', borderLeft: '3px solid var(--purple2)' }} />
              <div style={{ position: 'absolute', top: 15, right: 15, width: 25, height: 25, borderTop: '3px solid var(--purple2)', borderRight: '3px solid var(--purple2)' }} />
              <div style={{ position: 'absolute', bottom: 15, left: 15, width: 25, height: 25, borderBottom: '3px solid var(--purple2)', borderLeft: '3px solid var(--purple2)' }} />
              <div style={{ position: 'absolute', bottom: 15, right: 15, width: 25, height: 25, borderBottom: '3px solid var(--purple2)', borderRight: '3px solid var(--purple2)' }} />
              
              <div style={{ textAlign: 'center', zIndex: 2 }}>
                <Camera size={44} style={{ color: 'var(--purple2)', animation: 'float 3s infinite' }} />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.8rem', fontWeight: 800, letterSpacing: '1px', marginTop: '1.25rem', color: 'var(--text)' }}>YOLO FIT SIMULATOR</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Real-time poses calibration</p>
              </div>
              {/* Styling ambient circle */}
              <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'rgba(197, 168, 128, 0.08)', borderRadius: '50%' }} />
            </div>

            <div className="reveal">
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '3px', color: 'var(--purple2)', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>AUGMENTED REALITY</span>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.05, letterSpacing: '1px', marginBottom: '1.5rem' }}>
                VIRTUAL DRESSING ROOM
              </h2>
              <p style={{ color: 'var(--text2)', fontSize: '0.92rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                Avoid incorrect sizes. Allow our smart YOLO-v8 pose estimator to calibrate your physical measurements in real-time, mapping 3D shoes directly to your feet.
              </p>
              <button className="btn btn-primary" style={{ padding: '0.85rem 2rem' }} onClick={() => navigate('/tryon')}>
                LAUNCH AR SCANNER
              </button>
            </div>

          </div>
        </section>

        {/* ── SECTION 4: AIRECOMMENDER & STYLE WISHLIST (Minimal deep violet promo block) ── */}
        <section style={{ padding: '6rem 4rem', background: 'var(--purple)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }} className="reveal">
            <Sparkles size={36} style={{ margin: '0 auto 1.5rem', color: 'rgba(255,255,255,0.8)' }} />
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '3.5rem', fontWeight: 800, letterSpacing: '2px', lineHeight: 0.95, marginBottom: '1rem' }}>
              PERSONALIZED STYLE RECOMMENDATIONS
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '640px', margin: '1rem auto 2.5rem' }}>
              Our smart recommendation algorithms study your styling preferences, wishlist interactions, and size choices to construct matching accessory collections tailored to you.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-hero solid" style={{ background: '#fff', color: '#000', border: '2px solid #fff' }} onClick={() => navigate('/recommendations')}>
                VIEW YOUR AI LOOKBOOK
              </button>
              <button className="btn-hero outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }} onClick={() => navigate('/wishlist')}>
                OPEN WISHLIST
              </button>
            </div>
          </div>
          {/* Design elements */}
          <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', left: '-5%', bottom: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        </section>

        {/* ── SECTION 5: FLAGSHIP RESERVATION OMNICHANNEL BINDING ── */}
        <section style={{ padding: '6rem 4rem', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            
            <div className="reveal">
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '3px', color: 'var(--purple2)', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>OMNICHANNEL EXPERIENCES</span>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.05, letterSpacing: '1px', marginBottom: '1.5rem' }}>
                RESERVE ONLINE, COLLECT IN 2 HOURS
              </h2>
              <p style={{ color: 'var(--text2)', fontSize: '0.92rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                Hold items at any of our flagship branches in Mumbai, Bangalore, Chennai or Delhi. Try on reserved fits at physical fitting desks with no immediate payment required.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/catalog')}>
                START RESERVING
              </button>
            </div>

            <div className="reveal" style={{ position: 'relative', height: '400px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" alt="Flagship store interior"
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 25, right: 25, background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.25rem', width: '250px' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <MapPin size={14} style={{ color: 'var(--purple2)' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>Mumbai Bandra Flagship</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text2)', paddingLeft: '1.25rem' }}>Linking Road, Mumbai</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--green)', paddingLeft: '1.25rem', marginTop: '0.5rem', fontWeight: 700 }}>● Fitting Desks Open till 10 PM</p>
              </div>
            </div>

          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '5rem 4rem 4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '4rem' }}>
          <div>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.8rem', fontWeight: 800, letterSpacing: '4px', marginBottom: '1.5rem', color: 'var(--text)' }}>AURA</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7 }}>
              The absolute pinnacle of luxury omnichannel fashion. Reserve online for immediate physical trials at premium flagship stores across India.
            </p>
          </div>
          {[
            { title: 'MEN COUTURE', links: ['Couture Shirts', 'Formal Blazers', 'Tailored Trousers', 'Luxe Accessories'] },
            { title: 'WOMEN COLLECTION', links: ['Summer Dresses', 'Active Leggings', 'Light Hoodies', 'Premium Tees'] },
            { title: 'AI SERVICES', links: ['AI Stylist Analysis', 'YOLO v8 AR Camera Fitting', 'Flagship Store Stock Lookup'] }
          ].map((col, idx) => (
            <div key={idx}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem', color: 'var(--text2)' }}>{col.title}</p>
              {col.links.map(link => (
                <p key={link} 
                   style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '0.75rem', cursor: 'pointer', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = 'var(--text)'}
                   onMouseLeave={e => e.target.style.color = 'var(--text3)'}>
                  {link
                  }
                </p>
              ))}
            </div>
          ))}
        </footer>

      </div>
    </AnimatedPage>
  );
}
