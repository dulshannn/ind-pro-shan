// layouts/UserLayout.jsx – Sococara-style customer dashboard with dark sidebar
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import shanLogo from '../assets/logo shan.png';

const NAV_LINKS = [
    { to: '/dashboard', icon: '📊', label: 'Overview' },
    { to: '/dashboard/orders', icon: '📦', label: 'My Orders' },
    { to: '/dashboard/inquiries', icon: '📩', label: 'My Inquiries' },
    { to: '/dashboard/profile', icon: '👤', label: 'Profile' },
];

const UserLayout = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logoutUser(); navigate('/login'); };
    const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
            {/* ── Sidebar ── */}
            <aside style={{
                width: 232, flexShrink: 0,
                background: '#0f1520',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50,
            }}>
                {/* Logo */}
                <div style={{ padding: '1.25rem 1.1rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
                        <div style={{ background: '#ffffff', borderRadius: 7, padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
                            <img src={shanLogo} alt="Shan Auto Lanka" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
                        </div>
                    </NavLink>
                </div>

                {/* User badge */}
                <div style={{ padding: '1rem 1.1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#2db55d,#1f9149)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.88rem', flexShrink: 0 }}>
                            {initials}
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                            <div style={{ color: '#8b9ab5', fontSize: '0.68rem', whiteSpace: 'nowrap' }}>Customer</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ padding: '0.65rem', flex: 1 }}>
                    <div style={{ color: '#8b9ab5', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.5rem 0.5rem 0.4rem', marginBottom: '0.15rem' }}>Menu</div>
                    {NAV_LINKS.map(({ to, icon, label }) => (
                        <NavLink key={to} to={to} end={to === '/dashboard'} style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: '0.65rem',
                            padding: '0.6rem 0.8rem', borderRadius: 6, textDecoration: 'none',
                            marginBottom: '0.1rem', fontSize: '0.85rem', fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'white' : '#8b9ab5',
                            background: isActive ? 'rgba(232,56,79,0.14)' : 'transparent',
                            borderLeft: `3px solid ${isActive ? '#e8384f' : 'transparent'}`,
                            transition: 'all 0.18s',
                        })}>
                            <span style={{ fontSize: '1rem' }}>{icon}</span>
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom */}
                <div style={{ padding: '0.65rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.8rem', borderRadius: 6, textDecoration: 'none', color: '#8b9ab5', fontSize: '0.82rem', transition: 'color 0.18s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'white'}
                        onMouseLeave={e => e.currentTarget.style.color = '#8b9ab5'}>
                        🌐 Back to site
                    </NavLink>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.8rem', borderRadius: 6, color: '#e8384f', background: 'rgba(232,56,79,0.08)', border: '1px solid rgba(232,56,79,0.15)', cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left', width: '100%', transition: 'all 0.18s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,56,79,0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,56,79,0.08)'; }}>
                        🚪 Sign out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, marginLeft: 232, padding: '2rem 2.5rem', minHeight: '100vh', overflowX: 'hidden' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
