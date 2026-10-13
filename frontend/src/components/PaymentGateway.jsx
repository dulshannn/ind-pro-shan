// components/PaymentGateway.jsx – Demo payment modal
import { useState, useEffect } from 'react';

const fmtPrice = (p) => `Rs. ${Number(p).toLocaleString('en-LK')}`;

// Test cards (demo only)
const TEST_SUCCESS = '4242424242424242';
const TEST_DECLINE = ['4000000000000002', '4000000000009995'];

const detectCard = (num) => {
    const n = num.replace(/\s/g, '');
    if (/^4/.test(n)) return { type: 'Visa', icon: '💳', color: '#1a1f71' };
    if (/^5[1-5]/.test(n)) return { type: 'Mastercard', icon: '🔴🟡', color: '#eb001b' };
    if (/^3[47]/.test(n)) return { type: 'Amex', icon: '🔵', color: '#007bc1' };
    return { type: '', icon: '💳', color: '#64748b' };
};

const formatCardNum = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
};

/* ── Card Visual ──────────────────────────────────────────────────── */
const CardVisual = ({ number, name, expiry, flipped }) => {
    const card = detectCard(number);
    const displayNum = number || '•••• •••• •••• ••••';

    return (
        <div style={{ perspective: '1000px', width: '100%', height: 180, marginBottom: '1.5rem' }}>
            <div style={{
                position: 'relative', width: '100%', height: '100%',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.5s ease',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
                {/* Front */}
                <div style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    borderRadius: 16, padding: '1.4rem 1.5rem',
                    background: `linear-gradient(135deg, ${card.color || '#1e293b'} 0%, #0f172a 100%)`,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ width: 44, height: 32, background: 'linear-gradient(135deg,#f6d365,#fda085)', borderRadius: 6, opacity: 0.9 }} />
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>{card.type || 'CARD'}</span>
                    </div>
                    <div style={{ color: '#fff', fontFamily: 'monospace', fontSize: '1.25rem', letterSpacing: '0.15em', fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                        {displayNum.padEnd(19, ' ')}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Card Holder</div>
                            <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {name || 'YOUR NAME'}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Expires</div>
                            <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>{expiry || 'MM/YY'}</div>
                        </div>
                    </div>
                </div>

                {/* Back */}
                <div style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    borderRadius: 16, overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                    transform: 'rotateY(180deg)',
                }}>
                    <div style={{ height: 48, background: '#334155', marginTop: 28 }} />
                    <div style={{ padding: '0.5rem 1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                        <div style={{ flex: 1, height: 36, background: '#f0f0f0', borderRadius: 4 }} />
                        <div style={{ background: '#fff', borderRadius: 4, padding: '0.4rem 0.75rem', fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', minWidth: 60, textAlign: 'center' }}>
                            CVV
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Main Modal ──────────────────────────────────────────────────── */
const PaymentGateway = ({ amount, onSuccess, onCancel }) => {
    const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [flipped, setFlipped] = useState(false);
    const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success' | 'declined'
    const [error, setError] = useState('');

    const set = (k, v) => setCard(p => ({ ...p, [k]: v }));

    const validate = () => {
        const digits = card.number.replace(/\s/g, '');
        if (digits.length < 16) return 'Please enter a valid 16-digit card number.';
        if (!card.name.trim()) return 'Please enter the cardholder name.';
        const [m, y] = card.expiry.split('/');
        if (!m || !y || +m < 1 || +m > 12) return 'Please enter a valid expiry date (MM/YY).';
        if (card.cvv.length < 3) return 'CVV must be at least 3 digits.';
        return '';
    };

    const handlePay = () => {
        const err = validate();
        if (err) { setError(err); return; }
        setError('');
        setStep('processing');

        const digits = card.number.replace(/\s/g, '');
        const willDecline = TEST_DECLINE.includes(digits) || (digits !== TEST_SUCCESS && Math.random() < 0.1);

        setTimeout(() => {
            if (willDecline) {
                setStep('declined');
            } else {
                setStep('success');
                setTimeout(() => onSuccess({ method: 'card', last4: digits.slice(-4) }), 1600);
            }
        }, 2800);
    };

    const inputStyle = {
        width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10, padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem',
        outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
            <div style={{
                background: '#0f1629', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24, padding: '2rem', width: '100%', maxWidth: 420,
                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                animation: 'pgSlideIn 0.35s cubic-bezier(0.22,1,0.36,1)',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Secure Payment</div>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem' }}>💳 Card Payment</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Amount Due</div>
                        <div style={{ color: '#e8384f', fontWeight: 800, fontSize: '1.2rem' }}>{fmtPrice(amount)}</div>
                    </div>
                </div>

                {/* ── FORM STATE ── */}
                {step === 'form' && (
                    <>
                        <CardVisual number={card.number} name={card.name} expiry={card.expiry} flipped={flipped} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {/* Card Number */}
                            <div>
                                <label style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Card Number</label>
                                <input
                                    style={inputStyle}
                                    placeholder="4242 4242 4242 4242"
                                    value={card.number}
                                    maxLength={19}
                                    onChange={e => set('number', formatCardNum(e.target.value))}
                                    onFocus={() => setFlipped(false)}
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <label style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Cardholder Name</label>
                                <input
                                    style={inputStyle}
                                    placeholder="Name on card"
                                    value={card.name}
                                    onChange={e => set('name', e.target.value.toUpperCase())}
                                    onFocus={() => setFlipped(false)}
                                />
                            </div>

                            {/* Expiry + CVV */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Expiry</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="MM/YY"
                                        value={card.expiry}
                                        maxLength={5}
                                        onChange={e => set('expiry', formatExpiry(e.target.value))}
                                        onFocus={() => setFlipped(false)}
                                    />
                                </div>
                                <div>
                                    <label style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>CVV</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="•••"
                                        value={card.cvv}
                                        maxLength={4}
                                        type="password"
                                        onChange={e => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        onFocus={() => setFlipped(true)}
                                        onBlur={() => setFlipped(false)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.6rem 0.85rem', color: '#ef4444', fontSize: '0.8rem' }}>
                                    ❌ {error}
                                </div>
                            )}

                            {/* Demo hint */}
                            <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 8, padding: '0.6rem 0.85rem', fontSize: '0.75rem', color: '#818cf8' }}>
                                🧪 <strong>Demo mode</strong> — Use card <strong>4242 4242 4242 4242</strong>, any future expiry &amp; any CVV to simulate a successful payment.
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                                <button onClick={onCancel} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.85rem', color: '#94a3b8', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                                    Cancel
                                </button>
                                <button onClick={handlePay} style={{ flex: 2, background: 'linear-gradient(135deg,#D32F2F,#B71C1C)', border: 'none', borderRadius: 10, padding: '0.85rem', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(211,47,47,0.4)' }}>
                                    🔒 Pay {fmtPrice(amount)}
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.7rem' }}>
                                🔒 256-bit SSL encrypted · Visa · Mastercard · Amex
                            </div>
                        </div>
                    </>
                )}

                {/* ── PROCESSING STATE ── */}
                {step === 'processing' && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Processing Payment...</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Please do not close this window</div>
                        <div style={{ marginTop: '1.5rem', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'linear-gradient(90deg,#D32F2F,#ef4444)', borderRadius: 99, animation: 'pgProgress 2.8s ease-in-out forwards' }} />
                        </div>
                    </div>
                )}

                {/* ── SUCCESS STATE ── */}
                {step === 'success' && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'pgPop 0.4s cubic-bezier(0.22,1,0.36,1)' }}>✅</div>
                        <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Payment Successful!</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Redirecting to your order confirmation...</div>
                    </div>
                )}

                {/* ── DECLINED STATE ── */}
                {step === 'declined' && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'pgPop 0.4s cubic-bezier(0.22,1,0.36,1)' }}>❌</div>
                        <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Payment Declined</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Your card was declined. Please check your card details and try again.</div>
                        <button onClick={() => { setStep('form'); setCard(c => ({ ...c, number: '', cvv: '' })); }}
                            style={{ background: 'linear-gradient(135deg,#D32F2F,#B71C1C)', border: 'none', borderRadius: 10, padding: '0.75rem 2rem', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                            Try Again
                        </button>
                    </div>
                )}

                <style>{`
                    @keyframes pgSlideIn {
                        from { opacity:0; transform:translateY(30px) scale(0.95); }
                        to   { opacity:1; transform:translateY(0) scale(1); }
                    }
                    @keyframes pgProgress {
                        from { width:0%; }
                        to   { width:100%; }
                    }
                    @keyframes pgPop {
                        from { transform:scale(0.5); opacity:0; }
                        to   { transform:scale(1); opacity:1; }
                    }
                    @keyframes spin {
                        from { transform:rotate(0deg); }
                        to   { transform:rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default PaymentGateway;
