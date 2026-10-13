// pages/user/UserOrders.jsx – Full order history (light theme)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/orderService';
import Spinner from '../../components/Spinner';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;
const C = { text: '#1a2035', sub: '#64748b', price: '#e8384f', border: 'rgba(0,0,0,0.08)' };

const statusColor = (s) => ({
    processing: { color: '#2563eb', bg: '#eff6ff' },
    confirmed: { color: '#2563eb', bg: '#eff6ff' },
    shipped: { color: '#d97706', bg: '#fef3c7' },
    delivered: { color: '#059669', bg: '#f0fdf4' },
    cancelled: { color: '#dc2626', bg: '#fff5f5' },
}[s] || { color: '#64748b', bg: '#f8fafc' });

const payColor = (s) => ({
    paid: { color: '#059669', bg: '#f0fdf4' },
    pending: { color: '#d97706', bg: '#fef3c7' },
    failed: { color: '#dc2626', bg: '#fff5f5' },
    refunded: { color: '#64748b', bg: '#f8fafc' },
}[s] || { color: '#64748b', bg: '#f8fafc' });

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        getOrders().then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    return (
        <div>
            <div style={{ marginBottom: '1.75rem' }}>
                <h1 style={{ color: C.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>📦 My Orders</h1>
                <p style={{ color: C.sub, fontSize: '0.875rem', marginTop: '0.25rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
            </div>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: 16, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                    <h3 style={{ color: C.text, marginBottom: '0.5rem' }}>No orders yet</h3>
                    <p style={{ color: C.sub, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Browse our spare parts catalogue and place your first order.</p>
                    <Link to="/spareparts" className="btn-primary" style={{ padding: '0.7rem 1.75rem' }}>Shop Spare Parts</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map(o => {
                        const sc = statusColor(o.orderStatus);
                        const pc = payColor(o.paymentStatus);
                        const isOpen = expanded === o._id;

                        return (
                            <div key={o._id} style={{ background: '#fff', border: `1px solid ${isOpen ? 'rgba(232,56,79,0.3)' : C.border}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                                {/* Header row */}
                                <div
                                    style={{ padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: '0.75rem' }}
                                    onClick={() => setExpanded(isOpen ? null : o._id)}
                                >
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <div>
                                            <div style={{ color: C.sub, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</div>
                                            <div style={{ color: C.text, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>#{o._id.slice(-8).toUpperCase()}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: C.sub, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</div>
                                            <div style={{ color: C.text, fontSize: '0.875rem' }}>{new Date(o.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: C.sub, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items</div>
                                            <div style={{ color: C.text, fontSize: '0.875rem' }}>{o.orderItems?.length || 0} item{o.orderItems?.length !== 1 ? 's' : ''}</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: C.price, fontWeight: 800, fontSize: '1.05rem' }}>{fmtPrice(o.total)}</div>
                                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: sc.color, background: sc.bg, padding: '0.15rem 0.55rem', borderRadius: 999 }}>{o.orderStatus}</span>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: pc.color, background: pc.bg, padding: '0.15rem 0.55rem', borderRadius: 999 }}>{o.paymentStatus}</span>
                                                {o.fulfillmentType && (
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7c3aed', background: '#ede9fe', padding: '0.15rem 0.55rem', borderRadius: 999 }}>
                                                        {o.fulfillmentType === 'pickup' ? '🏭 Pickup' : '🚚 Delivery'}
                                                    </span>
                                                )}
                                                {o.paymentMethod && (
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '0.15rem 0.55rem', borderRadius: 999 }}>
                                                        {o.paymentMethod === 'card' ? '💳 Card' : '💵 Cash'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span style={{ color: C.sub, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', fontSize: '0.85rem' }}>▼</span>
                                    </div>
                                </div>

                                {/* Expanded Items */}
                                {isOpen && (
                                    <div style={{ borderTop: `1px solid ${C.border}`, padding: '1rem 1.25rem', background: '#fafbfc' }}>
                                        <div style={{ color: C.sub, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Order Items</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {(o.orderItems || []).map((item, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: '#f8fafc', borderRadius: 8, border: `1px solid ${C.border}` }}>
                                                    <div>
                                                        <div style={{ color: C.text, fontSize: '0.875rem', fontWeight: 500 }}>{item.name || item.part?.partName || 'Part'}</div>
                                                        <div style={{ color: C.sub, fontSize: '0.75rem' }}>Qty: {item.quantity} × {fmtPrice(item.price)}</div>
                                                    </div>
                                                    <div style={{ color: C.price, fontWeight: 600, fontSize: '0.875rem' }}>{fmtPrice(item.quantity * item.price)}</div>
                                                </div>
                                            ))}
                                        </div>
                                        {o.shippingAddress && (
                                            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 8 }}>
                                                <div style={{ color: '#7c3aed', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Shipping Address</div>
                                                <div style={{ color: '#374151', fontSize: '0.85rem' }}>
                                                    {[o.shippingAddress.address, o.shippingAddress.city, o.shippingAddress.postalCode].filter(Boolean).join(', ')}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserOrders;
