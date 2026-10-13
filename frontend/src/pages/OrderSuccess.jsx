// pages/OrderSuccess.jsx – Confirmation page after order is placed
import { useLocation, Link } from 'react-router-dom';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;

const WAREHOUSE_ADDRESS = 'No. 47, Baseline Road, Colombo 09, Sri Lanka';

const OrderSuccess = () => {
    const { state } = useLocation();
    const order = state?.order;
    const isPickup = order?.fulfillmentType === 'pickup';
    const isCard = order?.paymentMethod === 'card';

    return (
        <div style={{ maxWidth: 620, margin: '5rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
            {/* Success Icon */}
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                ✅
            </div>

            <h1 style={{ color: 'white', fontWeight: 800, fontSize: '2rem', marginBottom: '0.5rem' }}>Order Confirmed!</h1>
            <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                {isPickup
                    ? 'Your order is being prepared. Visit our warehouse to collect when ready (usually 2–4 hours).'
                    : 'Thank you! Our team will contact you within 24 hours to confirm your delivery details.'}
            </p>

            {order && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 14, padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
                    {/* Order meta row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                            <div style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order ID</div>
                            <div style={{ color: 'white', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}>#{order._id?.slice(-10).toUpperCase()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</div>
                            <div style={{ color: '#e63946', fontWeight: 800, fontSize: '1.1rem' }}>{fmtPrice(order.total)}</div>
                        </div>
                    </div>

                    {/* Chips */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <span style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 999, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
                            {isPickup ? '🏭 Warehouse Pickup' : '🚚 Home Delivery'}
                        </span>
                        <span style={{ background: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
                            {isCard ? '💳 Pay by Card' : '💵 Cash Payment'}
                        </span>
                    </div>

                    {/* Delivery address */}
                    {!isPickup && order.shippingAddress?.address && (
                        <div style={{ borderTop: '1px solid #2d2d4e', paddingTop: '0.875rem', marginBottom: '0.875rem' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Deliver To</div>
                            <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                                {[order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.postalCode].filter(Boolean).join(', ')}
                            </div>
                            {order.shippingAddress.phone && <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.2rem' }}>📞 {order.shippingAddress.phone}</div>}
                        </div>
                    )}

                    {/* Pickup info */}
                    {isPickup && (
                        <div style={{ borderTop: '1px solid #2d2d4e', paddingTop: '0.875rem', marginBottom: '0.875rem' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Pickup Location</div>
                            <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>{WAREHOUSE_ADDRESS}</div>
                            <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.2rem' }}>🕐 Mon–Sat: 8:30 AM – 6:00 PM</div>
                        </div>
                    )}

                    {/* Payment notice */}
                    <div style={{ padding: '0.65rem 0.85rem', background: isCard ? 'rgba(129,140,248,0.07)' : 'rgba(245,158,11,0.07)', border: `1px solid ${isCard ? 'rgba(129,140,248,0.18)' : 'rgba(245,158,11,0.18)'}`, borderRadius: 8, fontSize: '0.8rem', color: isCard ? '#818cf8' : '#f59e0b' }}>
                        {isCard
                            ? `💳 Please have your card ready to pay ${isPickup ? 'at the warehouse counter' : 'when the courier arrives'}.`
                            : `💵 Please have exact cash of ${fmtPrice(order.total)} ready ${isPickup ? 'at the warehouse counter' : 'for the courier'}.`}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/dashboard/orders" className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>📦 Track My Orders</Link>
                <Link to="/spareparts" className="btn-outline" style={{ padding: '0.75rem 1.75rem' }}>Continue Shopping</Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
