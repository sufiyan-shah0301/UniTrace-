// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// FIX: Correct path to the services folder
import { signInUser, signInWithGoogle } from '../services/firebaseService';

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
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
            
            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ padding: '10px' }}/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ padding: '10px' }}/>
                <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {loading ? 'Logging In...' : 'Log In'}
                </button>
            </form>

            <div style={{ textAlign: 'center', margin: '15px 0' }}>— OR —</div>

            <button onClick={handleGoogleLogin} disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#db4437', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Sign In with Google
            </button>
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
}

export default LoginPage;