// pages/Vehicles.jsx – Premium Vehicle listing page
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getVehicles } from '../services/vehicleService';
import Spinner from '../components/Spinner';
import { imageUrl } from '../utils/imageUrl';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;

const BRANDS = ['All', 'Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mazda', 'Mitsubishi', 'Subaru', 'Daihatsu'];
const FUEL_TYPES = ['All', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];
const TRANSMISSIONS = ['All', 'Automatic', 'Manual', 'CVT', 'Semi-Automatic'];
const LOCATIONS = ['All', 'Showroom', 'Warehouse', 'Auction'];

const filterInputStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: '0.65rem 0.9rem',
    color: 'var(--text)',
    outline: 'none',
    fontSize: '0.85rem'
};

const locationStyle = (loc) => ({
    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
    padding: '0.15rem 0.55rem', borderRadius: 99,
    background: loc === 'Showroom' ? 'rgba(37,99,235,0.15)' : loc === 'Auction' ? 'rgba(217,119,6,0.18)' : 'rgba(100,116,139,0.15)',
    color: loc === 'Showroom' ? '#3b82f6' : loc === 'Auction' ? '#d97706' : '#94a3b8',
    border: `1px solid ${loc === 'Showroom' ? 'rgba(59,130,246,0.3)' : loc === 'Auction' ? 'rgba(217,119,6,0.3)' : 'rgba(148,163,184,0.2)'}`,
});

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ brand: 'All', fuelType: 'All', transmission: 'All', location: 'All', minPrice: '', maxPrice: '', search: '' });

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.brand !== 'All') params.brand = filters.brand;
            if (filters.fuelType !== 'All') params.fuelType = filters.fuelType;
            if (filters.transmission !== 'All') params.transmission = filters.transmission;
            if (filters.location !== 'All') params.location = filters.location;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.search) params.search = filters.search;
            const { data } = await getVehicles(params);
            setVehicles(data.vehicles || []);
        } finally { setLoading(false); }
    }, [filters]);

    useEffect(() => { fetchVehicles(); }, [fetchVehicles]);
    const set = (k) => (e) => setFilters(p => ({ ...p, [k]: e.target.value }));

    return (
        <div>
            {/* ── Hero ── */}
            <div className="page-hero">
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
                    <div className="section-label fade-in-up">Direct from Japan</div>
                    <h1 className="fade-in-up-2" style={{ fontSize: '3rem', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>Browse Vehicles</h1>
                    <p className="fade-in-up-3" style={{ color: 'var(--muted)', fontSize: '1.05rem', fontWeight: 300, maxWidth: 480, lineHeight: 1.6 }}>
                        Explore our hand-picked inventory of premium Japanese vehicles, thoroughly tested and ready for the road.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
                {/* ── Filters ── */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', marginBottom: '2.5rem', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                        <div>
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Search</label>
                            <input style={{ ...filterInputStyle, width: '100%' }} placeholder="Corolla, Civic..." value={filters.search} onChange={set('search')} />
                        </div>
                        <div>
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Brand</label>
                            <select className="form-select" style={{ ...filterInputStyle, width: '100%' }} value={filters.brand} onChange={set('brand')}>
                                {BRANDS.map(b => <option key={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Fuel Type</label>
                            <select className="form-select" style={{ ...filterInputStyle, width: '100%' }} value={filters.fuelType} onChange={set('fuelType')}>
                                {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Transmission</label>
                            <select className="form-select" style={{ ...filterInputStyle, width: '100%' }} value={filters.transmission} onChange={set('transmission')}>
                                {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Location</label>
                            <select className="form-select" style={{ ...filterInputStyle, width: '100%' }} value={filters.location} onChange={set('location')}>
                                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Max Price (Rs.)</label>
                            <input type="number" style={{ ...filterInputStyle, width: '100%' }} placeholder="Any" value={filters.maxPrice} onChange={set('maxPrice')} />
                        </div>
                    </div>
                </div>

                {/* ── Grid ── */}
                {loading ? <Spinner /> : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                                Showing <strong style={{ color: 'white' }}>{vehicles.length}</strong> vehicles
                            </div>
                        </div>

                        {vehicles.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🚫</div>
                                <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>No vehicles found</h3>
                                <p>Try adjusting your search filters to see more results.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {vehicles.map((v, i) => (
                                    <Link key={v._id} to={`/vehicles/${v._id}`} style={{ textDecoration: 'none', animationDelay: `${i * 40}ms`, animation: 'fadeInUp2 0.5s cubic-bezier(0.22,1,0.36,1) both' }}>
                                        <div className="card" style={{ height: '100%' }}>
                                            {v.images?.[0] ? (
                                                <div style={{ height: 210, overflow: 'hidden', background: '#0f0f1c', position: 'relative' }}>
                                                    <img
                                                        src={imageUrl(v.images[0])}
                                                        alt={v.title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                        onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<div style="height:210px;display:flex;align-items:center;justify-content:center;font-size:4rem;background:linear-gradient(135deg,#1a1a2e,#0f0f1c)">🚗</div>'; }}
                                                    />
                                                    {v.images.length > 1 && (
                                                        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '0.15rem 0.5rem', fontSize: '0.68rem', color: 'white', fontWeight: 600 }}>+{v.images.length - 1} photos</div>
                                                    )}
                                                    {/* Location pill overlaid on image */}
                                                    {v.location && (
                                                        <div style={{ position: 'absolute', top: 10, left: 10, ...locationStyle(v.location), backdropFilter: 'blur(6px)' }}>
                                                            {v.location === 'Showroom' ? '🏢' : v.location === 'Auction' ? '🔨' : '🏭'} {v.location}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="img-placeholder" style={{ height: 210, fontSize: '4rem', position: 'relative' }}>
                                                    🚗
                                                    {v.location && (
                                                        <div style={{ position: 'absolute', top: 10, left: 10, ...locationStyle(v.location) }}>
                                                            {v.location === 'Showroom' ? '🏢' : v.location === 'Auction' ? '🔨' : '🏭'} {v.location}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div style={{ padding: '1.25rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                    <h3 style={{ color: 'white', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', flex: 1 }}>{v.title}</h3>
                                                    <span className={`badge badge-${v.status === 'available' ? 'success' : v.status === 'reserved' ? 'warning' : 'danger'}`} style={{ marginLeft: 6, flexShrink: 0 }}>
                                                        {v.status}
                                                    </span>
                                                </div>
                                                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>📅 {v.year}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>⚙️ {v.transmission}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>⛽ {v.fuelType}</span>
                                                </div>
                                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ color: '#e8384f', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>{fmtPrice(v.price)}</span>
                                                    <span style={{ color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                        View details <span style={{ fontSize: '0.9em' }}>→</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Vehicles;
