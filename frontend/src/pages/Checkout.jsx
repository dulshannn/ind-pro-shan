// pages/Checkout.jsx – Order placement with delivery/pickup + cash/card options
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { createOrder } from '../services/orderService';
import PaymentGateway from '../components/PaymentGateway';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;

const WAREHOUSE = {
    name: 'Shan Auto Lanka – Ukuwela Warehouse',
    address: 'No 95 Marukona, Ukuwela, Sri Lanka',
    hours: 'Mon–Sat: 8:30 AM – 6:00 PM',
    phone: '072 400 0654',
    maps: 'https://maps.google.com/?q=Ukuwela+Sri+Lanka',
};

const OptionCard = ({ selected, onClick, icon, title, subtitle }) => (
    <div onClick={onClick} style={{
        flex: 1, padding: '1rem 1.1rem', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
        background: selected ? 'rgba(230,57,70,0.08)' : 'rgba(255,255,255,0.03)',
        border: `2px solid ${selected ? '#e63946' : '#2d2d4e'}`,
        display: 'flex', alignItems: 'flex-start', gap: '0.8rem',
    }}>
        <div style={{ fontSize: '1.6rem', marginTop: '0.1rem' }}>{icon}</div>
        <div>
            <div style={{ color: selected ? 'white' : '#d1d5db', fontWeight: 700, fontSize: '0.9rem' }}>{title}</div>
            <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: '0.2rem', lineHeight: 1.5 }}>{subtitle}</div>
        </div>
        <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selected ? '#e63946' : '#4b5563'}`, background: selected ? '#e63946' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />}
        </div>
    </div>
);

const Checkout = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [fulfillment, setFulfillment] = useState('delivery');
    const [payment, setPayment] = useState('cash');
    const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', phone: '' });
    const [notes, setNotes] = useState('');
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState('');
    const [showGateway, setShowGateway] = useState(false);

    const set = (k, v) => setShipping(p => ({ ...p, [k]: v }));

    const validateForm = () => {
        if (cartItems.length === 0) return false;
        if (fulfillment === 'delivery' && (!shipping.address || !shipping.city || !shipping.phone)) {
            setError('Please fill in all required shipping fields.');
            return false;
        }
        return true;
    };

    const submitOrder = async (paymentMeta = {}) => {
        setPlacing(true); setError('');
        try {
            const payload = {
                products: cartItems.map(i => ({ sparePart: i._id, quantity: i.quantity })),
                fulfillmentType: fulfillment,
                paymentMethod: payment,
                shippingAddress: fulfillment === 'delivery' ? shipping : {},
                notes,
                paymentMeta,
            };
            const { data } = await createOrder(payload);
            clearCart();
            navigate('/order-success', { state: { order: data } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
            setPlacing(false);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (payment === 'card') {
            // Open payment gateway modal instead of placing immediately
            setShowGateway(true);
        } else {
            await submitOrder();
        }
    };

    const handlePaymentSuccess = async (paymentMeta) => {
        setShowGateway(false);
        await submitOrder(paymentMeta);
    };

    if (cartItems.length === 0) { navigate('/cart'); return null; }

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
            {/* Payment Gateway Modal */}
            {showGateway && (
                <PaymentGateway
                    amount={totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowGateway(false)}
                />
            )}

            <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.8rem', marginBottom: '0.35rem' }}>Checkout</h1>
            <p style={{ color: '#9ca3af', marginBottom: '2rem', fontSize: '0.9rem' }}>Choose how you'd like to receive and pay for your order</p>

            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.85rem 1rem', color: '#ef4444', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    ❌ {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                {/* Left – Options */}
                <form id="checkout-form" onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* ── Step 1: Fulfillment ── */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
                        <div style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Step 1 — How would you like to receive your order?</div>
                        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                            <OptionCard selected={fulfillment === 'delivery'} onClick={() => setFulfillment('delivery')}
                                icon="🚚" title="Home Delivery" subtitle="We deliver to your address. Free delivery island-wide." />
                            <OptionCard selected={fulfillment === 'pickup'} onClick={() => setFulfillment('pickup')}
                                icon="🏭" title="Warehouse Pickup" subtitle="Collect from our Ukuwela warehouse. Ready within 2–4 hrs." />
                        </div>
                    </div>

                    {/* ── Delivery Address (conditional) ── */}
                    {fulfillment === 'delivery' && (
                        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Shipping Address</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                <div>
                                    <label className="form-label">Street Address *</label>
                                    <input className="form-input" placeholder="No. 25, Main Street, Colombo 07" value={shipping.address} onChange={e => set('address', e.target.value)} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <label className="form-label">City *</label>
                                        <input className="form-input" placeholder="Colombo" value={shipping.city} onChange={e => set('city', e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="form-label">Postal Code</label>
                                        <input className="form-input" placeholder="00700" value={shipping.postalCode} onChange={e => set('postalCode', e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Contact Phone *</label>
                                    <input className="form-input" type="tel" placeholder="07X XXXX XXX" value={shipping.phone} onChange={e => set('phone', e.target.value)} required />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Pickup Info (conditional) ── */}
                    {fulfillment === 'pickup' && (
                        <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '1.5rem' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Warehouse Details</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {[
                                    { icon: '🏭', label: WAREHOUSE.name },
                                    { icon: '📍', label: WAREHOUSE.address },
                                    { icon: '🕐', label: WAREHOUSE.hours },
                                    { icon: '📞', label: WAREHOUSE.phone },
                                ].map(({ icon, label }) => (
                                    <div key={label} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '1rem', marginTop: '0.05rem' }}>{icon}</span>
                                        <span style={{ color: '#d1d5db', fontSize: '0.875rem', lineHeight: 1.5 }}>{label}</span>
                                    </div>
                                ))}
                                <a href={WAREHOUSE.maps} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', color: '#10b981', fontSize: '0.82rem', textDecoration: 'none' }}>
                                    🗺 Open in Google Maps →
                                </a>
                            </div>
                            <div style={{ marginTop: '1rem', padding: '0.65rem 0.85rem', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 8, fontSize: '0.78rem', color: '#f59e0b' }}>
                                ⚠️ Please bring this order confirmation and a valid ID when collecting.
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Payment ── */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
                        <div style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Step 2 — Payment Method</div>
                        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                            <OptionCard selected={payment === 'cash'} onClick={() => setPayment('cash')}
                                icon="💵" title="Cash"
                                subtitle={fulfillment === 'delivery' ? 'Pay the courier when your order arrives.' : 'Pay at the warehouse counter when you collect.'} />
                            <OptionCard selected={payment === 'card'} onClick={() => setPayment('card')}
                                icon="💳" title="Card Payment"
                                subtitle="Pay securely by Visa, Mastercard or Amex. You'll be taken to our secure payment page." />
                        </div>

                        {payment === 'card' && (
                            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 8, fontSize: '0.8rem', color: '#818cf8', display: 'flex', gap: '0.5rem' }}>
                                <span>🔒</span>
                                <span>Your card details are processed securely. 256-bit SSL encrypted. Demo mode — use card <strong>4242 4242 4242 4242</strong> to test.</span>
                            </div>
                        )}
                    </div>

                    {/* ── Notes ── */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
                        <div style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Order Notes (optional)</div>
                        <textarea className="form-input" rows={3} placeholder="Any special instructions..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
                    </div>
                </form>

                {/* Right – Order Summary */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem', position: 'sticky', top: 90 }}>
                    <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '1.1rem', fontSize: '1rem' }}>🛒 Order Summary</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.1rem' }}>
                        {cartItems.map(item => (
                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                <div>
                                    <div style={{ color: 'white', fontSize: '0.82rem', fontWeight: 500 }}>{item.partName}</div>
                                    <div style={{ color: '#9ca3af', fontSize: '0.74rem' }}>Qty {item.quantity} × {fmtPrice(item.price)}</div>
                                </div>
                                <div style={{ color: '#e63946', fontWeight: 600, fontSize: '0.85rem', flexShrink: 0 }}>{fmtPrice(item.price * item.quantity)}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid #2d2d4e', paddingTop: '1rem', marginBottom: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Subtotal</span>
                            <span style={{ color: 'white', fontSize: '0.82rem' }}>{fmtPrice(totalPrice)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>
                                {fulfillment === 'delivery' ? 'Delivery' : 'Pickup'}
                            </span>
                            <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>FREE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #2d2d4e' }}>
                            <span style={{ color: 'white', fontWeight: 700 }}>Total</span>
                            <span style={{ color: '#e63946', fontWeight: 800, fontSize: '1.15rem' }}>{fmtPrice(totalPrice)}</span>
                        </div>
                    </div>

                    {/* Summary chips */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        <span style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 999, padding: '0.2rem 0.7rem', fontSize: '0.74rem', fontWeight: 600 }}>
                            {fulfillment === 'delivery' ? '🚚 Delivery' : '🏭 Pickup'}
                        </span>
                        <span style={{ background: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, padding: '0.2rem 0.7rem', fontSize: '0.74rem', fontWeight: 600 }}>
                            {payment === 'cash' ? '💵 Cash' : '💳 Card'}
                        </span>
                    </div>

                    <button type="submit" form="checkout-form" className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}
                        disabled={placing}>
                        {placing ? '⏳ Placing Order...' : payment === 'card' ? '🔒 Proceed to Payment' : '✅ Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
