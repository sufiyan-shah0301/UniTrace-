// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// FIX 1: Import all necessary modules for the save operation
import { signUpUser } from '../services/firebaseService'; 
import { db } from '../firebase'; // Import the Firestore instance
import firebase from 'firebase/app'; // Import base firebase for FieldValue

function SignupPage() {
    const [name, setName] = useState(''); // NEW STATE for Name
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await signUpUser(email, password); 
            const user = userCredential.user;
            
            // 2. Update the user's Firebase Auth profile (for immediate 'Hello, Name' display)
            await user.updateProfile({ 
                displayName: name 
            });

            // 3. CRITICAL FIX: Save the user's data to the 'users' collection in Firestore
            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                displayName: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp() // Timestamp for sorting
            });
            // -----------------------------------------------------------

            navigate('/'); 
        } catch (err) {
            setError('Failed to sign up: ' + err.message); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* INPUT: Full Name / Display Name */}
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name / Display Name" required style={{ padding: '10px' }}/> 

                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ padding: '10px' }}/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 characters)" required style={{ padding: '10px' }}/>
                <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Log In</Link>
            </p>
        </div>
    );
}

export default SignupPage;