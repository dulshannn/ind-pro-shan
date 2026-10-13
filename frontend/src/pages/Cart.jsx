// pages/Cart.jsx – Shopping cart page
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { imageUrl } from '../utils/imageUrl';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;

const Cart = () => {
    const { cartItems, updateQty, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) { navigate('/login'); return; }
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ maxWidth: 700, margin: '8rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
                <div style={{
                    width: 120, height: 120, background: 'rgba(230, 57, 70, 0.05)', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem',
                    margin: '0 auto 2rem', boxShadow: '0 0 40px rgba(230, 57, 70, 0.1)'
                }}>
                    🛒
                </div>
                <h2 style={{ color: 'white', fontWeight: 800, fontSize: '2rem', marginBottom: '1rem' }}>Your cart is empty</h2>
                <p style={{ color: '#9ca3af', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
                    Looks like you haven't added anything to your cart yet.<br />
                    Browse our extensive catalog of genuine Japanese spare parts.
                </p>
                <Link to="/spareparts" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                    background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)', color: 'white',
                    padding: '1rem 2.5rem', borderRadius: 999, fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(211, 47, 47, 0.4)', transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(211, 47, 47, 0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(211, 47, 47, 0.4)'; }}
                >
                    Start Shopping →
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ color: 'white', fontWeight: 800, fontSize: '2.2rem', marginBottom: '0.4rem' }}>Shopping Cart</h1>
                    <div style={{ color: '#94a3b8', fontSize: '1rem' }}>You have <span style={{ color: '#fff', fontWeight: 600 }}>{totalItems} item{totalItems !== 1 ? 's' : ''}</span> in your cart</div>
                </div>
                <button onClick={clearCart} style={{
                    background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 8, padding: '0.6rem 1.25rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}>
                    <span style={{ fontSize: '1.1rem' }}>🗑</span> Clear Cart
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '2.5rem', alignItems: 'start' }}>
                {/* ── Left: Items List ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {cartItems.map(item => (
                        <div key={item._id} style={{
                            background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: 16, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
                            transition: 'border-color 0.2s', position: 'relative', overflow: 'hidden'
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'}>

                            {/* Product Image */}
                            <div style={{
                                width: 100, height: 100, borderRadius: 12, background: 'rgba(0,0,0,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', padding: '0.2rem'
                            }}>
                                {item.image ? (
                                    <img src={imageUrl(item.image)} alt={item.partName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <span style={{ fontSize: '2.5rem', opacity: 0.5 }}>🔧</span>
                                )}
                            </div>

                            {/* Product Details */}
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem', fontWeight: 700 }}>
                                    {item.brand}
                                </div>
                                <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1.15rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                                    {item.partName}
                                </h3>
                                <div style={{ color: '#cbd5e1', fontWeight: 500, fontSize: '1rem' }}>
                                    {fmtPrice(item.price)} <span style={{ color: '#64748b', fontSize: '0.85rem' }}>ea.</span>
                                </div>
                            </div>

                            {/* Qty Stepper */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Quantity</div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)',
                                    borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)', padding: '0.25rem'
                                }}>
                                    <button onClick={() => updateQty(item._id, item.quantity - 1)}
                                        style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                                        −
                                    </button>
                                    <span style={{ color: 'white', fontWeight: 700, minWidth: 36, textAlign: 'center', fontSize: '0.95rem' }}>{item.quantity}</span>
                                    <button onClick={() => updateQty(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock}
                                        style={{ width: 28, height: 28, borderRadius: '50%', background: item.quantity >= item.stock ? 'transparent' : 'rgba(255,255,255,0.05)', border: 'none', color: item.quantity >= item.stock ? '#4b5563' : 'white', fontSize: '1.1rem', cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                                        onMouseEnter={e => { if (item.quantity < item.stock) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                                        onMouseLeave={e => { if (item.quantity < item.stock) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}>
                                        +
                                    </button>
                                </div>
                                {item.stock > 0 && item.stock <= 5 && (
                                    <div style={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 600 }}>Only {item.stock} left</div>
                                )}
                            </div>

                            {/* Total Price */}
                            <div style={{ minWidth: 120, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Total</div>
                                <div style={{ color: '#e63946', fontWeight: 800, fontSize: '1.25rem' }}>{fmtPrice(item.price * item.quantity)}</div>
                            </div>

                            {/* Remove Button */}
                            <button onClick={() => removeFromCart(item._id)}
                                title="Remove item"
                                style={{
                                    position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none',
                                    color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', padding: '0.2rem',
                                    lineHeight: 1, transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 24, height: 24, borderRadius: '50%'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}>
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {/* ── Right: Order Summary ── */}
                <div style={{
                    background: 'linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '2rem',
                    position: 'sticky', top: 100, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <h3 style={{ color: 'white', fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📋</span> Order Summary
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        {cartItems.map(item => (
                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem', flex: 1, lineHeight: 1.4 }}>
                                    <span style={{ color: '#cbd5e1' }}>{item.quantity}x</span> {item.partName}
                                </span>
                                <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600, flexShrink: 0 }}>
                                    {fmtPrice(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Subtotal</span>
                            <span style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 500 }}>{fmtPrice(totalPrice)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                Shipping <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>ISLAND-WIDE</span>
                            </span>
                            <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 700 }}>FREE</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>Total</span>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#e63946', fontWeight: 800, fontSize: '1.8rem', lineHeight: 1 }}>{fmtPrice(totalPrice)}</div>
                                <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '0.3rem' }}>Includes all taxes</div>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleCheckout}
                        style={{
                            width: '100%', padding: '1rem', fontSize: '1.05rem', fontWeight: 700,
                            borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: user ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            boxShadow: user ? '0 8px 20px rgba(16, 185, 129, 0.3)' : '0 8px 20px rgba(99, 102, 241, 0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = user ? '0 12px 24px rgba(16, 185, 129, 0.4)' : '0 12px 24px rgba(99, 102, 241, 0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = user ? '0 8px 20px rgba(16, 185, 129, 0.3)' : '0 8px 20px rgba(99, 102, 241, 0.3)'; }}
                    >
                        {user ? 'Proceed to Checkout ➔' : '🔒 Login to Checkout'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', color: '#64748b', fontSize: '1.2rem' }}>
                        <span title="Secure Payment">🔒</span>
                        <span title="Visa">💳</span>
                        <span title="Mastercard">🔴🟡</span>
                        <span title="Cash on Delivery">💵</span>
                    </div>

                    <Link to="/spareparts" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '2rem', color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                        ← Continue Shopping
                    </Link>
                </div>
            </div>

            {/* Responsive grid for mobile */}
            <style>{`
                @media (max-width: 900px) {
                    div[style*="gridTemplateColumns"] {
                        grid-template-columns: 1fr !important;
                    }
                }
                @media (max-width: 600px) {
                    div[style*="alignItems: center; gap: 1.5rem;"] {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        position: relative !important;
                    }
                    div[style*="flex-direction: column; alignItems: center"] {
                        flex-direction: row !important;
                        justify-content: space-between !important;
                        width: 100% !important;
                        margin-top: 1rem !important;
                    }
                    div[style*="minWidth: 120; textAlign: right"] {
                        width: 100% !important;
                        flex-direction: row !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        border-top: 1px solid rgba(255,255,255,0.05);
                        padding-top: 1rem;
                        margin-top: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Cart;
