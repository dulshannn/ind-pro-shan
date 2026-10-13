// pages/user/UserDashboard.jsx – Customer overview (light theme fix)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getOrders } from '../../services/orderService';
import { getInquiries } from '../../services/inquiryService';
import Spinner from '../../components/Spinner';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;
const C = { text: '#1a2035', sub: '#64748b', price: '#e8384f', border: 'rgba(0,0,0,0.06)' };

const statusColor = (s) => ({ processing: '#16a34a', confirmed: '#2563eb', shipped: '#d97706', delivered: '#059669', cancelled: '#dc2626' }[s] || '#64748b');
const inqColor = (s) => ({ pending: '#d97706', reviewed: '#2563eb', resolved: '#059669' }[s] || '#64748b');

const UserDashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getOrders(), getInquiries()])
            .then(([oRes, iRes]) => {
                setOrders(oRes.data.orders || []);
                setInquiries(iRes.data.inquiries || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const recentOrders = orders.slice(0, 3);
    const recentInquiries = inquiries.slice(0, 3);
    const totalSpent = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (o.total || 0), 0);

    if (loading) return <Spinner />;

    return (
        <div>
            {/* Welcome banner */}
            <div style={{ background: 'linear-gradient(135deg, #0f1520, #1a2035)', borderRadius: 14, padding: '1.75rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Welcome back,</div>
                    <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>👋 {user?.name}</h1>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.2rem' }}>{user?.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to="/vehicles" style={{ padding: '0.55rem 1.1rem', borderRadius: 6, border: '1px solid rgba(255,255,255,0.25)', color: 'white', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.18s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        Browse Vehicles
                    </Link>
                    <Link to="/inquiry" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}>New Inquiry</Link>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1.1rem', marginBottom: '2rem' }}>
                {[
                    { icon: '📦', label: 'Total Orders', value: orders.length, accent: '#e8384f' },
                    { icon: '💸', label: 'Amount Spent', value: fmtPrice(totalSpent), accent: '#2db55d' },
                    { icon: '📩', label: 'Inquiries', value: inquiries.length, accent: '#8b5cf6' },
                    { icon: '⏳', label: 'Pending', value: orders.filter(o => o.orderStatus === 'processing').length, accent: '#f59e0b' },
                ].map(({ icon, label, value, accent }) => (
                    <div key={label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
                        <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem', marginTop: '0.15rem' }}>{icon}</div>
                        <div style={{ color: C.sub, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>{label}</div>
                        <div style={{ color: C.text, fontWeight: 800, fontSize: '1.25rem' }}>{value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Orders */}
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>📦 Recent Orders</h3>
                        <Link to="/dashboard/orders" style={{ color: '#e8384f', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: C.sub }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                            <p style={{ fontSize: '0.85rem' }}>No orders yet</p>
                            <Link to="/spareparts" style={{ color: '#e8384f', fontSize: '0.82rem' }}>Shop spare parts →</Link>
                        </div>
                    ) : recentOrders.map(o => (
                        <div key={o._id} style={{ padding: '0.7rem 0', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: C.text, fontSize: '0.83rem', fontWeight: 600 }}>Order #{o._id.slice(-6).toUpperCase()}</div>
                                <div style={{ color: C.sub, fontSize: '0.75rem' }}>{new Date(o.createdAt).toLocaleDateString('en-LK')}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: C.price, fontWeight: 700, fontSize: '0.85rem' }}>{fmtPrice(o.total)}</div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor(o.orderStatus), background: `${statusColor(o.orderStatus)}15`, padding: '0.15rem 0.6rem', borderRadius: 999 }}>{o.orderStatus}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Inquiries */}
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>📩 Recent Inquiries</h3>
                        <Link to="/dashboard/inquiries" style={{ color: '#e8384f', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
                    </div>
                    {recentInquiries.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: C.sub }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                            <p style={{ fontSize: '0.85rem' }}>No inquiries submitted</p>
                            <Link to="/inquiry" style={{ color: '#e8384f', fontSize: '0.82rem' }}>Submit an inquiry →</Link>
                        </div>
                    ) : recentInquiries.map(inq => (
                        <div key={inq._id} style={{ padding: '0.7rem 0', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: '#6366f1', fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 600 }}>{inq.chassisNumber}</div>
                                <div style={{ color: C.sub, fontSize: '0.72rem', marginTop: '0.15rem' }}>{new Date(inq.createdAt).toLocaleDateString('en-LK')}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: inqColor(inq.status), background: `${inqColor(inq.status)}15`, padding: '0.15rem 0.6rem', borderRadius: 999 }}>{inq.status}</span>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1.4rem' }}>
                    <h3 style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', marginTop: 0 }}>⚡ Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                            { to: '/vehicles', icon: '🚗', label: 'Browse Vehicles', sub: 'View latest Japan imports' },
                            { to: '/spareparts', icon: '🔧', label: 'Spare Parts', sub: 'Find genuine parts' },
                            { to: '/inquiry', icon: '📩', label: 'Submit Inquiry', sub: 'Check part compatibility' },
                            { to: '/dashboard/profile', icon: '👤', label: 'Edit Profile', sub: 'Update your details' },
                        ].map(({ to, icon, label, sub }) => (
                            <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem', borderRadius: 8, background: '#f8fafc', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none', transition: 'all 0.18s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#fff0f1'; e.currentTarget.style.borderColor = 'rgba(232,56,79,0.2)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; }}>
                                <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                                <div>
                                    <div style={{ color: C.text, fontWeight: 600, fontSize: '0.85rem' }}>{label}</div>
                                    <div style={{ color: C.sub, fontSize: '0.75rem' }}>{sub}</div>
                                </div>
                                <span style={{ marginLeft: 'auto', color: C.sub, fontSize: '0.9rem' }}>→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
