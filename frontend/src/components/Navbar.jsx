// components/Navbar.jsx – Responsive navigation with hamburger mobile menu
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import shanLogo from '../assets/logo shan.png';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu on route change
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => { logoutUser(); navigate('/login'); setMenuOpen(false); };

    const navLinkStyle = ({ isActive }) => ({
        color: isActive ? '#fff' : '#8b9ab5',
        fontWeight: isActive ? 600 : 400,
        fontSize: '0.875rem',
        padding: '0.4rem 0.85rem',
        borderRadius: 4,
        transition: 'color 0.15s',
        textDecoration: 'none',
        letterSpacing: '0.01em',
        borderBottom: isActive ? '2px solid #e8384f' : '2px solid transparent',
        whiteSpace: 'nowrap',
    });

    const mobileNavLinkStyle = ({ isActive }) => ({
        display: 'block',
        padding: '0.85rem 1.25rem',
        color: isActive ? '#fff' : '#8b9ab5',
        fontWeight: isActive ? 700 : 400,
        fontSize: '0.95rem',
        textDecoration: 'none',
        borderLeft: isActive ? '3px solid #e8384f' : '3px solid transparent',
        background: isActive ? 'rgba(232,56,79,0.1)' : 'transparent',
        transition: 'all 0.15s',
    });

    return (
        <nav ref={menuRef} style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
            background: '#0f1520',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
            {/* ── Main bar ── */}
            <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 1.25rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{ background: '#ffffff', borderRadius: 10, padding: '6px 14px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
                        <img src={shanLogo} alt="Shan Auto Lanka" style={{ height: 52, width: 'auto', objectFit: 'contain' }} />
                    </div>
                </Link>

                {/* Desktop nav links */}
                <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', flex: 1, justifyContent: 'center' }}>
                    {[['/', 'Home'], ['/vehicles', 'Vehicles'], ['/spareparts', 'Spare Parts'], ['/inquiry', 'Inquiry']].map(([to, label]) => (
                        <NavLink key={to} to={to} end={to === '/'} style={navLinkStyle}
                            onMouseEnter={e => { if (e.currentTarget.style.color !== 'rgb(255,255,255)') e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { if (e.currentTarget.style.fontWeight !== '600') e.currentTarget.style.color = '#8b9ab5'; }}>
                            {label}
                        </NavLink>
                    ))}
                </div>

                {/* Right section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    {/* Cart — always visible */}
                    <Link to="/cart" style={{
                        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 38, height: 38, borderRadius: 6,
                        background: totalItems > 0 ? 'rgba(232,56,79,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${totalItems > 0 ? 'rgba(232,56,79,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        color: totalItems > 0 ? '#e8384f' : '#8b9ab5',
                        fontSize: '1rem', transition: 'all 0.18s', textDecoration: 'none',
                    }}>
                        🛒
                        {totalItems > 0 && (
                            <span style={{
                                position: 'absolute', top: -5, right: -5,
                                background: '#e8384f', color: 'white',
                                borderRadius: '50%', width: 17, height: 17,
                                fontSize: '0.6rem', fontWeight: 800,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{totalItems}</span>
                        )}
                    </Link>

                    {/* Desktop auth buttons */}
                    <div className="nav-desktop-auth">
                        {user ? (
                            <>
                                {(user.role === 'admin' || user.role === 'manager') ? (
                                    <Link to="/admin/dashboard" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#8b9ab5', padding: '0.45rem 0.85rem', borderRadius: 5, textDecoration: 'none', transition: 'color 0.15s', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'white'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#8b9ab5'}>
                                        {user.role === 'admin' ? 'Admin Panel' : 'Manager Panel'}
                                    </Link>
                                ) : (
                                    <Link to="/dashboard" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#8b9ab5', padding: '0.45rem 0.85rem', borderRadius: 5, textDecoration: 'none', transition: 'color 0.15s', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'white'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#8b9ab5'}>
                                        Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} style={{
                                    fontSize: '0.82rem', fontWeight: 600, color: '#8b9ab5', background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, padding: '0.45rem 0.9rem', cursor: 'pointer', transition: 'all 0.18s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,56,79,0.1)'; e.currentTarget.style.color = '#e8384f'; e.currentTarget.style.borderColor = 'rgba(232,56,79,0.3)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#8b9ab5'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ fontSize: '0.85rem', fontWeight: 500, color: '#8b9ab5', padding: '0.45rem 0.75rem', borderRadius: 5, textDecoration: 'none', transition: 'color 0.15s', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#8b9ab5'}>
                                    LOGIN
                                </Link>
                                <Link to="/register" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.48rem 1.1rem', borderRadius: 5 }}>
                                    Register →
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Hamburger — mobile only */}
                    <button
                        className="nav-hamburger"
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                        style={{
                            display: 'none', flexDirection: 'column', gap: 5, justifyContent: 'center', alignItems: 'center',
                            width: 38, height: 38, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 6, cursor: 'pointer', padding: '0 8px',
                        }}>
                        <span style={{ display: 'block', width: 20, height: 2, background: menuOpen ? '#e8384f' : '#8b9ab5', borderRadius: 2, transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none', transition: 'all 0.25s' }} />
                        <span style={{ display: 'block', width: 20, height: 2, background: menuOpen ? '#e8384f' : '#8b9ab5', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'all 0.25s' }} />
                        <span style={{ display: 'block', width: 20, height: 2, background: menuOpen ? '#e8384f' : '#8b9ab5', borderRadius: 2, transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none', transition: 'all 0.25s' }} />
                    </button>
                </div>
            </div>

            {/* ── Mobile dropdown menu ── */}
            <div className="nav-mobile-menu" style={{
                display: menuOpen ? 'block' : 'none',
                background: '#0f1520',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
                {/* Nav links */}
                {[['/', 'Home'], ['/vehicles', 'Vehicles'], ['/spareparts', 'Spare Parts'], ['/inquiry', 'Inquiry']].map(([to, label]) => (
                    <NavLink key={to} to={to} end={to === '/'} style={mobileNavLinkStyle}>
                        {label}
                    </NavLink>
                ))}

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.5rem 0' }} />

                {/* Auth actions */}
                <div style={{ padding: '0.75rem 1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {user ? (
                        <>
                            <div style={{ color: '#8b9ab5', fontSize: '0.78rem', marginBottom: '0.1rem' }}>
                                Signed in as <span style={{ color: '#fff', fontWeight: 600 }}>{user.name}</span>
                            </div>
                            <Link to={(user.role === 'admin' || user.role === 'manager') ? '/admin/dashboard' : '/dashboard'}
                                style={{ display: 'block', padding: '0.7rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#8b9ab5', fontSize: '0.875rem', textDecoration: 'none', textAlign: 'center' }}>
                                {(user.role === 'admin' || user.role === 'manager') ? (user.role === 'admin' ? '⚙️ Admin Panel' : '⚙️ Manager Panel') : '📊 Dashboard'}
                            </Link>
                            <button onClick={handleLogout}
                                style={{ width: '100%', padding: '0.7rem', background: 'rgba(232,56,79,0.1)', border: '1px solid rgba(232,56,79,0.25)', borderRadius: 6, color: '#e8384f', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                            <Link to="/login"
                                style={{ display: 'block', padding: '0.7rem', textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#8b9ab5', fontSize: '0.875rem', textDecoration: 'none' }}>
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary"
                                style={{ display: 'block', padding: '0.7rem', textAlign: 'center', borderRadius: 6, fontSize: '0.875rem', justifyContent: 'center' }}>
                                Register →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
