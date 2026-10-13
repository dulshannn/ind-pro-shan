import React, { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { getVehicles } from '../services/vehicleService';
import { getSpareParts } from '../services/sparePartService';
import useCart from '../hooks/useCart';
import heroBg1 from '../assets/home bg.jpg';
import heroBg2 from '../assets/bg2.jpg';
import heroBg3 from '../assets/bg3.jpg';
import heroBg4 from '../assets/bg4.jpg';
import heroBg5 from '../assets/bg5.jpg';
import shanLogo from '../assets/logo shan.png';
import ceoPic from '../assets/ceo.jpg';
import directorPic from '../assets/director.jpg';
import { imageUrl } from '../utils/imageUrl';
import iconGenuine from '../assets/genuine icon.png';
import iconDirectImport from '../assets/direct import icon.png';
import iconChassi from '../assets/chassi icon.png';
import iconDelivery from '../assets/Fast Delivery icon.png';


const HERO_SLIDES = [heroBg1, heroBg2, heroBg3, heroBg4, heroBg5];


/* ── Constants & Static Data ─────────────────────────────────────────────────── */
const THEME = {
    primary: '#D32F2F',      // Deep Japanese Red
    secondary: '#0F172A',    // Dark Slate (Text & Accents)
    background: '#F8FAFC',   // Light Gray background
    surface: '#FFFFFF',      // Pure White cards
    textMain: '#1E293B',     // Main text
    textMuted: '#64748B',    // Muted text
    border: '#E2E8F0',       // Soft borders
    success: '#16A34A',      // Green for availability
};

const STATS_DATA = [
    { to: 500, suffix: '+', label: 'Vehicles Sold' },
    { to: 10000, suffix: '+', label: 'Parts Supplied' },
    { to: 5000, suffix: '+', label: 'Happy Customers' },
    { to: 15, suffix: ' yrs', label: 'Experience' },
];

const TRUST_FEATURES = [
    { icon: '🇯🇵', text: 'Japan Certified Stock' },
    { icon: '🔒', text: 'Secure Online Ordering' },
    { icon: '🚚', text: 'Island-Wide Delivery' },
    { icon: '💬', text: 'Chassis Compatibility Check' },
    { icon: '⭐', text: '5000+ Happy Customers' },
];

const WHY_US_FEATURES = [
    { img: iconGenuine, title: 'Genuine Parts', text: 'Every part sourced directly from Japan. No aftermarket compromises.' },
    { img: iconDirectImport, title: 'Direct Import', text: 'Cutting out the middleman ensures you get the best market pricing.' },
    { img: iconChassi, title: 'Chassis Verification', text: 'Guaranteed fitment when you provide your chassis number.' },
    { img: iconDelivery, title: 'Fast Delivery', text: 'Island-wide expedited shipping and convenient warehouse pickup.' },
];

const TESTIMONIALS = [
    { name: 'Nuwan Perera', loc: 'Colombo', text: 'Got the exact brake pads for my Honda Vezel. Arrived in 2 days and fitment was perfect. Will definitely order again.' },
    { name: 'Dilshan Fernando', loc: 'Kandy', text: 'Their chassis inquiry system saved me from buying the wrong part. The team responded within hours — incredible service.' },
    { name: 'Sajith Wickramasinghe', loc: 'Galle', text: 'Best prices for Japanese spare parts in Sri Lanka. Ordered online at midnight, shipped next morning. Highly recommend!' },
];

const LEADERSHIP = [
    { img: ceoPic, name: 'Mahinda Senavirathna', role: 'Chief Executive Officer', quote: 'Delivering excellence in automotive solutions since 2009 with an unwavering commitment to quality.' },
    { img: directorPic, name: 'Geethika Amarakoon', role: 'Director', quote: 'Building lasting customer relationships through trust, transparency, and genuine service.' },
];

/* ── Utility Functions ───────────────────────────────────────────────────────── */
const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;

/* ── Reusable Components ─────────────────────────────────────────────────────── */

const Counter = memo(({ to, suffix = '' }) => {
    const [val, setVal] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            obs.disconnect();
            let start = 0;
            const dur = 1600;

            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / dur, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setVal(Math.floor(eased * to));
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }, { threshold: 0.5 });

        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [to]);

    return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
});

