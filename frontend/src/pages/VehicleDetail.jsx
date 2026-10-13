// pages/VehicleDetail.jsx – Premium Vehicle Detail page
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVehicleById } from '../services/vehicleService';
import Spinner from '../components/Spinner';
import { imageUrl } from '../utils/imageUrl';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;
const C = { text: '#1a2035', sub: '#64748b', price: '#e8384f', border: 'rgba(0,0,0,0.08)' };

const VehicleDetail = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getVehicleById(id)
            .then(r => setVehicle(r.data))
            .catch(() => setError('Vehicle not found or no longer available.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}><Spinner /></div>;

    if (error) return (
        <div style={{ textAlign: 'center', padding: '10rem 2rem', color: C.sub, minHeight: '80vh' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>🚗</div>
            <h2 style={{ color: C.text, fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Oops!</h2>
            <p style={{ maxWidth: 400, margin: '0 auto 1.5rem' }}>{error}</p>
            <Link to="/vehicles" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: 10 }}>← Back to Inventory</Link>
        </div>
    );

    if (!vehicle) return null;

    const locIcon = vehicle.location === 'Auction' ? '🔨' : vehicle.location === 'Warehouse' ? '🏭' : '🏢';

    const specs = [
        { label: 'Brand', val: vehicle.brand, icon: '🏷️' },
        { label: 'Model', val: vehicle.model, icon: '🚘' },
        { label: 'Year', val: vehicle.year, icon: '📅' },
        { label: 'Engine', val: vehicle.engineCapacity, icon: '⚡' },
        { label: 'Transmission', val: vehicle.transmission, icon: '⚙️' },
        { label: 'Fuel Type', val: vehicle.fuelType, icon: '⛽' },
        { label: 'Mileage', val: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'Unregistered', icon: '🛣️' },
        { label: 'Location', val: vehicle.location || 'Showroom', icon: locIcon },
    ];

    const mainImg = vehicle.images && vehicle.images.length > 0 ? imageUrl(vehicle.images[0]) : null;

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
            <Link to="/vehicles" style={{ color: C.sub, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.sub}>
                <span style={{ fontSize: '1.1rem' }}>←</span> Back to Inventory
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>

                {/* ── Img section ── */}
                <div className="fade-in-up">
                    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {mainImg ? (
                            <img
                                src={mainImg}
                                alt={vehicle.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<div style="font-size:8rem;">🚗</div>'; }}
                            />
                        ) : (
                            <div style={{ fontSize: '8rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))' }}>🚗</div>
                        )}
                        {/* Location badge overlaid on image */}
                        {vehicle.location && (
                            <div style={{
                                position: 'absolute', top: 12, left: 12,
                                background: vehicle.location === 'Showroom' ? 'rgba(37,99,235,0.85)' : vehicle.location === 'Auction' ? 'rgba(217,119,6,0.85)' : 'rgba(71,85,105,0.85)',
                                color: 'white', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                                padding: '0.25rem 0.7rem', borderRadius: 99, backdropFilter: 'blur(6px)',
                            }}>
                                {locIcon} {vehicle.location}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Info section ── */}
                <div className="fade-in-up-2">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem', flexWrap: 'wrap' }}>
                        <h1 style={{ color: C.text, fontSize: '2rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0 }}>{vehicle.title}</h1>
                        <span className={`badge badge-${vehicle.status === 'available' ? 'success' : vehicle.status === 'reserved' ? 'warning' : 'danger'}`} style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}>
                            {vehicle.status}
                        </span>
                    </div>

                    {/* Price Breakdown */}
                    {vehicle.tax > 0 ? (
                        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.25rem 1.5rem', margin: '1rem 0 1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ color: C.sub, fontSize: '0.85rem' }}>Base Price</span>
                                <span style={{ color: C.text, fontWeight: 600, fontSize: '1rem' }}>{fmtPrice(vehicle.price)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: `1px dashed ${C.border}` }}>
                                <span style={{ color: C.sub, fontSize: '0.85rem' }}>Tax</span>
                                <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '1rem' }}>+ {fmtPrice(vehicle.tax)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: C.text, fontSize: '0.9rem', fontWeight: 700 }}>Total</span>
                                <span style={{ color: C.price, fontWeight: 900, fontSize: '1.6rem', letterSpacing: '-0.03em' }}>{fmtPrice(vehicle.price + vehicle.tax)}</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: C.price, fontSize: '2.2rem', fontWeight: 800, margin: '1rem 0 1.5rem', letterSpacing: '-0.04em' }}>
                            {fmtPrice(vehicle.price)}
                        </div>
                    )}

                    {/* Specs Grid */}
                    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', marginBottom: '2rem' }}>
                        <h3 style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem', letterSpacing: '-0.01em', borderBottom: `1px solid ${C.border}`, paddingBottom: '0.75rem', marginTop: 0 }}>Vehicle Specifications</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem' }}>
                            {specs.map(({ label, val, icon }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                                    <div style={{ background: '#f8fafc', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0, border: `1px solid ${C.border}` }}>{icon}</div>
                                    <div>
                                        <div style={{ color: C.sub, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                                        <div style={{ color: C.text, fontSize: '0.9rem', fontWeight: 600, letterSpacing: '-0.01em' }}>{val}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {vehicle.description && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: C.text, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', marginTop: 0 }}>Description</h3>
                            <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 400, margin: 0 }}>{vehicle.description}</p>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/inquiry" className="btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '0.95rem', justifyContent: 'center', borderRadius: 12 }}>
                            <span style={{ fontSize: '1.1rem' }}>📩</span> Submit Inquiry
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetail;
