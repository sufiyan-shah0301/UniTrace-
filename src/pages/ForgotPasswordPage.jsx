import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordReset } from '../services/firebaseService';
import '../styles/Auth.css';
import { BsBook, BsKey, BsBackpack, BsPencilSquare } from 'react-icons/bs';
import { FaGraduationCap } from "react-icons/fa";
import logoImage from '../assets/logo.png';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            await sendPasswordReset(email);
            setMessage('Password reset link sent! Check your inbox.');
        } catch (err) {
            setError('Failed to send reset email. Please check the address.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="animated-bg">
                <BsBook /> <FaGraduationCap /> <BsKey /> <BsBackpack /> <BsPencilSquare />
                <BsBook /> <FaGraduationCap /> <BsKey /> <BsBackpack /> <BsPencilSquare />
            </div>
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo" style={{ backgroundImage: `url(${logoImage})` }}></div>
                     <h2 className="brand-title">
                        <span className="brand-uni">Uni</span><span className="brand-trace">Trace</span>
                    </h2>
                </div>
                <p style={{ textAlign: 'center', margin: '-15px 0 20px 0', color: '#eee', fontSize: '0.9rem' }}>
                    Enter your email to receive a reset link.
                </p>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 4.5a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3v-15Zm12.039 4.763a1.5 1.5 0 0 0-2.078 0l-4.5 3.75a1.5 1.5 0 0 0 .961 2.737h9a1.5 1.5 0 0 0 .96-2.737l-4.5-3.75Z" /></svg>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Your Email Address" 
                            required 
                            className="auth-input"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="auth-button btn-primary">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="auth-link">
                    <Link to="/login">Back to Login</Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;