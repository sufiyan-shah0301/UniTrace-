// src/context/AuthContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
// CORRECT IMPORT: ../firebase means go up one level to the src folder
import { auth } from '../firebase'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        // Expose Firebase sign out directly
        logout: () => auth.signOut() 
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Only render children when the auth state is known */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};