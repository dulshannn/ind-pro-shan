// pages/InquiryForm.jsx – Chassis verification form with auto-fill from auth + spare part state
import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { submitInquiry } from '../services/inquiryService';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;

const InquiryForm = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const part = location.state || null;      // part passed from SparePartDetail

    const buildInitialMessage = () => {
        if (!part) return '';
        return `I would like to verify whether the following part fits my vehicle:\n\nPart: ${part.partName}\nBrand: ${part.brand}${part.category ? `\nCategory: ${part.category}` : ''}${part.price ? `\nPrice: ${fmtPrice(part.price)}` : ''}\n\nPlease confirm compatibility with my chassis number provided above.`;
    };

    const [form, setForm] = useState({
        customerName: user?.name || '',
        email: user?.email || '',
        phone: '',
        chassisNumber: '',
        message: buildInitialMessage(),
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    // Re-seed if user or location state changes (e.g. login after arrival)
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            customerName: prev.customerName || user?.name || '',
            email: prev.email || user?.email || '',
            message: prev.message || buildInitialMessage(),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setStatus(null);
        try {
            await submitInquiry({ ...form, ...(part?.partId && { partId: part.partId }) });
            setStatus('success');
            setForm({ customerName: '', email: '', phone: '', chassisNumber: '', message: '' });
        } catch {
            setStatus('error');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="page-hero">
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div className="section-label fade-in-up" style={{ justifyContent: 'center' }}>Expert Assistance</div>
                    <h1 className="fade-in-up-2" style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>Chassis Verification</h1>
                    <p className="fade-in-up-3" style={{ color: 'var(--muted)', fontSize: '1.05rem', fontWeight: 300, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
                        Provide your chassis number and our experts will verify part compatibility within 24 hours.
                    </p>
                </div>
            </div>

            <div style={{ flex: 1, padding: '3rem 1.5rem 5rem', position: 'relative' }}>
                <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>

                    {/* ── Part context banner ── */}
                    {part && (
                        <div className="fade-in-up" style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>🔧</span>
                            <div>
                                <div style={{ color: '#7c3aed', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verifying compatibility for</div>
                                <div style={{ color: '#1a2035', fontWeight: 700, fontSize: '1rem', marginTop: '0.15rem' }}>
                                    {part.partName} <span style={{ color: '#64748b', fontWeight: 400 }}>by {part.brand}</span>
                                    {part.price && <span style={{ color: '#e8384f', fontWeight: 700, marginLeft: '0.75rem' }}>{fmtPrice(part.price)}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Auto-fill notice ── */}
                    {user && (
                        <div className="fade-in-up" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '0.7rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#15803d' }}>
                            <span>✅</span> Your account details have been pre-filled. Just add your chassis number and submit.
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="fade-in-up" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: '2rem', textAlign: 'center', marginBottom: '2rem', backdropFilter: 'blur(12px)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                            <h3 style={{ color: '#22c55e', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Inquiry Submitted!</h3>
                            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Our team will review your inquiry and contact you shortly.</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="fade-in-up" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '1.25rem', color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.85rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.2rem' }}>⚠️</span> Failed to submit inquiry. Please try again.
                        </div>
                    )}

                    <div className="card fade-in-up" style={{ padding: '2.5rem', borderRadius: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem' }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#e8384f,#c1121f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 16px rgba(232,56,79,0.3)' }}>🔍</div>
                            <div>
                                <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Submit Inquiry</h2>
                                <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>All fields are required unless marked optional</div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                                <div>
                                    <label className="form-label">Your Name</label>
                                    <input className="form-input" placeholder="Kamal Perera" value={form.customerName} onChange={set('customerName')} required />
                                </div>
                                <div>
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                                <div>
                                    <label className="form-label">Phone Number <span style={{ opacity: 0.5 }}>(Optional)</span></label>
                                    <input className="form-input" placeholder="07X XXXX XXX" value={form.phone} onChange={set('phone')} />
                                </div>
                                <div>
                                    <label className="form-label">Chassis Number</label>
                                    <input
                                        className="form-input"
                                        placeholder="e.g. NHP10-1234567"
                                        value={form.chassisNumber}
                                        onChange={(e) => set('chassisNumber')({ target: { value: e.target.value.toUpperCase() } })}
                                        required
                                        style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Parts Required / Message</label>
                                <textarea className="form-input" rows={6} placeholder="Describe the parts you need..." value={form.message} onChange={set('message')} required style={{ resize: 'vertical' }} />
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '0.95rem', justifyContent: 'center', marginTop: '0.75rem', borderRadius: 12 }} disabled={loading}>
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin-slow 0.7s linear infinite' }} />
                                        Submitting Inquiry…
                                    </span>
                                ) : 'Submit Inquiry'}
                            </button>
                        </form>
                    </div>

                    {/* ── Info Cards ── */}
                    <div className="fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
                        {[
                            ['⏱️', '24-Hour Response', 'We review all inquiries within 1 business day.'],
                            ['🎯', 'Exact Compatibility', 'Using your chassis number guarantees fitment.'],
                        ].map(([icon, title, text]) => (
                            <div key={title} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ fontSize: '1.5rem', background: 'rgba(255,255,255,0.03)', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                                <div>
                                    <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{title}</div>
                                    <div style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>{text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquiryForm;
