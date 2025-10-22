import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAnyUserProfile } from '../services/firebaseService';

// Nayi CSS file import ki
import '../styles/ViewProfilePage.css'; 
// Common styles (spinner ke liye)
import '../styles/ListingPage.css'; 

function ViewProfilePage() {
    const { userId } = useParams(); 
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            const loadUser = async () => {
                setLoading(true);
                try {
                    const userDoc = await fetchAnyUserProfile(userId);
                    if (userDoc.exists()) {
                        setProfile(userDoc.data());
                    } else {
                        console.error("No such user profile!");
                        setProfile(null); // User not found
                    }
                } catch (error) {
                    console.error("Error loading profile:", error);
                    setProfile(null);
                } finally {
                    setLoading(false);
                }
            };
            loadUser();
        }
    }, [userId]);

    // Loading state ko spinner se replace kiya
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }
    
    // Error message ko style kiya
    if (!profile) {
        return (
            <div className="profile-message error">
                User profile not found.
            </div>
        );
    }

    // Phone number availability check
    const hasPhone = profile.phoneNumber && profile.phoneNumber.trim() !== '';

    return (
        // Container aur card classes add ki
        <div className="view-profile-container">
            <div className="view-profile-card">
                <h2 className="view-profile-title">Contact Information</h2>
                <p className="view-profile-subtitle">This is the public profile of the item poster/finder.</p>
                
                <div className="profile-details">
                    <h3>{profile.displayName || profile.email.split('@')[0]}</h3>
                    
                    <p>Email: <strong>{profile.email}</strong></p>
                    
                    {/* Phone number ko conditionally style kiya */}
                    <p className={`profile-phone ${hasPhone ? 'available' : 'unavailable'}`}>
                        Phone: {hasPhone ? profile.phoneNumber : 'No phone number provided.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ViewProfilePage;         