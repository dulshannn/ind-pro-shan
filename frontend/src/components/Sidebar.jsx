// components/Sidebar.jsx – Sococara-style Admin sidebar
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import shanLogo from '../assets/logo shan.png';

const getNavItems = (user) => {
    const all = [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard', perm: 'dashboard' },
        { path: '/admin/orders', icon: '📦', label: 'Orders', perm: 'orders' },
        { path: '/admin/inquiries', icon: '📩', label: 'Inquiries', perm: 'inquiries' },
        { path: '/admin/reports', icon: '📄', label: 'Reports', perm: 'reports' },
        { path: '/admin/vehicles', icon: '🚗', label: 'Vehicles', perm: 'vehicles' },
        { path: '/admin/spareparts', icon: '🔧', label: 'Spare Parts', perm: 'spareparts' },
        { path: '/admin/customers', icon: '👥', label: 'Customers', perm: 'customers' },
    ];
    if (user?.role === 'admin') return all;
    if (user?.role === 'manager' && user.permissions) {
        return all.filter(item => user.permissions.includes(item.perm));
    }
    return [];
};

const Sidebar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'A';
    const handleLogout = () => { logoutUser(); navigate('/login'); };

    return (
        <aside style={{ width: 232, minHeight: '100vh', background: '#0f1520', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 50 }}>
            {/* Logo */}
            <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
                    <div style={{ background: '#ffffff', borderRadius: 7, padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
                        <img src={shanLogo} alt="Shan Auto Lanka" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
                    </div>
                </NavLink>
            </div>

            {/* Admin badge */}
            <div style={{ padding: '0.9rem 1.1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#e8384f,#c82338)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                        {initials}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ color: 'white', fontSize: '0.83rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                        <div style={{ color: user?.role === 'manager' ? '#3b82f6' : '#2db55d', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            {user?.role === 'manager' ? 'Manager' : 'Administrator'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '0.6rem', overflowY: 'auto' }}>
                <div style={{ color: '#8b9ab5', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.5rem 0.5rem 0.35rem', marginBottom: '0.1rem' }}>Navigation</div>
                {getNavItems(user).map(({ path, icon, label }) => (
                    <NavLink key={path} to={path} style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: '0.65rem',
                        padding: '0.6rem 0.8rem', borderRadius: 6, textDecoration: 'none',
                        marginBottom: '0.1rem', fontSize: '0.85rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'white' : '#8b9ab5',
                        background: isActive ? 'rgba(232,56,79,0.14)' : 'transparent',
                        borderLeft: `3px solid ${isActive ? '#e8384f' : 'transparent'}`,
                        transition: 'all 0.18s',
                    })}>
                        <span style={{ fontSize: '1rem' }}>{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom */}
            <div style={{ padding: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.8rem', borderRadius: 6, textDecoration: 'none', color: '#8b9ab5', fontSize: '0.82rem', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8b9ab5'}>
                    🌐 Visit site
                </NavLink>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.8rem', borderRadius: 6, background: 'rgba(232,56,79,0.08)', color: '#e8384f', border: '1px solid rgba(232,56,79,0.15)', cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left', width: '100%', transition: 'all 0.18s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,56,79,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,56,79,0.08)'; }}>
                    🚪 Sign out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
