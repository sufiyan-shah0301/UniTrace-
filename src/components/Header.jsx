// src/components/Header.jsx (FINAL LAYOUT)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

function Header() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const userName = currentUser?.displayName || currentUser?.email.split('@')[0]; 

    const handleLogout = async () => {
        try {
            await logout(); 
            navigate('/login');
        } catch (error) {
            console.error('Logout Failed:', error);
            alert('Failed to log out.');
        }
    };

    // Styling for three-column layout (Logo Left, Nav Center, User Right)
    const navStyle = { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '15px 30px', 
        backgroundColor: '#f8f8f8',
        borderBottom: '1px solid #e0e0e0' 
    };
    const linkStyle = { 
        marginLeft: '20px', 
        textDecoration: 'none', 
        color: '#007bff', 
        fontWeight: '500' 
    };
    // Style for the User/Logout vertical stack section
    const userGroupRightStyle = { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end' 
    };

    return (
        <nav style={navStyle}>
            {/* 1. LEFT SECTION (Logo) */}
            <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Lost & Found 🎓</h1>
            </Link>

            {/* 2. CENTER SECTION (Navigation Links) */}
            <div style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
                {currentUser && (
                    <>
                        <Link to="/" style={linkStyle}>Board</Link> 
                        <Link to="/post" style={linkStyle}>Post Item</Link>
                        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                    </>
                )}
            </div>
            
            {/* 3. RIGHT SECTION (Profile Icon + User Info + Logout) */}
            <div style={userGroupRightStyle}>
                {currentUser ? (
                    <>
                        {/* FIX 1: Profile Icon Link */}
                        <Link to="/profile" style={{ textDecoration: 'none', color: '#333', marginRight: '15px' }}>
                            <span style={{ 
                                backgroundColor: '#007bff', 
                                color: 'white', 
                                borderRadius: '50%', 
                                padding: '5px 10px', 
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}>
                                {userName.substring(0, 1).toUpperCase()}
                            </span>
                        </Link>
                        
                        {/* FIX 2: Vertical Stack for User Name and Logout */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                            {/* User Name */}
                            <Link to="/profile" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                Hello, {userName}
                            </Link>
                            
                            {/* Logout Button */}
                            <span 
                                style={{
                                    cursor: 'pointer', 
                                    color: '#dc3545', 
                                    fontSize: '0.8rem', 
                                    fontWeight: '500',
                                    textDecoration: 'underline'
                                }} 
                                onClick={handleLogout}
                            >
                                Logout
                            </span>
                        </div>
                    </>
                ) : (
                    // User is Logged Out (Login/Signup links)
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/signup" style={linkStyle}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Header;
//