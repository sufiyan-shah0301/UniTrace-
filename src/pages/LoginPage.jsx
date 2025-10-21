import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInUser, signInWithGoogle } from '../services/firebaseService';

// CSS file import karo
import '../styles/Auth.css';

// Naye icons import karo
import { BsBook, BsKey, BsBackpack, BsPencilSquare } from 'react-icons/bs';
import { FaGraduationCap } from "react-icons/fa";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInUser(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Failed to log in with Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            {/* ANIMATED ICONS KA AREA */}
            <div className="animated-bg">
                <BsBook />
                <FaGraduationCap />
                <BsKey />
                <BsBackpack />
                <BsPencilSquare />
                <BsBook />
                <FaGraduationCap />
                <BsKey />
                <BsBackpack />
                <BsPencilSquare />
            </div>

            {/* Login Card */}
            <div className="auth-card">
                <h2>Welcome Back!</h2>
                {error && <p className="error-message">{error}</p>}
                
                <form onSubmit={handleEmailLogin} className="auth-form">
                    <div className="input-group">
                        <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 4.5a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3v-15Zm12.039 4.763a1.5 1.5 0 0 0-2.078 0l-4.5 3.75a1.5 1.5 0 0 0 .961 2.737h9a1.5 1.5 0 0 0 .96-2.737l-4.5-3.75Z" /></svg>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                            required 
                            className="auth-input"
                        />
                    </div>
                    <div className="input-group">
                        <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 11V7a4 4 0 1 1 8 0v4h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2 0v0h4V7a2 2 0 1 0-4 0v4Z" /></svg>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password" 
                            required 
                            className="auth-input"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="auth-button btn-primary">
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <div className="divider">OR</div>

                <button onClick={handleGoogleLogin} disabled={loading} className="auth-button btn-danger">
                    <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.618-3.657-11.28-8.591l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l6.19 5.238C42.032 35.622 44 30.036 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                    {loading ? 'Signing In...' : 'Sign in with Google'}
                </button>
                <p className="auth-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;