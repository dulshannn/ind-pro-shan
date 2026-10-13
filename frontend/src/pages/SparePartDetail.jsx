// pages/SparePartDetail.jsx – Premium Spare Part Detail page (light theme)
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSparePartById } from '../services/sparePartService';
import useCart from '../hooks/useCart';
import Spinner from '../components/Spinner';
import { imageUrl } from '../utils/imageUrl';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;
const C = { text: '#1a2035', sub: '#64748b', price: '#e8384f', border: 'rgba(0,0,0,0.08)' };

const SparePartDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [part, setPart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        getSparePartById(id)
            .then(r => setPart(r.data))
            .catch(() => setPart(null))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        addToCart(part, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(part, qty);
        navigate('/cart');
    };

    const handleInquiry = () => {
        navigate('/inquiry', {
            state: {
                partId: part._id,
                partName: part.partName,
                brand: part.brand,
                price: part.price,
                category: part.category?.categoryName || '',
            }
        });
    };

    if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}><Spinner /></div>;

    if (!part) return (
        <div style={{ textAlign: 'center', padding: '10rem 2rem', color: C.sub, minHeight: '80vh' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>🔧</div>
            <h2 style={{ color: C.text, fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Oops!</h2>
            <p style={{ maxWidth: 400, margin: '0 auto 1.5rem' }}>Part not found or no longer available.</p>
            <Link to="/spareparts" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: 10 }}>← Browse Parts</Link>
        </div>
    );

    const outOfStock = part.stock <= 0;
    const partImg = imageUrl(part.image);

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
            <Link to="/spareparts" style={{ color: C.sub, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.sub}>
                <span style={{ fontSize: '1.1rem' }}>←</span> Back to Spare Parts
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>

                {/* ── Img section ── */}
                <div className="fade-in-up">
                    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {partImg ? (
                            <img
                                src={partImg}
                                alt={part.partName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<div style="font-size:7rem;">🔧</div>'; }}
                            />
                        ) : (
                            <div style={{ fontSize: '7rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))' }}>🔧</div>
                        )}
                    </div>
                </div>

                {/* ── Info section ── */}
                <div className="fade-in-up-2">
                    <span style={{ fontSize: '0.72rem', color: '#7c3aed', background: '#ede9fe', border: '1px solid #ddd6fe', padding: '0.25rem 0.8rem', borderRadius: 99, marginBottom: '0.75rem', display: 'inline-block', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {part.category?.categoryName || 'Uncategorized'}
                    </span>
                    <h1 style={{ color: C.text, fontSize: '2rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', margin: '0.25rem 0 0.5rem' }}>{part.partName}</h1>
                    <div style={{ color: C.sub, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                        Brand: <strong style={{ color: C.text, fontWeight: 600 }}>{part.brand}</strong>
                    </div>

                    <div style={{ color: C.price, fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.04em' }}>
                        {fmtPrice(part.price)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        {part.stock > 0 ? (
                            <span className="badge badge-success" style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}>
                                ✓ In Stock ({part.stock} available)
                            </span>
                        ) : (
                            <span className="badge badge-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}>
                                ✗ Out of Stock
                            </span>
                        )}
                    </div>

                    {part.compatibleModels?.length > 0 && (
                        <div style={{ padding: '1.25rem', marginBottom: '1.5rem', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12 }}>
                            <div style={{ color: C.sub, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Compatible Models</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {part.compatibleModels.map(m => (
                                    <span key={m} style={{ background: '#f8fafc', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: 8, fontWeight: 500 }}>{m}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {part.description && (
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ color: C.sub, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Description</div>
                            <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 400, margin: 0 }}>{part.description}</p>
                        </div>
                    )}

                    {/* Qty + Add to Cart */}
                    {!outOfStock && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 42, height: 44, background: 'transparent', border: 'none', color: C.text, fontSize: '1.2rem', cursor: 'pointer', transition: 'background 0.2s' }}>−</button>
                                <span style={{ color: C.text, fontWeight: 700, minWidth: 40, textAlign: 'center', fontSize: '1.05rem' }}>{qty}</span>
                                <button onClick={() => setQty(q => Math.min(part.stock, q + 1))} style={{ width: 42, height: 44, background: 'transparent', border: 'none', color: C.text, fontSize: '1.2rem', cursor: 'pointer', transition: 'background 0.2s' }}>+</button>
                            </div>
                            <span style={{ color: C.sub, fontSize: '0.8rem' }}>Max allowed: {part.stock}</span>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                        <button onClick={handleAddToCart} disabled={outOfStock || added} className={added ? 'btn-secondary' : 'btn-primary'} style={{ padding: '0.9rem', fontSize: '0.95rem', justifyContent: 'center', opacity: outOfStock ? 0.5 : 1, borderRadius: 10, border: added ? '1px solid #bbf7d0' : '', color: added ? '#16a34a' : '' }}>
                            {added ? '✅ Added to Cart!' : outOfStock ? 'Sold Out' : (
                                <><span style={{ fontSize: '1.1rem' }}>🛒</span> Add to Cart</>
                            )}
                        </button>
                        {!outOfStock && (
                            <button onClick={handleBuyNow} className="btn-secondary" style={{ padding: '0.9rem', fontSize: '0.95rem', justifyContent: 'center', borderRadius: 10 }}>
                                <span style={{ fontSize: '1.1rem' }}>⚡</span> Buy Now
                            </button>
                        )}
                    </div>

                    {/* Inquiry link — passes part details to InquiryForm */}
                    <button
                        onClick={handleInquiry}
                        style={{ display: 'block', width: '100%', marginTop: '1.25rem', padding: '0.6rem', textAlign: 'center', color: C.sub, fontSize: '0.82rem', background: 'rgba(232,56,79,0.04)', border: `1px solid rgba(232,56,79,0.15)`, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500 }}
                        onMouseEnter={e => { e.currentTarget.style.color = C.price; e.currentTarget.style.borderColor = 'rgba(232,56,79,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = C.sub; e.currentTarget.style.borderColor = 'rgba(232,56,79,0.15)'; }}>
                        Not sure if this fits your car? Verify via chassis number →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SparePartDetail;
