// components/Chatbot.jsx – Shan Auto Lanka floating chatbot
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Tutorial steps ──────────────────────────────────────────────── */
const TUTORIAL_STEPS = [
    {
        msg: '👋 Welcome to **Shan Auto Lanka**! I\'m your assistant. Let me walk you through the website.',
        delay: 0,
    },
    {
        msg: '🏠 **Home Page** – You\'re here now! Browse our featured vehicles, popular spare parts, and learn about our services.',
        delay: 1200,
    },
    {
        msg: '🚗 **Vehicles** – Click "Browse Vehicles" or the top menu to explore our full inventory of certified Japanese cars. Filter by brand, fuel type, transmission, location, and price.',
        delay: 2600,
    },
    {
        msg: '🔧 **Spare Parts** – Need a genuine OEM part? Click "Spare Parts" in the menu. You can search by part name, brand, or chassis number.',
        delay: 4200,
    },
    {
        msg: '🛒 **Cart & Checkout** – Add spare parts to your cart and checkout. Your order will be processed and delivered island-wide.',
        delay: 5800,
    },
    {
        msg: '📩 **Inquiry Form** – Not sure if a part fits your vehicle? Submit a chassis inquiry and our team will confirm compatibility within hours.',
        delay: 7400,
    },
    {
        msg: '👤 **Account** – Register or log in to track your orders, view past inquiries, and manage your profile.',
        delay: 9000,
    },
    {
        msg: '✅ That\'s the full tour! Ask me anything — I\'m here to help. Try typing "contact", "vehicles", "parts", or "delivery".',
        delay: 10600,
    },
];

/* ── Q&A knowledge base ──────────────────────────────────────────── */
const QA = [
    {
        keys: ['hello', 'hi', 'hey', 'hola', 'ayubowan'],
        reply: '👋 Hello! How can I help you today? You can ask about vehicles, spare parts, delivery, contact details, or type **"tour"** to get a full website walkthrough.',
    },
    {
        keys: ['tour', 'tutorial', 'guide', 'help', 'how', 'start'],
        reply: '__TOUR__',
    },
    {
        keys: ['vehicle', 'car', 'cars', 'auto', 'automobile', 'inventory', 'showroom'],
        reply: '🚗 We stock a wide range of certified Japanese vehicles — Toyota, Honda, Nissan, Suzuki, and more. Visit our **Vehicles** page to filter by brand, fuel type, transmission, and price. Each listing shows the vehicle\'s location (Showroom / Warehouse / Auction).',
        link: '/vehicles',
        linkText: 'Browse Vehicles →',
    },
    {
        keys: ['spare', 'part', 'parts', 'oem', 'genuine', 'component'],
        reply: '🔧 We supply genuine OEM spare parts sourced directly from Japan. Browse by part name, brand, or chassis number. Add to cart and checkout for island-wide delivery.',
        link: '/spareparts',
        linkText: 'Browse Spare Parts →',
    },
    {
        keys: ['chassis', 'compatible', 'compatibility', 'fitment', 'fit', 'inquiry', 'enquiry'],
        reply: '📋 Not sure if a part fits your vehicle? Submit a **chassis inquiry** — provide your chassis number and we\'ll confirm compatibility directly with our Japanese suppliers, usually within hours.',
        link: '/inquiry',
        linkText: 'Submit Inquiry →',
    },
    {
        keys: ['cart', 'checkout', 'order', 'buy', 'purchase'],
        reply: '🛒 You can add spare parts to your cart directly from any product listing. When you\'re ready, go to **Cart → Checkout** to complete your order. You\'ll need to be logged in to place an order.',
        link: '/cart',
        linkText: 'Go to Cart →',
    },
    {
        keys: ['delivery', 'shipping', 'ship', 'courier', 'island'],
        reply: '🚚 We offer **island-wide delivery** across Sri Lanka. You can also collect from our Ukuwela warehouse. Delivery times vary by location — typically 1–3 business days.',
    },
    {
        keys: ['price', 'cost', 'expensive', 'cheap', 'affordable', 'pricing'],
        reply: '💰 Our prices are competitive because we import directly from Japan — no middlemen. Vehicle prices and part prices are listed on each product page. We also show a full tax breakdown on vehicle detail pages.',
    },
    {
        keys: ['contact', 'address', 'phone', 'call', 'email', 'reach', 'location', 'office'],
        reply: '📞 **Japan Office:** 289-1212, Chiba-ken, Sanmu-shi, Kibara 1299-1 | ☎ 080-1210-9473\n\n📞 **Sri Lanka Office:** No 95 Marukona, Ukuwela | ☎ 072 400 0654\n\n✉ shanautolanka@gmail.com',
    },
    {
        keys: ['japan', 'japanese', 'import', 'direct'],
        reply: '🇯🇵 All our vehicles and spare parts are sourced directly from Japan through our Japan office in Chiba-ken. This means no middlemen, better prices, and guaranteed genuine stock.',
    },
    {
        keys: ['register', 'signup', 'sign up', 'account', 'login', 'log in'],
        reply: '👤 Create a free account to track your orders, view your inquiry history, and manage your profile. Registration takes less than a minute!',
        link: '/register',
        linkText: 'Register Now →',
    },
    {
        keys: ['open', 'hours', 'working', 'time', 'available', 'business'],
        reply: '🕐 Our Sri Lanka office is open **Monday – Saturday, 8:30 AM – 6:00 PM**. You can browse and order online 24/7. For urgent queries, WhatsApp us at 072 400 0654.',
    },
    {
        keys: ['warranty', 'guarantee', 'return', 'refund'],
        reply: '🛡️ All parts come with a manufacturer warranty. If you receive a wrong or defective part, contact us within 7 days for a replacement. Vehicle guarantees are discussed at the time of purchase.',
    },
    {
        keys: ['payment', 'pay', 'cash', 'card', 'bank', 'transfer'],
        reply: '💳 We accept bank transfers and cash on delivery for spare parts. Vehicle purchases can be arranged with installment plans — please contact us for details.',
    },
    {
        keys: ['thank', 'thanks', 'bye', 'goodbye', 'good'],
        reply: '🙏 Thank you for visiting Shan Auto Lanka! Feel free to ask anything else. Drive safe! 🚗',
    },
];

