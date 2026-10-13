// components/AuthLogo.jsx - Custom typography logo for Auth pages
import { Link } from 'react-router-dom';

const AuthLogo = () => (
    <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <div style={{
                background: 'linear-gradient(135deg, #e8384f 0%, #b91c1c 100%)',
                color: 'white', fontWeight: 900, fontSize: '1.8rem', width: 44, height: 44,
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(232,56,79,0.3)'
            }}>S</div>
            <div style={{ color: '#0f1520', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
                Shan<span style={{ color: '#e8384f' }}>Auto</span>Lanka
            </div>
        </div>
        <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            (PVT) LTD.
        </div>
    </Link>
);

export default AuthLogo;
