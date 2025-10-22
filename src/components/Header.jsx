import React from 'react';
// Yahan NavLink ko import kiya hai
import { NavLink, Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';
import logoImage from '../assets/logo.png';

function Header() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout Failed:', error);
            alert('Failed to log out.');
        }
    };

    return (
        <header className="header-container">
            <div className="header-content">
                <Link to="/" className="header-brand">
                    <img src={logoImage} alt="UniTrace Logo" className="header-logo" />
                    <h1 className="header-title">
                        <span className="header-uni">Uni</span>
                        <span className="header-trace">Trace</span>
                    </h1>
                </Link>

                <nav className="header-nav">
                    {currentUser && (
                        <>
                            {/* Link ko NavLink se replace kiya */}
                            <NavLink 
                                to="/listings" 
                                className={({ isActive }) => isActive ? "header-nav-link active" : "header-nav-link"}
                            >
                                Board
                            </NavLink>
                            <NavLink 
                                to="/post" 
                                className={({ isActive }) => isActive ? "header-nav-link active" : "header-nav-link"}
                            >
                                Post Item
                            </NavLink>
                            <NavLink 
                                to="/dashboard" 
                                className={({ isActive }) => isActive ? "header-nav-link active" : "header-nav-link"}
                            >
                                Dashboard
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="header-user-menu">
                    {currentUser ? (
                        <>
                            <Link to="/profile" className="profile-icon-link">
                                <span className="profile-initial">
                                    {userName.substring(0, 1).toUpperCase()}
                                </span>
                            </Link>
                            <div className="user-details">
                                <Link to="/profile" className="user-name-link">
                                    Hello, {userName}
                                </Link>
                                <span className="logout-link" onClick={handleLogout}>
                                    Logout
                                </span>
                            </div>
                        </>
                    ) : (
                        <nav className="header-auth-nav">
                            <Link to="/login" className="header-nav-link">Login</Link>
                            <Link to="/signup" className="header-nav-link">Sign Up</Link>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;