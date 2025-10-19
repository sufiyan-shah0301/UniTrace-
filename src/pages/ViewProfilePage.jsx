// src/pages/ViewProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAnyUserProfile } from '../services/firebaseService';

function ViewProfilePage() {
    // Get the User ID from the URL
    const { userId } = useParams(); 
    
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            const loadUser = async () => {
                setLoading(true);
                try {
                    const userDoc = await fetchAnyUserProfile(userId); 
                    setProfile(userDoc.data());
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

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading User Profile...</div>;
    if (!profile) return <div style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>User profile not found.</div>;

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center' }}>
            <h2>Contact Information</h2>
            <p>This is the profile of the item poster/finder.</p>
            
            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <h3>{profile.displayName || profile.email.split('@')[0]}</h3>
                
                <p>Email: <strong>{profile.email}</strong></p>
                
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: profile.phoneNumber ? 'green' : 'red' }}>
                    Phone: {profile.phoneNumber ? profile.phoneNumber : 'No phone number provided.'}
                </p>
                
                {/* FIX: Removed the Call Now button logic */}
                {/* {profile.phoneNumber && (
                    <a href={`tel:${profile.phoneNumber}`} style={{textDecoration: 'none', display: 'block', marginTop: '20px'}}>
                        <button style={{padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer'}}>
                            Call Now
                        </button>
                    </a>
                )} */}
            </div>
        </div>
    );
}

export default ViewProfilePage;
//