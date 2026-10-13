// pages/Register.jsx – Sococara-style registration page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import useAuth from '../hooks/useAuth';
import AuthLogo from '../components/AuthLogo';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
        setError(''); setLoading(true);
        try {
            const { data } = await register({ name: form.name, email: form.email, password: form.password });
            loginUser(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    const strength = form.password.length >= 8 ? 3 : form.password.length >= 6 ? 2 : form.password.length > 0 ? 1 : 0;
    const strengthColors = ['transparent', '#ef4444', '#f59e0b', '#22c55e'];
    const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f5f6f8' }}>
            <div style={{ width: '100%', maxWidth: 820, animation: 'fadeInUp 0.4s ease' }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <AuthLogo />
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.65rem 1.5rem', display: 'inline-block', marginTop: '0.75rem' }}>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Create your free account to get started.</p>
                    </div>
                </div>

                {/* Card */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

                    {/* LEFT – Register form */}
                    <div style={{ padding: '2.5rem', borderRight: '1px solid #f1f5f9' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1520', marginBottom: '1.75rem', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>CREATE ACCOUNT</h2>

                        {error && (
                            <div style={{ background: '#fff5f6', border: '1px solid #fecaca', borderRadius: 6, padding: '0.65rem 0.9rem', color: '#dc2626', fontSize: '0.83rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#0f1520', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                                    <span style={{ color: '#2db55d', fontSize: '0.6rem' }}>■</span> FULL NAME
                                </label>
                                <input type="text" className="form-input" placeholder="Your full name"
                                    value={form.name} onChange={set('name')} required />
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#0f1520', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                                    <span style={{ color: '#2db55d', fontSize: '0.6rem' }}>■</span> EMAIL ADDRESS
                                </label>
                                <input type="email" className="form-input" placeholder="you@example.com"
                                    value={form.email} onChange={set('email')} required />
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#0f1520', letterSpacing: '0.03em' }}>
                                        <span style={{ color: '#2db55d', fontSize: '0.6rem' }}>■</span> PASSWORD
                                    </label>
                                    {strength > 0 && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: strengthColors[strength] }}>{strengthLabels[strength]}</span>}
                                </div>
                                <input type="password" className="form-input" placeholder="Min. 6 characters"
                                    value={form.password} onChange={set('password')} required minLength={6} />
                                <div style={{ display: 'flex', gap: 4, marginTop: '0.4rem' }}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= strength ? strengthColors[strength] : '#e2e8f0', transition: 'background 0.3s' }} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#0f1520', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                                    <span style={{ color: '#2db55d', fontSize: '0.6rem' }}>■</span> CONFIRM PASSWORD
                                </label>
                                <input type="password" className="form-input" placeholder="Repeat your password"
                                    value={form.confirm} onChange={set('confirm')} required />
                                {form.confirm && form.password !== form.confirm && (
                                    <p style={{ color: '#dc2626', fontSize: '0.72rem', marginTop: '0.3rem' }}>Passwords don't match</p>
                                )}
                            </div>
                            <button type="submit" style={{
                                width: '100%', padding: '0.85rem', background: '#e8384f', color: 'white',
                                border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                transition: 'background 0.2s', letterSpacing: '0.02em', marginTop: '0.25rem',
                            }} disabled={loading}
                                onMouseEnter={e => e.currentTarget.style.background = '#c82338'}
                                onMouseLeave={e => e.currentTarget.style.background = '#e8384f'}>
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin-slow 0.7s linear infinite' }} />
                                        Creating…
                                    </span>
                                ) : 'Create Account →'}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT – Already have account */}
                    <div style={{ padding: '2.5rem', background: '#fafbfc', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f1520', marginBottom: '0.75rem' }}>Already have an account?</h3>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Sign in to access your vehicle listings and orders.</p>
                        <Link to="/login" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.8rem 1.75rem', background: '#94a3b8', color: 'white',
                            borderRadius: 6, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                            transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#e8384f'}
                            onMouseLeave={e => e.currentTarget.style.background = '#94a3b8'}>
                            Sign in →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
