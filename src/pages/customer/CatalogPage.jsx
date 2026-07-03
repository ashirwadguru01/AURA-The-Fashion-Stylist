import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../../components/shared/ProductCard';
import { setSearch, setCategory, clearFilters, setSortBy, fetchProducts, localFilter } from '../../store/slices/productSlice';
import AnimatedPage from '../../components/shared/AnimatedPage';
import { Search } from 'lucide-react';

export default function CatalogPage() {
  const dispatch = useDispatch();
  const { filtered, searchQuery, selectedCategory, sortBy } = useSelector(s => s.products);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(localFilter());
  }, [dispatch, searchQuery, selectedCategory, sortBy]);

  // Reset pagination index whenever filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCount(24);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy]);

  const displayedProducts = filtered.slice(0, visibleCount);

  return (
    <AnimatedPage>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '3rem 4rem 6rem' }}>
        
        {/* Editorial Luxury Page Header */}
        <div className="catalog-header-anim" style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
          
          {/* Breadcrumb / Section tag */}
          <span style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontSize: '0.68rem', 
            fontWeight: 800, 
            letterSpacing: '2px', 
            color: 'var(--purple2)', 
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            AURA Collection / {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
          </span>

          {/* Montserrat Bold Headline */}
          <h1 style={{ 
            fontFamily: "'Montserrat', sans-serif", 
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', 
            letterSpacing: '2px', 
            fontWeight: 900, 
            color: 'var(--text)', 
            textTransform: 'uppercase',
            lineHeight: 1.1,
            display: 'flex',
            alignItems: 'baseline',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {selectedCategory !== 'All' ? selectedCategory : 'The Atelier'}
          </h1>
        </div>

        {/* Modern Filter Actions & Search Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '2rem', 
          flexWrap: 'wrap', 
          marginBottom: '2.5rem' 
        }}>
          
          {/* Borderless expanding search field */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px', minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, color: 'var(--text)' }} />
            <input 
              className="catalog-search-input" 
              placeholder="Search our heritage products..."
              value={searchQuery} 
              onChange={e => dispatch(setSearch(e.target.value))} 
            />
          </div>

          {/* Sorting Dropdown & Clean Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <select 
              style={{ 
                background: 'var(--bg3)', 
                border: '1px solid var(--border)', 
                color: 'var(--text)', 
                padding: '0.75rem 1.5rem', 
                fontSize: '0.82rem', 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '0',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              value={sortBy} 
              onChange={e => dispatch(setSortBy(e.target.value))}>
              <option value="trending">🔥 Trending First</option>
              <option value="newest">✨ New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">⭐ Highly Rated</option>
            </select>

            {(searchQuery || selectedCategory !== 'All') && (
              <button 
                className="btn" 
                style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  letterSpacing: '1px', 
                  textTransform: 'uppercase', 
                  border: '1px solid var(--red)', 
                  color: 'var(--red)', 
                  background: 'none',
                  padding: '0.75rem 1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }} 
                onClick={() => dispatch(clearFilters())}>
                ✕ Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Pills with custom scrollbar */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            overflowX: 'auto', 
            paddingBottom: '1.25rem', 
            marginBottom: '3rem',
            borderBottom: '1px solid var(--border)',
            scrollbarWidth: 'none'
          }}
          className="tag-row">
          {['All', 'Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Lifestyle', 'Running'].map(cat => (
            <button 
              key={cat} 
              className={`tag-pill-custom ${selectedCategory === cat ? 'active' : ''}`} 
              onClick={() => dispatch(setCategory(cat))}>
              {cat}
            </button>
          ))}
        </div>

        {/* Animated Products Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }} className="catalog-header-anim">
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.8rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.75rem', color: 'var(--text)' }}>NO PIECES MATCH YOUR SEARCH</p>
            <p style={{ color: 'var(--text2)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Try redefining filters or enter a different keyword.</p>
            <button className="btn btn-primary" onClick={() => dispatch(clearFilters())} style={{ padding: '0.85rem 2rem' }}>CLEAR ALL FILTERS</button>
          </div>
        ) : (
          <>
            <div 
              key={`${selectedCategory}-${sortBy}-${searchQuery}`} 
              className="products-grid" 
              style={{ padding: '2px', gap: '2rem' }}>
              {displayedProducts.map((p, idx) => (
                <div 
                  key={p.id} 
                  className="catalog-card-anim" 
                  style={{ animationDelay: `${idx * 0.04}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
                <button 
                  className="btn btn-purple" 
                  style={{ 
                    padding: '1rem 3.5rem', 
                    fontFamily: "'Inter', sans-serif", 
                    fontSize: '0.82rem', 
                    fontWeight: 700, 
                    letterSpacing: '2px', 
                    textTransform: 'uppercase', 
                    cursor: 'pointer',
                    borderRadius: '0px',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.15)',
                    transition: 'all 0.3s ease'
                  }} 
                  onClick={() => setVisibleCount(prev => prev + 24)}>
                  LOAD MORE PIECES ({filtered.length - visibleCount} REMAINING)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AnimatedPage>
  );
}
