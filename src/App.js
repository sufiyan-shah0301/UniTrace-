// src/App.js

import React from 'react';
// FIX: Use Routes instead of Switch for modern router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ListingPage from './pages/ListingPage';
import PostItem from './pages/PostItem';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ViewProfilePage from './pages/ViewProfilePage'; // NEW IMPORT

// Import Components
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />

                <div className="container">
                    {/* FIX: Use <Routes> */}
                    <Routes>

                        {/* Public Routes - Use 'element' prop */}
                        <Route exact path="/" element={<ListingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        {/* FIX: Corrected syntax error on Signup route */}
                        <Route path="/signup" element={<SignupPage />} />

                        {/* Private Routes (Requires Login) 
                            FIX: The PrivateRoute component is now used to wrap the element directly.
                        */}
                        <Route path="/post" element={<PrivateRoute element={<PostItem />} />} />
                        <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />

                        {/* 404/Not Found Route */}
                        <Route path="*" element={<div>404: Page Not Found</div>} />
                        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />

// NEW ROUTE for viewing another user's profile/contact info
                        <Route path="/profile/:userId" element={<PrivateRoute element={<ViewProfilePage />} />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;