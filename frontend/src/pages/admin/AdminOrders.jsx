// pages/admin/AdminOrders.jsx – Order management (light theme)
import { useState, useEffect } from 'react';
import { getOrders, updateOrder, deleteOrder } from '../../services/orderService';
import Spinner from '../../components/Spinner';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;
const ORDER_STATUSES = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];
const C = { text: '#1a2035', sub: '#64748b', price: '#e8384f', border: 'rgba(0,0,0,0.08)' };

const orderColor = (s) => ({ processing: '#2563eb', confirmed: '#2563eb', shipped: '#d97706', delivered: '#059669', cancelled: '#dc2626' }[s] || '#64748b');
const payColor = (s) => ({ paid: '#059669', pending: '#d97706', failed: '#dc2626', refunded: '#64748b' }[s] || '#64748b');
const fulfillIcon = (f) => f === 'pickup' ? '🏭' : '🚚';
const payIcon = (p) => p === 'card' ? '💳' : '💵';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [expanded, setExpanded] = useState(null);

    const load = () => getOrders().then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const handleStatusUpdate = async (id, field, value) => {
        setUpdating(id);
        await updateOrder(id, { [field]: value });
        load();
        setUpdating(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this order?')) return;
        await deleteOrder(id); load();
    };

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ color: C.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>📦 Orders</h1>
                <p style={{ color: C.sub, fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {orders.length} order{orders.length !== 1 ? 's' : ''} total
                </p>
            </div>

            {loading ? <Spinner /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: C.sub, background: '#fff', borderRadius: 12, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                            <p>No orders yet.</p>
                        </div>
                    ) : orders.map(o => {
                        const isOpen = expanded === o._id;
                        const isPickup = o.fulfillmentType === 'pickup';

                        return (
                            <div key={o._id} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                                {/* Header */}
                                <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                    {/* Customer + meta */}
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
                                        <div style={{ cursor: 'pointer' }} onClick={() => setExpanded(isOpen ? null : o._id)}>
                                            <div style={{ color: C.text, fontWeight: 600, fontSize: '0.875rem' }}>{o.customer?.name || 'N/A'}</div>
                                            <div style={{ color: C.sub, fontSize: '0.75rem' }}>{o.customer?.email}</div>
                                        </div>
                                        <div style={{ color: C.sub, fontSize: '0.82rem' }}>{new Date(o.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                        <div style={{ color: C.price, fontWeight: 700, fontSize: '0.95rem' }}>{fmtPrice(o.total)}</div>

                                        {/* Fulfillment + payment chips */}
                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 600, background: '#ede9fe', color: '#7c3aed', borderRadius: 999, padding: '0.15rem 0.6rem' }}>
                                                {fulfillIcon(o.fulfillmentType)} {isPickup ? 'Pickup' : 'Delivery'}
                                            </span>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 600, background: '#fef3c7', color: '#d97706', borderRadius: 999, padding: '0.15rem 0.6rem' }}>
                                                {payIcon(o.paymentMethod)} {o.paymentMethod === 'card' ? 'Card' : 'Cash'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dropdowns + delete */}
                                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <select className="form-select" style={{ fontSize: '0.78rem', padding: '0.3rem 0.5rem', width: 'auto', color: payColor(o.paymentStatus) }}
                                            value={o.paymentStatus}
                                            onChange={e => handleStatusUpdate(o._id, 'paymentStatus', e.target.value)}
                                            disabled={updating === o._id}>
                                            {PAYMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                        <select className="form-select" style={{ fontSize: '0.78rem', padding: '0.3rem 0.5rem', width: 'auto', color: orderColor(o.orderStatus) }}
                                            value={o.orderStatus}
                                            onChange={e => handleStatusUpdate(o._id, 'orderStatus', e.target.value)}
                                            disabled={updating === o._id}>
                                            {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                        <button onClick={() => setExpanded(isOpen ? null : o._id)}
                                            style={{ background: '#f8fafc', color: C.sub, border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</button>
                                        <button onClick={() => handleDelete(o._id)}
                                            style={{ background: '#fff5f5', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem' }}>🗑</button>
                                    </div>
                                </div>

                                {/* Expanded detail */}
                                {isOpen && (
                                    <div style={{ borderTop: `1px solid ${C.border}`, padding: '1rem 1.25rem', background: '#fafbfc', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.25rem' }}>
                                        {/* Items */}
                                        <div>
                                            <div style={{ color: C.sub, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Items</div>
                                            {(o.products || []).map((item, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${C.border}`, fontSize: '0.83rem' }}>
                                                    <span style={{ color: C.text }}>{item.sparePart?.partName || 'Part'} <span style={{ color: C.sub }}>× {item.quantity}</span></span>
                                                    <span style={{ color: C.price, fontWeight: 600 }}>{fmtPrice(item.price * item.quantity)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Address / Pickup info */}
                                        <div style={{ minWidth: 200 }}>
                                            <div style={{ color: C.sub, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                                                {isPickup ? '🏭 Pickup' : '📍 Ship To'}
                                            </div>
                                            {isPickup ? (
                                                <div style={{ color: '#374151', fontSize: '0.83rem', lineHeight: 1.6 }}>
                                                    No. 47, Baseline Road<br />Colombo 09, Sri Lanka
                                                </div>
                                            ) : o.shippingAddress?.address ? (
                                                <div style={{ color: '#374151', fontSize: '0.83rem', lineHeight: 1.6 }}>
                                                    {o.shippingAddress.address}<br />
                                                    {[o.shippingAddress.city, o.shippingAddress.postalCode].filter(Boolean).join(', ')}
                                                    {o.shippingAddress.phone && <><br /><span style={{ color: C.sub }}>📞 {o.shippingAddress.phone}</span></>}
                                                </div>
                                            ) : (
                                                <span style={{ color: C.sub, fontSize: '0.82rem' }}>—</span>
                                            )}
                                            {o.notes && (
                                                <div style={{ marginTop: '0.6rem', color: C.sub, fontSize: '0.78rem' }}>
                                                    <span style={{ color: C.text, fontWeight: 600 }}>Notes:</span> {o.notes}
                                                </div>
                                            )}
                                        </div>
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

export default AdminOrders;
