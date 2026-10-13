// pages/Login.jsx – Sococara-style login page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import useAuth from '../hooks/useAuth';
import AuthLogo from '../components/AuthLogo';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const { data } = await login(form);
            loginUser(data);
            navigate((data.role === 'admin' || data.role === 'manager') ? '/admin/dashboard' : '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f5f6f8' }}>
            <div style={{ width: '100%', maxWidth: 820, animation: 'fadeInUp 0.4s ease' }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <AuthLogo />
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.65rem 1.5rem', display: 'inline-block', marginTop: '0.75rem' }}>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Please login or <Link to="/register" style={{ color: '#e8384f', fontWeight: 600 }}>create a free account</Link>.</p>
                    </div>
                </div>

                {/* Two-column card */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

                    {/* LEFT – Login form */}
                    <div style={{ padding: '2.5rem', borderRight: '1px solid #f1f5f9' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1520', marginBottom: '1.75rem', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>LOGIN</h2>

                        {error && (
                            <div style={{ background: '#fff5f6', border: '1px solid #fecaca', borderRadius: 6, padding: '0.65rem 0.9rem', color: '#dc2626', fontSize: '0.83rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#0f1520', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                                    <span style={{ color: '#2db55d', fontSize: '0.6rem' }}>■</span> LOGIN ID (Email)
                                </label>
                                <input type="email" className="form-input"
                                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#0f1520', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                                    <span style={{ color: '#2db55d', fontSize: '0.6rem' }}>■</span> PASSWORD
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input type={showPw ? 'text' : 'password'} className="form-input" style={{ paddingRight: '5rem' }}
                                        value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                                    <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#64748b' }}>
                                        {showPw ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem' }}>Show password.</p>
                            </div>
                            <button type="submit" style={{
                                width: '100%', padding: '0.85rem', background: '#e8384f', color: 'white',
                                border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                transition: 'background 0.2s', letterSpacing: '0.02em', marginTop: '0.5rem',
                            }} disabled={loading}
                                onMouseEnter={e => e.currentTarget.style.background = '#c82338'}
                                onMouseLeave={e => e.currentTarget.style.background = '#e8384f'}>
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin-slow 0.7s linear infinite' }} />
                                        Signing in…
                                    </span>
                                ) : 'LOGIN →'}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem' }}>
                            <Link to="/register" style={{ color: '#e8384f', textDecoration: 'none' }}>⊙ Forgot your password?</Link>
                        </p>
                    </div>

                    {/* RIGHT – Register prompt */}
                    <div style={{ padding: '2.5rem', background: '#fafbfc', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f1520', marginBottom: '0.75rem' }}>If you don't have an account</h3>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Create an account for free!</p>
                        <Link to="/register" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.8rem 1.75rem', background: '#94a3b8', color: 'white',
                            borderRadius: 6, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                            transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#2db55d'}
                            onMouseLeave={e => e.currentTarget.style.background = '#94a3b8'}>
                            Creating an account →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
