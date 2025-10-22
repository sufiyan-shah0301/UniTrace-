import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { claimItem, markAsReunited } from '../services/firebaseService'; 
import { Link } from 'react-router-dom';
import '../styles/ItemCard.css'; 
import { formatDistanceToNow } from 'date-fns';
import Notification from './Notification'; // Notification component

function ItemCard({ item, isDashboard, setActiveChatId }) { 
    const { currentUser } = useAuth();
    const [status, setStatus] = useState(item.status); 
    const [notification, setNotification] = useState({ message: '', type: '' }); // State for notification

    const isOwner = currentUser ? item.ownerUID === currentUser.uid : false;
    const isClaimant = currentUser ? item.claimantUID === currentUser.uid : false;
    const otherPartyUid = isOwner ? item.claimantUID : item.ownerUID;
    
    // handleClaim function (Pehle se updated hai)
    const handleClaim = async () => {
        if (!currentUser) { 
            setNotification({ message: 'You must be logged in to claim an item.', type: 'error' });
            return; 
        }
        if (isOwner) { 
            setNotification({ message: 'You cannot claim your own item.', type: 'error' });
            return; 
        }
        try {
            await claimItem(item.id, item.ownerUID); 
            setStatus('Claim Pending'); 
            setNotification({ message: 'Claim request submitted! Check your dashboard.', type: 'success' });
        } catch (error) {
            setNotification({ message: `Failed to submit claim: ${error.message}`, type: 'error' });
        }
    };
    
    // --- UPDATED: handleResolve function ---
    const handleResolve = async () => {
        // window.confirm() hata diya
        try {
            await markAsReunited(item.id); 
            setStatus('Reunited'); 
            // alert() ki jagah setNotification
            setNotification({ message: 'Item successfully marked as REUNITED!', type: 'success' });
        } catch (error) {
            console.error("Error marking item reunited:", error);
            // alert() ki jagah setNotification
            setNotification({ message: 'Could not mark item reunited. Please try again.', type: 'error' });
        }
    };
    // ------------------------------------

    let buttonContent;
    const currentStatus = status ? status.trim().toLowerCase() : '';

    // ... (Button logic poora same hai) ...
    if (isDashboard) {
        const isActionable = (isOwner || isClaimant) && currentStatus === 'claim pending';
        if (isActionable) { buttonContent = ( <div className="item-card-buttons"> <button onClick={() => setActiveChatId && setActiveChatId(item.id)} className="item-card-button btn-chat">Start Secure Chat</button> <Link to={otherPartyUid ? `/profile/${otherPartyUid}` : '#'} className="item-card-button btn-contact">View Contact Info</Link> {isOwner && (<button onClick={handleResolve} className="item-card-button btn-reunited">Mark as Reunited</button>)} </div> ); } 
        else { buttonContent = (<div className="item-card-buttons"><button disabled className="item-card-button btn-status">Status: {status}</button></div>); }
    } else { 
        if (currentUser) {
            if (isOwner) { buttonContent = (<div className="item-card-buttons"><button disabled className="item-card-button btn-owner">Your Item (Posted)</button></div>); } 
            else if (currentStatus === 'found' || currentStatus === 'lost') { buttonContent = (<div className="item-card-buttons"><button onClick={handleClaim} className="item-card-button btn-claim">Claim Item</button></div>); } 
            else { buttonContent = (<div className="item-card-buttons"><button disabled className="item-card-button btn-status">{status}</button></div>); }
        } else {
            if (currentStatus === 'found' || currentStatus === 'lost') { buttonContent = <small>Log in to claim</small>; } 
            else { buttonContent = <small>Status: {status}</small>; }
        }
    }

    // --- Timestamp logic (Pehle jaisa) ---
    let timeAgo = '';
    if (item.timestamp && item.timestamp.toDate) { 
        try { timeAgo = formatDistanceToNow(item.timestamp.toDate(), { addSuffix: true }); } 
        catch (error) { timeAgo = "Invalid date"; }
    } else { timeAgo = "Date unavailable"; }

    const placeholderImage = '/placeholder.png';

    return (
        <> 
            {/* Notification component ko yahan render kiya */}
            <Notification 
                message={notification.message} 
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })} 
            />
            
            <div className="item-card">
                <img 
                    src={item.imageUrl || placeholderImage} 
                    alt={item.name || 'Item Image'} 
                    className="item-card-image" 
                    onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} 
                />
                <h4>{item.name || 'Unnamed Item'} ({item.category || 'Uncategorized'})</h4>
                <p>Status: <strong>{status}</strong></p> 
                <p className="item-card-location">Location: {item.location || 'Not specified'}</p>
                <p>Description: {item.description || 'No description provided.'}</p>
                <p className="item-card-timestamp">{timeAgo}</p> 
                {buttonContent} 
            </div>
        </>
    );
}

export default ItemCard;