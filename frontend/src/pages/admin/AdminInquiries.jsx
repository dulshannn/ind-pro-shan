// pages/admin/AdminInquiries.jsx – Inquiry management (light theme)
import { useState, useEffect } from 'react';
import { getInquiries, updateInquiry, deleteInquiry } from '../../services/inquiryService';
import Spinner from '../../components/Spinner';

const C = { text: '#1a2035', sub: '#64748b', border: 'rgba(0,0,0,0.08)' };

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const load = () => {
        setLoading(true);
        const params = statusFilter ? { status: statusFilter } : {};
        getInquiries(params).then(r => setInquiries(r.data.inquiries || [])).finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, [statusFilter]);

    const handleStatus = async (id, status) => {
        await updateInquiry(id, { status }); load();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry?')) return;
        await deleteInquiry(id); load();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ color: C.text, fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>📩 Inquiries</h1>
                <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {loading ? <Spinner /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {inquiries.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: C.sub, background: '#fff', borderRadius: 12, border: `1px solid ${C.border}` }}>No inquiries found</div>
                    ) : inquiries.map(inq => (
                        <div key={inq._id} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                                        <span style={{ color: C.text, fontWeight: 700 }}>{inq.customerName}</span>
                                        <span className={`badge badge-${inq.status === 'resolved' ? 'success' : inq.status === 'reviewed' ? 'info' : 'warning'}`}>{inq.status}</span>
                                        <span style={{ color: C.sub, fontSize: '0.75rem' }}>{new Date(inq.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ color: C.sub, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                        ✉️ {inq.email}{inq.phone && ` · 📞 ${inq.phone}`}
                                    </div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ede9fe', border: '1px solid #ddd6fe', borderRadius: 6, padding: '0.2rem 0.6rem', marginBottom: '0.6rem' }}>
                                        <span style={{ color: '#7c3aed', fontSize: '0.75rem', fontWeight: 700 }}>CHASSIS:</span>
                                        <span style={{ color: '#5b21b6', fontSize: '0.8rem', fontFamily: 'monospace' }}>{inq.chassisNumber}</span>
                                    </div>
                                    <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{inq.message}</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', minWidth: 140 }}>
                                    {inq.status !== 'reviewed' && (
                                        <button onClick={() => handleStatus(inq._id, 'reviewed')} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 6, padding: '0.35rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem', width: '100%', fontWeight: 600 }}>Mark Reviewed</button>
                                    )}
                                    {inq.status !== 'resolved' && (
                                        <button onClick={() => handleStatus(inq._id, 'resolved')} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 6, padding: '0.35rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem', width: '100%', fontWeight: 600 }}>Mark Resolved</button>
                                    )}
                                    <button onClick={() => handleDelete(inq._id)} style={{ background: '#fff5f5', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, padding: '0.35rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem', width: '100%', fontWeight: 600 }}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminInquiries;
