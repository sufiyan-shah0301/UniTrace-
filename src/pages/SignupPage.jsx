import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpUser } from '../services/firebaseService'; 
import { db } from '../firebase'; 
import firebase from 'firebase/app'; 
import '../styles/Auth.css';
import { BsBook, BsKey, BsBackpack, BsPencilSquare } from 'react-icons/bs';
import { FaGraduationCap } from "react-icons/fa";
import logoImage from '../assets/logo.png';

function SignupPage() {
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setLoading(true);
        try {
            const userCredential = await signUpUser(email, password); 
            const user = userCredential.user;
            await user.updateProfile({ 
                displayName: name 
            });
            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                displayName: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            navigate('/'); 
        } catch (err) {
            setError('Failed to sign up: ' + err.message); 
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
                
                {error && <p className="error-message">{error}</p>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                       <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.498.07 7.502 7.502 0 0 0-14.992 0 .75.75 0 1 1-1.5-.07 9.005 9.005 0 0 1 5.9-8.181A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" /></svg>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Full Name" 
                            required 
                            className="auth-input"
                        />
                    </div>
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
                            placeholder="Password (min 6 characters)" 
                            required 
                            className="auth-input"
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="auth-button btn-success">
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;