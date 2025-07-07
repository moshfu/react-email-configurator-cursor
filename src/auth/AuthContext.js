import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for a logged-in user in session storage on initial load
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.login(username, password);
        if (response.success) {
            let patchedUser = { ...response.user };
            // Patch: set user.role to 'admin' if backend role name is 'Admin'
            if (patchedUser.role && (patchedUser.role.name === 'Admin' || patchedUser.role === 'admin')) {
                patchedUser.role = 'admin';
            }
            sessionStorage.setItem('user', JSON.stringify(patchedUser));
            setUser(patchedUser);
            return { success: true, user: patchedUser };
        }
        return { success: false, message: response.message };
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        // Also clear any other session-specific data if needed
        sessionStorage.removeItem('currentConfig');
    };
    
    const forcePasswordUpdate = async (userId, newPassword) => {
        const response = await api.changePassword(userId, newPassword);
        if (response.success) {
            // Update user in context and session storage
            const updatedUser = { ...user, mustChangePassword: false };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true };
        }
        return { success: false, message: 'Failed to update password.' };
    };

    const value = { user, login, logout, forcePasswordUpdate, loading, isAuthenticated: !!user };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
