import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAnyUserProfile, updateProfile } from '../services/firebaseService';

// Nayi CSS file import ki
import '../styles/ProfilePage.css'; 
// Notification component import kiya
import Notification from '../components/Notification'; 

function ProfilePage() {
    const { currentUser, loading: authLoading } = useAuth();
    const [userData, setUserData] = useState({ displayName: '', email: '', phoneNumber: '' });
    const [loading, setLoading] = useState(true);
    // saveMessage ko notification state mein badal diya
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        if (currentUser) {
            const loadProfile = async () => {
                setLoading(true);
                try {
                    const userDoc = await fetchAnyUserProfile(currentUser.uid); 
                    const data = userDoc.data();
                    
                    setUserData({
                        displayName: data?.displayName || currentUser.displayName || '',
                        email: data?.email || currentUser.email || '',
                        phoneNumber: data?.phoneNumber || '' 
                    });
                } catch (error) {
                    console.error("Error loading profile:", error);
                    setNotification({ message: 'Error loading profile.', type: 'error' });
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
        setNotification({ message: '', type: '' }); // Clear previous message

        try {
            await updateProfile(currentUser.uid, {
                displayName: userData.displayName,
                phoneNumber: userData.phoneNumber,
            });
            // alert ki jagah notification
            setNotification({ message: 'Profile successfully updated!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Error saving profile.', type: 'error' });
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        // Loading spinner use kiya
        return (
            <div className="loading-container">
                <div className="spinner"></div> 
            </div>
        );
    }

    return (
        // Container aur card classes add ki
        <div className="profile-page-container">
            {/* Notification component render kiya */}
            <Notification 
                message={notification.message} 
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })} 
            />

            <div className="profile-card">
                <h2 className="profile-title">Your Profile</h2>
                
                {/* Success/Error message <p> tag hata diya
                  kyunki ab notification component handle kar raha hai 
                */}

                <form onSubmit={handleSave} className="profile-form">
                    {/* Har field ko div mein wrap kiya styling ke liye */}
                    <div className="form-group">
                        <label htmlFor="displayName" className="form-label">Name:</label>
                        <input 
                            id="displayName"
                            type="text" 
                            value={userData.displayName} 
                            onChange={(e) => setUserData({...userData, displayName: e.target.value})} 
                            placeholder="Display Name"
                            required
                            className="form-input" // Class add ki
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email (Cannot Change):</label>
                        <input 
                            id="email"
                            type="email" 
                            value={userData.email} 
                            disabled // Email change nahi ho sakta
                            className="form-input disabled-input" // Disabled ke liye alag class
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number (for Contact):</label>
                        <input 
                            id="phoneNumber"
                            type="tel" 
                            value={userData.phoneNumber} 
                            onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})} 
                            placeholder="Enter Phone Number (e.g., +91...)"
                            className="form-input" // Class add ki
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;