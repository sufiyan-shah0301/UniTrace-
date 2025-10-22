import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext';

// Import Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ListingPage from './pages/ListingPage';
import PostItem from './pages/PostItem';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ViewProfilePage from './pages/ViewProfilePage'; 

// Import Components
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

// Helper component
function AppContent() {
    const location = useLocation(); 
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

    // CRITICAL: Force body scroll based on page type
    useEffect(() => {
        if (isAuthPage) {
            // Auth pages: No scroll - FORCED!
            document.body.style.setProperty('overflow', 'hidden', 'important');
            document.body.style.setProperty('height', '100vh', 'important');
            document.documentElement.style.setProperty('overflow', 'hidden', 'important');
            document.documentElement.style.setProperty('height', '100vh', 'important');
        } else {
            // Other pages: Scroll enabled
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('height');
            document.body.style.overflow = 'visible';
            document.body.style.height = 'auto';
            document.documentElement.style.removeProperty('overflow');
            document.documentElement.style.removeProperty('height');
            document.documentElement.style.overflow = 'visible';
            document.documentElement.style.height = 'auto';
        }
        
        return () => {
            // Cleanup
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('height');
            document.documentElement.style.removeProperty('overflow');
            document.documentElement.style.removeProperty('height');
        };
    }, [location, isAuthPage]);

    return (
        <>
            {/* Fixed Background for non-auth pages */}
            {!isAuthPage && (
                <>
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'url(/main-background.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: -2
                    }}></div>
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: -1
                    }}></div>
                </>
            )}

            {/* Auth page background */}
            {isAuthPage && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url(/background.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#f4f4f4',
                    zIndex: -1
                }}></div>
            )}

            {/* Scrollable content wrapper */}
            <div style={{
                minHeight: '100vh',
                width: '100%',
                position: 'relative',
                display: isAuthPage ? 'flex' : 'block',
                alignItems: isAuthPage ? 'center' : 'flex-start',
                justifyContent: isAuthPage ? 'center' : 'flex-start'
            }}>
                {!isAuthPage && <Header />}

                {/* Routes container */}
                <div style={{
                    width: '100%',
                    paddingTop: isAuthPage ? '0' : '85px',
                    paddingBottom: '60px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <Routes>
                        <Route path="/" element={<ListingPage />} /> 
                        <Route path="/listings" element={<ListingPage />} /> 
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/post" element={<PrivateRoute element={<PostItem />} />} />
                        <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
                        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
                        <Route path="/profile/:userId" element={<PrivateRoute element={<ViewProfilePage />} />} />
                        <Route path="*" element={<div>404: Page Not Found</div>} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

// Main App component
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