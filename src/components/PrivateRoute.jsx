// src/components/PrivateRoute.jsx

import React from 'react';
// FIX: Use Navigate hook instead of Redirect component
import { Navigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
// NOTE: Correct import path: Go up one level (components) then down into context

export default function PrivateRoute({ element }) {
    const { currentUser, loading } = useAuth();

    if (loading) return <div>Checking Authentication...</div>; 

    // FIX: If user exists, return the element. If not, navigate to login.
    return currentUser ? element : <Navigate to="/login" replace />;
}