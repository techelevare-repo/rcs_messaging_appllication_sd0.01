import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import visionAPI from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('vision_token'));
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('vision_user');
        return raw ? JSON.parse(raw) : null;
    });

    // New function to update the profile picture
    const updateProfilePicture = (newPicture) => {
        setUser((prev) => {
            const updatedUser = { ...prev, profilePicture: newPicture };
            // Persist to localStorage if needed
            localStorage.setItem('vision_user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) localStorage.setItem('vision_token', token);
        else localStorage.removeItem('vision_token');
    }, [token]);

    useEffect(() => {
        if (user) localStorage.setItem('vision_user', JSON.stringify(user));
        else localStorage.removeItem('vision_user');
    }, [user]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await visionAPI.login(email, password);
            if (response.success) {
                setToken(response.token);
                setUser(response.user);
                return { success: true };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    // **Function to update user info in context**
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('vision_user', JSON.stringify(updatedUser));
  };


    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await visionAPI.register(userData);
            if (response.success) {
                setToken(response.token);
                setUser(response.user);
                return { success: true };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        visionAPI.logout();
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            isAuthenticated: Boolean(token),
            token,
            user,
            loading,
            login,
            register,
            logout,
            updateUser,
            updateProfilePicture,
        }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};