/* ── Helper: parse basic markdown bold ──────────────────────────── */
const parseMarkdown = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
        p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p
    );
};

const getBotReply = (input) => {
    const lower = input.toLowerCase();
    for (const qa of QA) {
        if (qa.keys.some(k => lower.includes(k))) return qa;
    }
    return {
        reply: '🤔 I\'m not sure about that. Try asking about **vehicles**, **spare parts**, **delivery**, **contact**, or type **"tour"** for a website guide.',
    };
};

/* ── Main Component ────────────────────────────────────────────────── */
const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            from: 'bot',
            text: '👋 Hi! I\'m the Shan Auto Lanka assistant. Ask me anything or type **"tour"** for a website walkthrough!',
        },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [tourActive, setTourActive] = useState(false);
    const [unread, setUnread] = useState(0);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    useEffect(() => {
        if (open) {
            setUnread(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const addBotMsg = (text, link, linkText) => {
        setMessages(prev => [...prev, { from: 'bot', text, link, linkText }]);
        if (!open) setUnread(u => u + 1);
    };

    const startTour = () => {
        if (tourActive) return;
        setTourActive(true);
        TUTORIAL_STEPS.forEach(({ msg, delay }) => {
            setTimeout(() => {
                setTyping(true);
                setTimeout(() => {
                    setTyping(false);
                    addBotMsg(msg);
                    if (delay === TUTORIAL_STEPS[TUTORIAL_STEPS.length - 1].delay) {
                        setTourActive(false);
                    }
                }, 800);
            }, delay);
        });
    };

    const sendMessage = () => {
        const text = input.trim();
        if (!text) return;
        setMessages(prev => [...prev, { from: 'user', text }]);
        setInput('');

        const qa = getBotReply(text);
        if (qa.reply === '__TOUR__') {
            setTimeout(() => {
                addBotMsg('🗺️ Starting the website tour! I\'ll walk you through everything step by step...');
                startTour();
            }, 400);
        } else {
            setTyping(true);
            setTimeout(() => {
                setTyping(false);
                addBotMsg(qa.reply, qa.link, qa.linkText);
            }, 700 + Math.random() * 400);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const quickOptions = ['Website Tour 🗺️', 'Vehicles 🚗', 'Spare Parts 🔧', 'Contact 📞'];

    const handleQuick = (opt) => {
        const text = opt.replace(/[^\w\s]/g, '').trim();
        setMessages(prev => [...prev, { from: 'user', text: opt }]);
        const qa = getBotReply(text);
        if (qa.reply === '__TOUR__') {
            setTimeout(() => {
                addBotMsg('🗺️ Starting the website tour!');
                startTour();
            }, 400);
        } else {
            setTyping(true);
            setTimeout(() => {
                setTyping(false);
                addBotMsg(qa.reply, qa.link, qa.linkText);
            }, 700);
        }
    };

    return (
        <>
            {/* ── Floating Toggle Button ─────────────────────────── */}
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
                    width: 58, height: 58, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                    boxShadow: '0 4px 20px rgba(211,47,47,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(211,47,47,0.65)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(211,47,47,0.5)'; }}
                aria-label="Open chat assistant"
            >
                {open ? '✕' : '💬'}
                {!open && unread > 0 && (
                    <span style={{
                        position: 'absolute', top: 2, right: 2, background: '#16A34A', color: '#fff',
                        borderRadius: '50%', width: 18, height: 18, fontSize: '0.65rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff',
                    }}>{unread}</span>
                )}
            </button>

            {/* ── Chat Window ────────────────────────────────────── */}
            {open && (
                <div style={{
                    position: 'fixed', bottom: 100, right: 28, zIndex: 9998,
                    width: 360, maxWidth: 'calc(100vw - 40px)',
                    height: 520, maxHeight: 'calc(100vh - 140px)',
                    background: '#fff', borderRadius: 20,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    animation: 'chatSlideIn 0.3s cubic-bezier(0.22,1,0.36,1)',
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
                        padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                        }}>🤖</div>
                        <div>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Shan Auto Assistant</div>
                            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                                Online · Ready to help
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#F8FAFC' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    maxWidth: '82%',
                                    background: msg.from === 'user' ? 'linear-gradient(135deg,#D32F2F,#B71C1C)' : '#fff',
                                    color: msg.from === 'user' ? '#fff' : '#1E293B',
                                    borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    padding: '0.65rem 0.9rem',
                                    fontSize: '0.875rem', lineHeight: 1.55,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {parseMarkdown(msg.text)}
                                    {msg.link && (
                                        <div style={{ marginTop: '0.6rem' }}>
                                            <a
                                                href={msg.link}
                                                onClick={(e) => { e.preventDefault(); navigate(msg.link); setOpen(false); }}
                                                style={{
                                                    display: 'inline-block', background: '#D32F2F', color: '#fff',
                                                    padding: '0.3rem 0.75rem', borderRadius: 6, fontSize: '0.78rem',
                                                    fontWeight: 600, textDecoration: 'none',
                                                }}
                                            >
                                                {msg.linkText}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {typing && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 0.75rem', background: '#fff', borderRadius: '16px 16px 16px 4px', width: 'fit-content', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                {[0, 0.2, 0.4].map((d, i) => (
                                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#CBD5E1', display: 'inline-block', animation: `typingDot 1s ${d}s infinite` }} />
                                ))}
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick Options */}
                    <div style={{ padding: '0.5rem 0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', background: '#fff', borderTop: '1px solid #E2E8F0' }}>
                        {quickOptions.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleQuick(opt)}
                                style={{
                                    background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 20,
                                    padding: '0.3rem 0.7rem', fontSize: '0.72rem', fontWeight: 600,
                                    cursor: 'pointer', color: '#475569', transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.borderColor = '#D32F2F'; e.currentTarget.style.color = '#D32F2F'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{ padding: '0.75rem', background: '#fff', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.5rem' }}>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Type a message..."
                            style={{
                                flex: 1, border: '1px solid #E2E8F0', borderRadius: 10,
                                padding: '0.6rem 0.85rem', fontSize: '0.875rem', outline: 'none',
                                background: '#F8FAFC', color: '#1E293B',
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim()}
                            style={{
                                background: input.trim() ? 'linear-gradient(135deg,#D32F2F,#B71C1C)' : '#E2E8F0',
                                border: 'none', borderRadius: 10, width: 40, height: 40,
                                cursor: input.trim() ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', flexShrink: 0, transition: 'background 0.2s',
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* ── CSS Animations ──────────────────────────────────── */}
            <style>{`
                @keyframes chatSlideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30%           { transform: translateY(-5px); opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default Chatbot;
