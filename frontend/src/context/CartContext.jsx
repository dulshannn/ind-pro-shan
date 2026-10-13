// context/CartContext.jsx – Per-user cart state (localStorage keyed by userId)
import { createContext, useState, useEffect, useRef } from 'react';

export const CartContext = createContext();

const cartKey = (userId) => userId ? `shan_cart_${userId}` : null;

const loadCart = (userId) => {
    const key = cartKey(userId);
    if (!key) return [];
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
};

const saveCart = (userId, items) => {
    const key = cartKey(userId);
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
    // userId is tracked internally by reading from shanauto_user in localStorage
    const getUserId = () => {
        try {
            const u = JSON.parse(localStorage.getItem('shanauto_user'));
            return u?._id || u?.id || null;
        } catch { return null; }
    };

    const [userId, setUserId] = useState(() => getUserId());
    const [cartItems, setCartItems] = useState(() => loadCart(getUserId()));

    // Listen for auth changes (login / logout) via a custom event
    useEffect(() => {
        const onAuthChange = () => {
            const newUserId = getUserId();
            // Save current cart under previous userId before switching
            setCartItems(prev => {
                if (userId) saveCart(userId, prev);
                return [];
            });
            setUserId(newUserId);
            // Small delay to let state settle, then load new user's cart
            setTimeout(() => {
                setCartItems(loadCart(newUserId));
            }, 0);
        };

        window.addEventListener('shanauto:authchange', onAuthChange);
        return () => window.removeEventListener('shanauto:authchange', onAuthChange);
    }, [userId]);

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        if (userId) saveCart(userId, cartItems);
    }, [cartItems, userId]);

    /** Add item or increase qty */
    const addToCart = (part, qty = 1) => {
        setCartItems(prev => {
            const existing = prev.find(i => i._id === part._id);
            if (existing) {
                return prev.map(i => i._id === part._id
                    ? { ...i, quantity: Math.min(i.quantity + qty, part.stock) }
                    : i
                );
            }
            return [...prev, {
                _id: part._id,
                partName: part.partName,
                brand: part.brand,
                price: part.price,
                stock: part.stock,
                image: part.image,
                quantity: qty,
            }];
        });
    };

    /** Set explicit quantity */
    const updateQty = (id, qty) => {
        if (qty < 1) { removeFromCart(id); return; }
        setCartItems(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
    };

    const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i._id !== id));
    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};
