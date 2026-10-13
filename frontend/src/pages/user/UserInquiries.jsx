// pages/user/UserInquiries.jsx – Inquiry history (light theme)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInquiries } from '../../services/inquiryService';
import Spinner from '../../components/Spinner';

const C = { text: '#1a2035', sub: '#64748b', border: 'rgba(0,0,0,0.08)' };

const inqStyle = (s) => ({
    pending: { color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
    reviewed: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    resolved: { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
}[s] || { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' });

const statusIcon = { pending: '⏳', reviewed: '🔍', resolved: '✅' };

const UserInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        getInquiries().then(r => setInquiries(r.data.inquiries || [])).finally(() => setLoading(false));
    }, []);

    const filtered = filter ? inquiries.filter(i => i.status === filter) : inquiries;

    if (loading) return <Spinner />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ color: C.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>📩 My Inquiries</h1>
                    <p style={{ color: C.sub, fontSize: '0.875rem', marginTop: '0.25rem' }}>{inquiries.length} inquiry submissions</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {['', 'pending', 'reviewed', 'resolved'].map(s => (
                        <button key={s}
                            onClick={() => setFilter(s)}
                            style={{
                                padding: '0.4rem 0.9rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.18s',
                                background: filter === s ? 'rgba(232,56,79,0.1)' : '#f8fafc',
                                border: filter === s ? '1px solid rgba(232,56,79,0.35)' : '1px solid rgba(0,0,0,0.08)',
                                color: filter === s ? '#e8384f' : C.sub,
                            }}>
                            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                    <Link to="/inquiry" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.4rem 1rem' }}>+ New Inquiry</Link>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: 16, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                    <h3 style={{ color: C.text, marginBottom: '0.5rem' }}>No inquiries yet</h3>
                    <p style={{ color: C.sub, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Submit a chassis number inquiry to check spare part compatibility.</p>
                    <Link to="/inquiry" className="btn-primary" style={{ padding: '0.7rem 1.75rem' }}>Submit Inquiry</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filtered.map(inq => {
                        const st = inqStyle(inq.status);
                        const icon = statusIcon[inq.status] || '📩';

                        return (
                            <div key={inq._id} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.25rem', borderLeft: `3px solid ${st.color}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 8, padding: '0.35rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <span style={{ color: '#7c3aed', fontSize: '0.75rem', fontWeight: 700 }}>CHASSIS:</span>
                                            <span style={{ color: '#5b21b6', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>{inq.chassisNumber}</span>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.border}`, padding: '0.2rem 0.7rem', borderRadius: 999 }}>{icon} {inq.status}</span>
                                    </div>
                                    <div style={{ color: C.sub, fontSize: '0.78rem' }}>
                                        {new Date(inq.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{inq.message}</p>

                                {inq.status === 'pending' && (
                                    <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, fontSize: '0.78rem', color: '#d97706' }}>
                                        ⏳ Our team will review this inquiry within 24 hours and contact you at <strong>{inq.email}</strong>.
                                    </div>
                                )}
                                {inq.status === 'resolved' && (
                                    <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: '0.78rem', color: '#059669' }}>
                                        ✅ This inquiry has been resolved. Check your email for the response.
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

export default UserInquiries;