const ImageWithFallback = memo(({ src, alt, fallbackIcon, containerStyle, imgStyle }) => {
    const [hasError, setHasError] = useState(false);

    if (hasError || !src) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.background, color: THEME.textMuted, ...containerStyle }}>
                <span style={{ fontSize: containerStyle.height === 188 ? '3rem' : '1.5rem' }}>{fallbackIcon}</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            style={imgStyle}
            onError={() => setHasError(true)}
        />
    );
});

const SkeletonGrid = ({ count, minWidth, height }) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth},1fr))`, gap: '1.5rem' }}>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ height, borderRadius: 12, backgroundColor: '#E2E8F0', animation: 'pulse 1.5s infinite ease-in-out' }} />
        ))}
    </div>
);

const VehicleCard = memo(({ v }) => (
    <Link to={`/vehicles/${v._id}`} style={styles.cardLink}>
        <div style={styles.vehicleCard}>
            <div style={styles.vehicleImageContainer}>
                <ImageWithFallback
                    src={v.images?.[0] ? imageUrl(v.images[0]) : null}
                    alt={v.title}
                    fallbackIcon="🚗"
                    containerStyle={{ width: '100%', height: '100%' }}
                    imgStyle={styles.vehicleImage}
                />
                <div style={styles.vehicleBadge}>
                    {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                </div>
            </div>

            <div style={styles.vehicleContent}>
                <h3 style={styles.vehicleTitle}>{v.title}</h3>
                <div style={styles.vehicleSpecs}>
                    {v.year} • {v.transmission} • {v.fuelType}
                </div>
                <div style={styles.vehicleFooter}>
                    <div style={styles.vehiclePrice}>{fmtPrice(v.price)}</div>
                    <div style={styles.viewDetailsText}>View Details</div>
                </div>
            </div>
        </div>
    </Link>
));

const PartCard = memo(({ p }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        let timer;
        if (added) timer = setTimeout(() => setAdded(false), 2000);
        return () => clearTimeout(timer);
    }, [added]);

    const handleAdd = (e) => {
        e.preventDefault();
        addToCart(p, 1);
        setAdded(true);
    };

    return (
        <Link to={`/spareparts/${p._id}`} style={styles.cardLink}>
            <div style={styles.partCard}>
                <div style={styles.partImageWrapper}>
                    <ImageWithFallback
                        src={p.image ? imageUrl(p.image) : null}
                        alt={p.partName}
                        fallbackIcon="🔧"
                        containerStyle={{ width: '100%', height: '100%' }}
                        imgStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div style={styles.partInfo}>
                    <div style={styles.partTitle}>{p.partName}</div>
                    <div style={styles.partBrand}>{p.brand}</div>
                </div>
                <div style={styles.partAction}>
                    <div style={styles.partPrice}>{fmtPrice(p.price)}</div>
                    <button
                        onClick={handleAdd}
                        style={{
                            ...styles.cartBtn,
                            backgroundColor: added ? THEME.success : THEME.surface,
                            color: added ? '#fff' : THEME.primary,
                            borderColor: added ? THEME.success : THEME.primary,
                        }}
                    >
                        {added ? '✓ Added' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </Link>
    );
});

/* ── Main Page Component ─────────────────────────────────────────────────────── */

const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                const [vRes, pRes] = await Promise.all([getVehicles(), getSpareParts()]);
                setVehicles(vRes.data?.vehicles?.slice(0, 6) || []);
                setParts(pRes.data?.spareParts?.slice(0, 6) || []);
            } catch (err) {
                console.error('Error fetching landing page data:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // Auto-advance slideshow every 4 s
    useEffect(() => {
        const t = setInterval(() => setSlideIndex(i => (i + 1) % HERO_SLIDES.length), 4000);
        return () => clearInterval(t);
    }, []);

    return (
        <div style={{ backgroundColor: THEME.background, color: THEME.textMain, fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* HERO SECTION - Split Clean Layout */}
            <section style={styles.heroSection}>
                <div style={styles.heroContainer}>
                    <div style={styles.heroTextContent}>
                        <div style={styles.heroTag}>
                            <span style={styles.heroTagDot} />
                            Premium Japanese Imports
                        </div>
                        <h1 style={styles.heroHeading}>
                            Drive Excellence.<br />
                            <span style={{ color: THEME.primary }}>Experience Japan.</span>
                        </h1>
                        <p style={styles.heroSubtext}>
                            Sri Lanka's trusted dealership for certified Japanese vehicles and genuine OEM spare parts. Direct imports. Transparent pricing.
                        </p>
                        <div style={styles.heroActions}>
                            <Link to="/vehicles" style={styles.btnPrimary}>
                                View Showroom
                            </Link>
                            <Link to="/inquiry" style={styles.btnSecondary}>
                                Parts Inquiry
                            </Link>
                        </div>

                        <div style={styles.statsRow}>
                            {STATS_DATA.map(({ to, suffix, label }) => (
                                <div key={label} style={styles.statBlock}>
                                    <div style={styles.statNumber}>
                                        <Counter to={to} suffix={suffix} />
                                    </div>
                                    <div style={styles.statLabel}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={styles.heroImageWrapper}>
                        {HERO_SLIDES.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`Shan Auto Lanka slide ${i + 1}`}
                                style={{
                                    ...styles.heroSlide,
                                    opacity: i === slideIndex ? 1 : 0,
                                }}
                            />
                        ))}
                        <div style={styles.imageOverlay} />
                        {/* Dot indicators */}
                        <div style={styles.slideDots}>
                            {HERO_SLIDES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSlideIndex(i)}
                                    style={{
                                        ...styles.slideDot,
                                        background: i === slideIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                                        transform: i === slideIndex ? 'scale(1.2)' : 'scale(1)',
                                    }}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BAR */}
            <section style={styles.trustBar}>
                <div style={styles.trustContainer}>
                    {TRUST_FEATURES.map(({ icon, text }) => (
                        <div key={text} style={styles.trustItem}>
                            <span style={{ fontSize: '1.25rem' }}>{icon}</span> {text}
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURED VEHICLES */}
            <section style={styles.sectionLight}>
                <div style={styles.container}>
                    <div style={styles.sectionHeader}>
                        <div>
                            <div style={styles.sectionTag}>Latest Arrivals</div>
                            <h2 style={styles.sectionTitle}>Featured Vehicles</h2>
                        </div>
                        <Link to="/vehicles" style={styles.btnOutline}>View Inventory</Link>
                    </div>

                    {error && <p style={{ color: THEME.primary }}>Unable to load vehicles. Please refresh.</p>}

                    {loading ? (
                        <SkeletonGrid count={6} minWidth="300px" height={320} />
                    ) : (
                        <div style={styles.gridVehicles}>
                            {vehicles.map((v) => <VehicleCard key={v._id} v={v} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* QUICK PARTS */}
            <section style={styles.sectionGray}>
                <div style={styles.container}>
                    <div style={styles.sectionHeader}>
                        <div>
                            <div style={styles.sectionTag}>Genuine Spares</div>
                            <h2 style={styles.sectionTitle}>Popular Parts</h2>
                        </div>
                        <Link to="/spareparts" style={styles.btnOutline}>Browse Catalog</Link>
                    </div>

                    {error && <p style={{ color: THEME.primary }}>Unable to load parts.</p>}

                    {loading ? (
                        <SkeletonGrid count={6} minWidth="340px" height={100} />
                    ) : (
                        <div style={styles.gridParts}>
                            {parts.map((p) => <PartCard key={p._id} p={p} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* WHY US */}
            <section style={styles.sectionLight}>
                <div style={styles.container}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ ...styles.sectionTag, justifyContent: 'center' }}>The Shan Auto Advantage</div>
                        <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>Built on Trust. Sourced with Precision.</h2>
                    </div>
                    <div style={styles.gridFeatures}>
                        {WHY_US_FEATURES.map(({ img, title, text }) => (
                            <div key={title} style={styles.featureCard}>
                                <div style={styles.featureIcon}>
                                    <img src={img} alt={title} style={{ width: 150, height: 150, objectFit: 'contain', display: 'block' }} />
                                </div>
                                <h3 style={styles.featureTitle}>{title}</h3>
                                <p style={styles.featureText}>{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={styles.sectionGray}>
                <div style={styles.container}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ ...styles.sectionTag, justifyContent: 'center' }}>Client Success</div>
                        <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>What Our Customers Say</h2>
                    </div>
                    <div style={styles.gridTestimonials}>
                        {TESTIMONIALS.map(({ name, loc, text }) => (
                            <div key={name} style={styles.testimonialCard}>
                                <div style={{ color: '#F59E0B', fontSize: '1.2rem', marginBottom: '1rem' }}>★★★★★</div>
                                <p style={styles.testimonialText}>"{text}"</p>
                                <div style={styles.testimonialAuthor}>
                                    <div style={styles.avatar}>{name[0]}</div>
                                    <div>
                                        <div style={styles.authorName}>{name}</div>
                                        <div style={styles.authorLoc}>{loc}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LEADERSHIP */}
            <section style={styles.sectionLight}>
                <div style={styles.container}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ ...styles.sectionTag, justifyContent: 'center' }}>Leadership</div>
                        <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>Meet the Directors</h2>
                    </div>
                    <div style={styles.gridLeadership}>
                        {LEADERSHIP.map(({ img, name, role, quote }) => (
                            <div key={name} style={styles.leaderCard}>
                                <div style={styles.leaderImgWrapper}>
                                    <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3 style={styles.leaderName}>{name}</h3>
                                <div style={styles.leaderRole}>{role}</div>
                                <p style={styles.leaderQuote}>"{quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section style={{ padding: '0 1.5rem 4rem', backgroundColor: THEME.surface }}>
                <div style={styles.ctaContainer}>
                    <div style={styles.ctaContent}>
                        <h2 style={styles.ctaTitle}>Need a specific part? Let us find it.</h2>
                        <p style={styles.ctaText}>
                            Submit your chassis number and our experts will confirm part compatibility directly with our Japanese suppliers.
                        </p>
                        <Link to="/inquiry" style={{ ...styles.btnPrimary, backgroundColor: THEME.surface, color: THEME.secondary, border: 'none' }}>
                            Submit Chassis Inquiry
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <div style={styles.container}>
                    <div style={styles.footerGrid}>
                        <div>
                            <div style={styles.footerLogo}>
                                <img src={shanLogo} alt="Shan Auto Lanka" style={{ height: 72, width: 'auto', objectFit: 'contain', display: 'block' }} />
                            </div>
                            <p style={styles.footerDesc}>Sri Lanka's premier importer of certified Japanese vehicles and genuine OEM automotive parts.</p>
                        </div>
                        <div>
                            <div style={styles.footerHeading}>Showroom</div>
                            <Link to="/vehicles" style={styles.footerLink}>Browse Vehicles</Link>
                            <Link to="/spareparts" style={styles.footerLink}>Spare Parts Catalog</Link>
                        </div>
                        <div>
                            <div style={styles.footerHeading}>Services</div>
                            <Link to="/inquiry" style={styles.footerLink}>Chassis Inquiry</Link>
                            <Link to="/login" style={styles.footerLink}>Client Portal</Link>
                        </div>
                        <div>
                            <div style={styles.footerHeading}>🇯🇵 Japan Office and Showroom</div>
                            <p style={styles.footerText}>📍 289-1212, Chiba-ken, Sanmu-shi,<br />Kibara 1299-1</p>
                            <p style={styles.footerText}>📞 080-1210-9473</p>
                            <p style={styles.footerText}>✉️ shanautolanka@gmail.com</p>
                        </div>
                        <div>
                            <div style={styles.footerHeading}>🇱🇰 Sri Lanka Office and Warehouse</div>
                            <p style={styles.footerText}>📍 No 95 Marukona, Ukuwela</p>
                            <p style={styles.footerText}>📞 072 400 0654</p>
                            <p style={styles.footerText}>✉️ shanautolanka@gmail.com</p>
                        </div>
                    </div>
                    <div style={styles.footerBottom}>
                        <p>© {new Date().getFullYear()} Shan Auto Lanka (Pvt) Ltd. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

/* ── Inline Styles (Clean Light Theme) ─────────────────────────────────────────── */
const styles = {
    heroSection: { paddingTop: '80px', backgroundColor: THEME.surface, minHeight: '90vh', display: 'flex', alignItems: 'center' },
    heroContainer: { maxWidth: 1280, margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem', width: '100%' },
    heroTextContent: { flex: '1 1 500px', zIndex: 2 },
    heroTag: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', backgroundColor: '#FEE2E2', color: THEME.primary, borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' },
    heroTagDot: { width: 6, height: 6, backgroundColor: THEME.primary, borderRadius: '50%' },
    heroHeading: { fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, color: THEME.secondary, marginBottom: '1.5rem', letterSpacing: '-0.02em' },
    heroSubtext: { fontSize: '1.1rem', color: THEME.textMuted, lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '480px' },
    heroActions: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' },
    btnPrimary: { display: 'inline-block', backgroundColor: THEME.primary, color: '#fff', padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s', border: `1px solid ${THEME.primary}` },
    btnSecondary: { display: 'inline-block', backgroundColor: 'transparent', color: THEME.secondary, padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', border: `1px solid ${THEME.border}` },
    statsRow: { display: 'flex', gap: '2.5rem', flexWrap: 'wrap', borderTop: `1px solid ${THEME.border}`, paddingTop: '2rem' },
    statBlock: { display: 'flex', flexDirection: 'column' },
    statNumber: { fontSize: '2rem', fontWeight: 800, color: THEME.secondary, marginBottom: '0.2rem' },
    statLabel: { fontSize: '0.85rem', color: THEME.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
    heroImageWrapper: { flex: '1 1 500px', position: 'relative', height: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' },
    heroSlide: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'opacity 0.9s ease-in-out' },
    imageOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,0.35) 0%, transparent 60%)', zIndex: 1, pointerEvents: 'none' },
    slideDots: { position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 2 },
    slideDot: { width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' },

    trustBar: { backgroundColor: THEME.secondary, color: '#fff', padding: '1.5rem 0' },
    trustContainer: { maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3rem' },
    trustItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 500 },

    sectionLight: { padding: '6rem 0', backgroundColor: THEME.surface },
    sectionGray: { padding: '6rem 0', backgroundColor: THEME.background },
    container: { maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' },
    sectionTag: { color: THEME.primary, fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex' },
    sectionTitle: { fontSize: '2.5rem', fontWeight: 800, color: THEME.secondary, letterSpacing: '-0.02em', margin: 0 },
    btnOutline: { display: 'inline-block', padding: '0.6rem 1.5rem', borderRadius: '6px', border: `1px solid ${THEME.border}`, color: THEME.secondary, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', backgroundColor: THEME.surface },

    cardLink: { textDecoration: 'none', color: 'inherit', display: 'block' },

    gridVehicles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' },
    vehicleCard: { backgroundColor: THEME.surface, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${THEME.border}`, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', height: '100%' },
    vehicleImageContainer: { height: '220px', position: 'relative', overflow: 'hidden', backgroundColor: THEME.background },
    vehicleImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
    vehicleBadge: { position: 'absolute', top: '12px', right: '12px', backgroundColor: THEME.success, color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 },
    vehicleContent: { padding: '1.5rem' },
    vehicleTitle: { fontSize: '1.1rem', fontWeight: 700, color: THEME.secondary, marginBottom: '0.5rem' },
    vehicleSpecs: { fontSize: '0.85rem', color: THEME.textMuted, marginBottom: '1.5rem' },
    vehicleFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${THEME.border}`, paddingTop: '1rem' },
    vehiclePrice: { fontSize: '1.25rem', fontWeight: 800, color: THEME.primary },
    viewDetailsText: { fontSize: '0.85rem', fontWeight: 600, color: THEME.secondary },

    gridParts: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' },
    partCard: { display: 'flex', alignItems: 'center', padding: '1.2rem', backgroundColor: THEME.surface, borderRadius: '12px', border: `1px solid ${THEME.border}`, transition: 'box-shadow 0.2s', gap: '1rem' },
    partImageWrapper: { width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', backgroundColor: THEME.background, flexShrink: 0 },
    partInfo: { flex: 1, minWidth: 0 },
    partTitle: { fontWeight: 700, color: THEME.secondary, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    partBrand: { fontSize: '0.8rem', color: THEME.textMuted },
    partAction: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' },
    partPrice: { fontWeight: 800, color: THEME.secondary },
    cartBtn: { fontSize: '0.75rem', fontWeight: 600, padding: '0.4rem 0.8rem', borderRadius: '6px', border: `1px solid ${THEME.primary}`, cursor: 'pointer', transition: 'all 0.2s' },

    gridFeatures: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' },
    featureCard: { padding: '2rem', backgroundColor: THEME.background, borderRadius: '12px', border: `1px solid ${THEME.border}` },
    featureIcon: { width: 150, height: 150, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    featureTitle: { fontSize: '1.1rem', fontWeight: 700, color: THEME.secondary, marginBottom: '0.75rem' },
    featureText: { fontSize: '0.9rem', color: THEME.textMuted, lineHeight: 1.6 },

    gridTestimonials: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
    testimonialCard: { padding: '2.5rem', backgroundColor: THEME.surface, borderRadius: '12px', border: `1px solid ${THEME.border}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
    testimonialText: { fontSize: '1rem', color: THEME.secondary, lineHeight: 1.7, fontStyle: 'italic', marginBottom: '2rem' },
    testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '1rem' },
    avatar: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: THEME.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' },
    authorName: { fontWeight: 700, color: THEME.secondary, fontSize: '0.95rem' },
    authorLoc: { fontSize: '0.8rem', color: THEME.textMuted },

    gridLeadership: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', justifyContent: 'center' },
    leaderCard: { textAlign: 'center', maxWidth: '340px', margin: '0 auto' },
    leaderImgWrapper: { width: '180px', height: '180px', borderRadius: '50%', margin: '0 auto 1.5rem', overflow: 'hidden', border: `4px solid ${THEME.background}`, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' },
    leaderName: { fontSize: '1.25rem', fontWeight: 800, color: THEME.secondary, marginBottom: '0.2rem' },
    leaderRole: { color: THEME.primary, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' },
    leaderQuote: { color: THEME.textMuted, fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic' },

    ctaContainer: { maxWidth: 1280, margin: '0 auto' },
    ctaContent: { backgroundColor: THEME.secondary, borderRadius: '24px', padding: '5rem 2rem', textAlign: 'center', color: '#fff' },
    ctaTitle: { fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' },
    ctaText: { fontSize: '1.1rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 },

    footer: { backgroundColor: THEME.secondary, color: '#fff', paddingTop: '5rem' },
    footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' },
    footerLogo: { marginBottom: '1rem', background: '#fff', display: 'inline-block', borderRadius: 10, padding: '6px 14px' },
    footerDesc: { color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 },
    footerHeading: { fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    footerLink: { display: 'block', color: '#94A3B8', textDecoration: 'none', marginBottom: '0.75rem', fontSize: '0.9rem', transition: 'color 0.2s' },
    footerText: { color: '#94A3B8', fontSize: '0.9rem', marginBottom: '0.75rem' },
    footerBottom: { borderTop: '1px solid rgba(255,255,255,0.1)', padding: '2rem 0', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }
};

// Add global hover effects via simple style injection since React inline styles lack pseudo-classes
const hoverStyles = `
    a, button { cursor: pointer; }
    div[style*="vehicleCard"]:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important; }
    div[style*="partCard"]:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1) !important; border-color: ${THEME.primary} !important; }
    a[style*="btnPrimary"]:hover { background-color: #B91C1C !important; }
    a[style*="btnOutline"]:hover { border-color: ${THEME.secondary} !important; background-color: ${THEME.background} !important; }
    a[style*="footerLink"]:hover { color: #fff !important; }
`;

export default function AppHome() {
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: hoverStyles }} />
            <Home />
        </>
    );
}