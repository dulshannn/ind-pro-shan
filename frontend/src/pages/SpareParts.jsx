// pages/SpareParts.jsx – Premium Spare Parts listing page
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getSpareParts } from '../services/sparePartService';
import { getCategories } from '../services/categoryService';
import useCart from '../hooks/useCart';
import Spinner from '../components/Spinner';
import { imageUrl } from '../utils/imageUrl';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;

const filterInputStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: '0.65rem 0.9rem',
    color: 'var(--text)',
    outline: 'none',
    fontSize: '0.85rem'
};

const SpareParts = () => {
    const [parts, setParts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', category: '', brand: '' });
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState(null);

    const fetchParts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.category) params.category = filters.category;
            if (filters.brand) params.brand = filters.brand;
            const { data } = await getSpareParts(params);
            setParts(data.spareParts || []);
        } finally { setLoading(false); }
    }, [filters]);

    useEffect(() => {
        getCategories().then(res => setCategories(res.data)).catch(console.error);
    }, []);

    useEffect(() => { fetchParts(); }, [fetchParts]);

    const set = (k) => (e) => setFilters(p => ({ ...p, [k]: e.target.value }));

    const handleAddToCart = (e, part) => {
        e.preventDefault();
        addToCart(part, 1);
        setAddedId(part._id);
        setTimeout(() => setAddedId(null), 2000);
    };

    return (
        <div>
            {/* ── Hero ── */}
            <div className="page-hero">
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
                    <div className="section-label fade-in-up">Genuine Parts</div>
                    <h1 className="fade-in-up-2" style={{ fontSize: '3rem', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>Spare Parts</h1>
                    <p className="fade-in-up-3" style={{ color: 'var(--muted)', fontSize: '1.05rem', fontWeight: 300, maxWidth: 480, lineHeight: 1.6 }}>
                        Find authentic OEM and high-quality aftermarket parts for your vehicle, imported directly from Japan.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
                {/* ── Filters ── */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', marginBottom: '2.5rem', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                        <div>
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Search Parts</label>
                            <input style={{ ...filterInputStyle, width: '100%' }} placeholder="Part name, ID..." value={filters.search} onChange={set('search')} />
                        </div>
                        <div>
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Category</label>
                            <select className="form-select" style={{ ...filterInputStyle, width: '100%' }} value={filters.category} onChange={set('category')}>
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Brand</label>
                            <input style={{ ...filterInputStyle, width: '100%' }} placeholder="Toyota, Denso..." value={filters.brand} onChange={set('brand')} />
                        </div>
                    </div>
                </div>

                {/* ── Grid ── */}
                {loading ? <Spinner /> : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                                Showing <strong style={{ color: 'white' }}>{parts.length}</strong> parts
                            </div>
                        </div>

                        {parts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🔧</div>
                                <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>No parts found</h3>
                                <p>Try adjusting your search terms or category filter.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.5rem' }}>
                                {parts.map((p, i) => {
                                    const wasAdded = addedId === p._id;
                                    return (
                                        <div key={p._id} style={{ position: 'relative' }}>
                                            <Link to={`/spareparts/${p._id}`} style={{ textDecoration: 'none', display: 'block', height: '100%', animationDelay: `${i * 30}ms`, animation: 'fadeInUp2 0.5s cubic-bezier(0.22,1,0.36,1) both' }}>
                                                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                    {p.image ? (
                                                        <div style={{ height: 180, overflow: 'hidden', background: '#0f0f1c', position: 'relative' }}>
                                                            <img
                                                                src={imageUrl(p.image)}
                                                                alt={p.partName}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<div style="height:180px;display:flex;align-items:center;justify-content:center;font-size:3rem;background:linear-gradient(135deg,#1a1a2e,#0f0f1c)">🔧</div>'; }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="img-placeholder" style={{ height: 180, fontSize: '3rem' }}>🔧</div>
                                                    )}
                                                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem', gap: '0.75rem' }}>
                                                            <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{p.partName}</h3>
                                                            {p.stock > 0 ? (
                                                                <span className="badge badge-success" style={{ flexShrink: 0, padding: '0.15rem 0.5rem', fontSize: '0.65rem' }}>{p.stock} In Stock</span>
                                                            ) : (
                                                                <span className="badge badge-danger" style={{ flexShrink: 0, padding: '0.15rem 0.5rem', fontSize: '0.65rem' }}>Out of Stock</span>
                                                            )}
                                                        </div>
                                                        <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                                            {p.brand} · {p.category?.categoryName || 'Uncategorized'}
                                                        </div>
                                                        {p.compatibleModels?.length > 0 && (
                                                            <div style={{ color: 'var(--indigo)', fontSize: '0.75rem', marginBottom: '0.8rem', background: 'var(--indigo-soft)', display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 500 }}>
                                                                Fits: {p.compatibleModels.slice(0, 2).join(', ')}{p.compatibleModels.length > 2 ? ' ...' : ''}
                                                            </div>
                                                        )}
                                                        <div style={{ flex: 1 }} />
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                                            <div style={{ color: '#e8384f', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>{fmtPrice(p.price)}</div>
                                                            <button
                                                                onClick={(e) => handleAddToCart(e, p)}
                                                                disabled={p.stock <= 0 || wasAdded}
                                                                style={{
                                                                    padding: '0.4rem 0.8rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
                                                                    cursor: p.stock <= 0 ? 'not-allowed' : 'pointer',
                                                                    background: wasAdded ? 'rgba(34,197,94,0.12)' : p.stock <= 0 ? 'rgba(255,255,255,0.04)' : 'rgba(232,56,79,0.12)',
                                                                    color: wasAdded ? '#22c55e' : p.stock <= 0 ? 'var(--muted)' : '#e8384f',
                                                                    border: `1px solid ${wasAdded ? 'rgba(34,197,94,0.3)' : p.stock <= 0 ? 'var(--border)' : 'rgba(232,56,79,0.3)'}`,
                                                                    transition: 'all 0.2s',
                                                                    display: 'flex', alignItems: 'center', gap: '0.35rem'
                                                                }}>
                                                                {wasAdded ? '✅ Added' : p.stock <= 0 ? 'Sold Out' : (
                                                                    <>
                                                                        <span style={{ fontSize: '1rem', lineHeight: 0 }}>+</span> Cart
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SpareParts;
