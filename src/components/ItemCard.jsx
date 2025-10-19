// src/components/ItemCard.jsx (FINAL LOGIC)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { claimItem, markAsReunited } from '../services/firebaseService'; 
import { Link } from 'react-router-dom'; // Import Link for View Profile button

// NOTE: ItemCard needs setActiveChatId prop passed from DashboardPage
function ItemCard({ item, isDashboard, setActiveChatId }) { 
    const { currentUser } = useAuth();
    const [statusText, setStatusText] = useState(item.status); 

    const isOwner = currentUser && (item.ownerUID === currentUser.uid);
    const isClaimant = currentUser && (item.claimantUID === currentUser.uid);

    // Determine the ID of the person you need to contact (the other party)
    // This is used for the View Contact Info Link
    const otherPartyUid = item.ownerUID === currentUser?.uid ? item.claimantUID : item.ownerUID;
    
    // --- Handlers (Claim, Resolve) are the same ---
    const handleClaim = async () => {
        if (!currentUser) { alert("You must be logged in to claim an item."); return; }
        try {
            await claimItem(item.id, item.ownerUID); 
            setStatusText('Claim Pending'); 
            alert('Claim request submitted successfully! Check your dashboard.');
        } catch (error) {
            alert('Failed to submit claim: ' + error.message);
        }
    };
    
    const handleResolve = async () => {
        if (!window.confirm("Are you sure the item has been successfully reunited? This action is final.")) { return; }
        try {
            await markAsReunited(item.id); 
            setStatusText('Reunited'); 
            alert("Item successfully marked as REUNITED!");
        } catch (error) {
            console.error("Error marking item reunited:", error);
            alert("Could not mark item reunited. Please try again.");
        }
    };
    // ----------------------------------------------


    let buttonContent;

    if (isDashboard) {
        // --- 1. DASHBOARD LOGIC (Actionable Contact) ---
        const isActionable = (isOwner || isClaimant) && statusText === 'Claim Pending';

        if (isActionable) {
            buttonContent = (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                    {/* START CHAT BUTTON */}
                    <button 
                        onClick={() => setActiveChatId(item.id)}
                        style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}
                    >
                        Start Secure Chat
                    </button>
                    
                    {/* VIEW CONTACT INFO BUTTON */}
                    <Link to={`/profile/${otherPartyUid}`} style={{ textDecoration: 'none' }}>
                        <button 
                            style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '8px', cursor: 'pointer', width: '100%' }}
                        >
                            View Contact Info
                        </button>
                    </Link>

                    {/* MARK REUNITED (Only Owner can see this) */}
                    {isOwner && ( 
                        <button onClick={handleResolve} style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}>
                            Mark as Reunited
                        </button>
                    )}
                </div>
            );
        } else {
            // Show status (Reunited, etc.)
            buttonContent = <button disabled style={{ padding: '8px' }}>Status: {statusText}</button>;
        }

    } else {
        // --- 2. MAIN LISTING BOARD LOGIC ---
        
        if ((statusText === 'Found' || statusText === 'Lost') && currentUser) { 
            if (isOwner) {
                // Owner's item on the Board
                buttonContent = <button disabled style={{ padding: '8px', backgroundColor: '#e0e0e0' }}>Your Item (Posted)</button>;
            } else {
                // Non-owner sees Claim button
                buttonContent = <button onClick={handleClaim}>Claim Item</button>;
            }
        } else {
            // Default: Item is claimed or user is logged out
            buttonContent = currentUser ? <button disabled>{statusText}</button> : <small>Log in to claim</small>;
        }
    }

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', width: '300px' }}>
            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <h4>{item.name} ({item.category})</h4>
            <p>Status: <strong>{statusText}</strong></p>
            <p>Description: {item.description}</p>
            
            {buttonContent}
        </div>
    );
}

export default ItemCard;