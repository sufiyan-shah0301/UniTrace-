// src/components/ChatBox.jsx (FINAL CHAT CODE)

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// FIX: Import the renamed function
import { sendMessage, subscribeToMessages, fetchAnyUserProfile } from '../services/firebaseService';

function ChatBox({ itemId, onClose }) { 
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    
    // State to store the name of the user you are chatting with
    const [otherUserName, setOtherUserName] = useState('The Other Party'); 
    const [userNames, setUserNames] = useState({}); // Cache for names

    // Function to fetch name for an unknown UID and cache it
    const fetchAndCacheUserName = async (uid) => {
        if (!userNames[uid]) {
            try {
                // FIX: Use fetchAnyUserProfile to get Firestore data
                const userDoc = await fetchAnyUserProfile(uid); 
                const data = userDoc.data();

                // Look for displayName, then email prefix
                const name = data?.displayName || data?.email?.split('@')[0] || 'The Other Party';
                
                setUserNames(prev => ({ ...prev, [uid]: name }));
                return name;
            } catch (error) {
                setUserNames(prev => ({ ...prev, [uid]: 'The Other Party' }));
                return 'The Other Party';
            }
        }
        return userNames[uid];
    };
    
    // Helper function to get display name for a message sender
    const getSenderName = (senderId) => {
        if (senderId === currentUser.uid) {
            return currentUser.displayName || currentUser.email.split('@')[0];
        } 
        return userNames[senderId] || 'The Other Party';
    };

    useEffect(() => {
        const setupChat = async () => {
            let unsubscribe;
            
            // 1. Subscribe to messages
            unsubscribe = subscribeToMessages(itemId, (newMessages) => {
                setMessages(newMessages);

                // 2. Identify the partner's UID and fetch their name
                const uniqueSenderIds = [...new Set(newMessages.map(msg => msg.sender))];
                
                uniqueSenderIds.forEach(async (uid) => {
                    if (uid !== currentUser.uid) {
                        const name = await fetchAndCacheUserName(uid);
                        setOtherUserName(name); // Set the title to the partner's name
                    }
                });
            });
            return () => unsubscribe();
        };
        setupChat();
    }, [itemId, currentUser.uid]);


    const handleSend = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;
        try {
            await sendMessage(itemId, currentUser.uid, input);
            setInput('');
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Could not send message.");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', border: '2px solid #007bff', borderRadius: '8px', padding: '15px', height: '60vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                {/* FIX: Dynamic Chat Title */}
                <h4 style={{ margin: 0 }}>Chatting with {otherUserName}</h4>
                <button onClick={onClose} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Close Chat</button>
            </div>

            {/* Message Area */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px', marginBottom: '10px' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{ 
                        textAlign: msg.sender === currentUser.uid ? 'right' : 'left', 
                        marginBottom: '10px',
                    }}>
                        {/* FIX: Display Sender Name/Label */}
                        <small style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', color: '#666' }}>
                           {getSenderName(msg.sender)}
                        </small>

                        <span style={{ 
                            padding: '8px 12px',
                            borderRadius: '15px',
                            backgroundColor: msg.sender === currentUser.uid ? '#007bff' : '#f0f0f0',
                            color: msg.sender === currentUser.uid ? 'white' : 'black',
                            display: 'inline-block'
                        }}>
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} style={{ display: 'flex' }}>
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your message..."
                    style={{ flexGrow: 1, padding: '10px', border: '1px solid #007bff', borderRadius: '4px 0 0 4px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>Send</button>
            </form>
        </div>
    );
}

export default ChatBox;
//