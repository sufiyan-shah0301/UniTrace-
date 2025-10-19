// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAnyUserProfile, updateProfile } from '../services/firebaseService';

function ProfilePage() {
    const { currentUser, loading: authLoading } = useAuth();
    const [userData, setUserData] = useState({ displayName: '', email: '', phoneNumber: '' });
    const [loading, setLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        if (currentUser) {
            const loadProfile = async () => {
                setLoading(true);
                try {
                    // Fetch data from Firestore's 'users' collection
                    const userDoc = await fetchAnyUserProfile(currentUser.uid); 
                    const data = userDoc.data();
                    
                    setUserData({
                        displayName: data?.displayName || currentUser.displayName || '',
                        email: data?.email || currentUser.email || '',
                        phoneNumber: data?.phoneNumber || '' // Load existing phone number
                    });
                } catch (error) {
                    console.error("Error loading profile:", error);
                } finally {
                    setLoading(false);
                }
            };
            loadProfile();
        }
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSaveMessage('');

        try {
            // Update Firestore with new phone number (and name, if you want to allow name change)
            await updateProfile(currentUser.uid, {
                displayName: userData.displayName,
                phoneNumber: userData.phoneNumber,
            });
            setSaveMessage('Profile successfully updated!');
        } catch (error) {
            setSaveMessage('Error saving profile.');
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading Profile...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>Your Profile</h2>
            <p style={{color: 'green'}}>{saveMessage}</p>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>Name:</label>
                <input 
                    type="text" 
                    value={userData.displayName} 
                    onChange={(e) => setUserData({...userData, displayName: e.target.value})} 
                    placeholder="Display Name"
                    required
                />
                <label>Email (Cannot Change):</label>
                <input 
                    type="email" 
                    value={userData.email} 
                    disabled // Email is usually immutable in Firebase Auth
                />
                
                <label>Phone Number (for Contact):</label>
                <input 
                    type="tel" 
                    value={userData.phoneNumber} 
                    onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})} 
                    placeholder="Enter Phone Number"
                />
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
}

export default ProfilePage;
//