// context/AuthContext.jsx – Global authentication state
import { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/authService';

export const AuthContext = createContext(null);

// Fire this whenever auth state changes so CartContext can react
const dispatchAuthChange = () =>
    window.dispatchEvent(new CustomEvent('shanauto:authchange'));

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('shanauto_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            if (user?.token) {
                try {
                    await getMe();
                } catch {
                    // Token invalid – clear session
                    setUser(null);
                    localStorage.removeItem('shanauto_user');
                    dispatchAuthChange();
                }
            }
            setLoading(false);
        };
        verifyToken();
    }, []);

    const loginUser = (userData) => {
        localStorage.setItem('shanauto_user', JSON.stringify(userData));
        setUser(userData);
        dispatchAuthChange(); // → CartContext loads this user's saved cart
    };

    const logoutUser = () => {
        dispatchAuthChange(); // → CartContext saves + clears cart BEFORE user is removed
        setTimeout(() => {
            localStorage.removeItem('shanauto_user');
            setUser(null);
        }, 0);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, loading, isAdmin: user?.role === 'admin', isManager: user?.role === 'manager', permissions: user?.permissions || [] }}>
            {children}
        </AuthContext.Provider>
    );
};
