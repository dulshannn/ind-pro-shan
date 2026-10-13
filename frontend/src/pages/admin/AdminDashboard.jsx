// pages/admin/AdminDashboard.jsx – Analytics overview (Light theme fix)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/dashboardService';
import Spinner from '../../components/Spinner';
import useAuth from '../../hooks/useAuth';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;
const C = { text: '#1a2035', sub: '#64748b', price: '#e8384f', border: 'rgba(0,0,0,0.06)' };

const StatCard = ({ icon, label, value, sub, accent = '#e8384f' }) => (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1.4rem 1.5rem', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: '12px 12px 0 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '0.25rem' }}>
            <div>
                <div style={{ color: C.sub, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>{label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</div>
                {sub && <div style={{ color: C.sub, fontSize: '0.75rem', marginTop: '0.4rem' }}>{sub}</div>}
            </div>
            <div style={{ fontSize: '1.8rem', opacity: 0.7 }}>{icon}</div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAdmin, permissions = [] } = useAuth();
    const hasPerm = (p) => isAdmin || permissions.includes(p);

    useEffect(() => {
        getDashboardStats().then(r => setData(r.data)).finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;
    if (!data) return null;

    const { stats, recentActivities } = data;

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: C.text, margin: 0 }}>Dashboard</h1>
                <p style={{ color: C.sub, fontSize: '0.9rem', marginTop: '0.3rem' }}>Welcome back — here's what's happening at Shan Auto Lanka</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1.1rem', marginBottom: '2.5rem' }}>
                {hasPerm('vehicles') && <StatCard icon="🚗" label="Total Vehicles" value={stats.totalVehicles} sub={`${stats.availableVehicles} available`} accent="#2db55d" />}
                {hasPerm('spareparts') && <StatCard icon="🔧" label="Spare Parts" value={stats.totalSpareParts} sub="in catalogue" accent="#e8384f" />}
                {hasPerm('orders') && <StatCard icon="📦" label="Total Orders" value={stats.totalOrders} sub={`${stats.pendingOrders} processing`} accent="#f59e0b" />}
                {hasPerm('inquiries') && <StatCard icon="📩" label="Inquiries" value={stats.totalInquiries} sub={`${stats.pendingInquiries} pending`} accent="#8b5cf6" />}
                {hasPerm('customers') && <StatCard icon="👥" label="Customers" value={stats.totalCustomers} sub="registered" accent="#06b6d4" />}
            </div>

            {/* Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>

                {/* Recent Vehicles */}
                {hasPerm('vehicles') && (
                    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1.4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                            <h3 style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>🚗 Recent Vehicles</h3>
                            <Link to="/admin/vehicles" style={{ color: '#e8384f', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
                        </div>
                        {recentActivities.recentVehicles.map(v => (
                            <div key={v._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: `1px solid ${C.border}` }}>
                                <div>
                                    <div style={{ color: C.text, fontSize: '0.85rem', fontWeight: 600 }}>{v.title}</div>
                                    <div style={{ color: C.sub, fontSize: '0.75rem' }}>{v.year} · {v.brand}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: C.price, fontSize: '0.85rem', fontWeight: 700 }}>{fmtPrice(v.price)}</div>
                                    <span className={`badge badge-${v.status === 'available' ? 'success' : v.status === 'reserved' ? 'warning' : 'danger'}`}>{v.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recent Orders */}
                {hasPerm('orders') && (
                    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1.4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                            <h3 style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>📦 Recent Orders</h3>
                            <Link to="/admin/orders" style={{ color: '#e8384f', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
                        </div>
                        {recentActivities.recentOrders.length === 0 ? (
                            <p style={{ color: C.sub, fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No orders yet</p>
                        ) : recentActivities.recentOrders.map(o => (
                            <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: `1px solid ${C.border}` }}>
                                <div>
                                    <div style={{ color: C.text, fontSize: '0.85rem', fontWeight: 600 }}>{o.customer?.name}</div>
                                    <div style={{ color: C.sub, fontSize: '0.75rem' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: C.price, fontSize: '0.85rem', fontWeight: 700 }}>{fmtPrice(o.total)}</div>
                                    <span className={`badge ${o.orderStatus === 'delivered' ? 'badge-success' : o.orderStatus === 'cancelled' ? 'badge-danger' : 'badge-info'}`}>{o.orderStatus}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recent Inquiries */}
                {hasPerm('inquiries') && (
                    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1.4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                            <h3 style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>📩 Recent Inquiries</h3>
                            <Link to="/admin/inquiries" style={{ color: '#e8384f', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
                        </div>
                        {recentActivities.recentInquiries.map(inq => (
                            <div key={inq._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: `1px solid ${C.border}` }}>
                                <div>
                                    <div style={{ color: C.text, fontSize: '0.85rem', fontWeight: 600 }}>{inq.customerName}</div>
                                    <div style={{ color: '#6366f1', fontSize: '0.75rem', fontFamily: 'monospace' }}>{inq.chassisNumber}</div>
                                </div>
                                <span className={`badge badge-${inq.status === 'resolved' ? 'success' : inq.status === 'reviewed' ? 'info' : 'warning'}`}>{inq.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
