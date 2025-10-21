// src/App.js (FINAL CODE - Centering Auth Pages)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext';

// Import Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ListingPage from './pages/ListingPage';
import PostItem from './pages/PostItem';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ViewProfilePage from './pages/ViewProfilePage'; 

// Import Components
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header'; 

// Helper component to handle background and conditional rendering
function AppContent() {
    const location = useLocation(); 
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    const backgroundStyle = {
        backgroundImage: isAuthPage ? 'url(/background.jpg)' : 'none',
        backgroundColor: isAuthPage ? '#f4f4f4' : 'white', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100vw',
        
        // FIX 1: Add Flex properties to center content only on auth pages
        display: isAuthPage ? 'flex' : 'block',
        alignItems: isAuthPage ? 'center' : 'none', // Vertically center
        justifyContent: isAuthPage ? 'center' : 'none', // Horizontally center
    };

    return (
        <div style={backgroundStyle}>
            
            {/* Conditionally Render Header (Hidden on Login/Signup) */}
            {!isAuthPage && <Header />} 

            <div className="container" style={{
                width: '100%', 
                // Remove padding top for auth pages
                paddingTop: isAuthPage ? '0' : '65px',
            }}>
                <Routes>
                    <Route exact path="/" element={<ListingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Private Routes */}
                    <Route path="/post" element={<PrivateRoute element={<PostItem />} />} />
                    <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
                    <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
                    <Route path="/profile/:userId" element={<PrivateRoute element={<ViewProfilePage />} />} />

                    {/* 404 Route */}
                    <Route path="*" element={<div>404: Page Not Found</div>} />
                </Routes>
            </div>
        </div>
    );
}

// Main App component (wraps with Router)
function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent /> 
            </AuthProvider>
        </Router>
    );
}

export default App;
//