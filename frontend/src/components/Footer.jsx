// components/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer style={{ background: '#0f1520', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', fontFamily: 'Outfit', marginBottom: '0.75rem' }}>
                        🚗 ShanAuto Lanka
                    </div>
                    <p style={{ color: '#8b9ab5', fontSize: '0.875rem', lineHeight: 1.7 }}>
                        Sri Lanka's trusted importer of Japanese vehicles and genuine spare parts.
                    </p>
                </div>
                <div>
                    <div style={{ fontWeight: 600, color: '#e8eaf0', marginBottom: '0.75rem', fontSize: '0.9rem', borderBottom: '2px solid #2db55d', paddingBottom: '0.4rem', display: 'inline-block' }}>Quick Links</div>
                    {[['/', 'Home'], ['/vehicles', 'Vehicles'], ['/spareparts', 'Spare Parts'], ['/inquiry', 'Submit Inquiry']].map(([to, label]) => (
                        <Link key={to} to={to} style={{ display: 'block', color: '#8b9ab5', fontSize: '0.85rem', marginBottom: '0.4rem', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = '#e8384f'} onMouseLeave={e => e.target.style.color = '#8b9ab5'}>
                            {label}
                        </Link>
                    ))}
                </div>
                <div>
                    <div style={{ fontWeight: 600, color: '#e8eaf0', marginBottom: '0.75rem', fontSize: '0.9rem', borderBottom: '2px solid #2db55d', paddingBottom: '0.4rem', display: 'inline-block' }}>Contact</div>
                    <p style={{ color: '#8b9ab5', fontSize: '0.85rem', lineHeight: 1.9 }}>
                        📍 Colombo, Sri Lanka<br />
                        📞 +94 11 234 5678<br />
                        ✉️ info@shanauto.lk
                    </p>
                </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem', textAlign: 'center', color: '#8b9ab5', fontSize: '0.8rem' }}>
                © {new Date().getFullYear()} Shan Auto Lanka Co. Ltd. All rights reserved.
            </div>
        </div>
    </footer>
);

export default Footer;
