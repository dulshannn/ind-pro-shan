// components/Spinner.jsx – Premium loading spinner
const Spinner = ({ size = 38, text = 'Loading…' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.1rem', padding: '3.5rem 2rem' }}>
        <div style={{ position: 'relative', width: size, height: size }}>
            {/* Outer ring */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(232,56,79,0.12)' }} />
            {/* Spinning arc */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#e8384f', borderRightColor: 'rgba(232,56,79,0.4)', animation: 'spin-slow 0.75s linear infinite' }} />
            {/* Inner dot */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 6, height: 6, borderRadius: '50%', background: '#e8384f', boxShadow: '0 0 8px rgba(232,56,79,0.8)' }} />
        </div>
        {text && <p style={{ color: 'var(--muted)', fontSize: '0.82rem', letterSpacing: '0.04em', fontWeight: 500 }}>{text}</p>}
        <style>{`@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
);

export default Spinner;
