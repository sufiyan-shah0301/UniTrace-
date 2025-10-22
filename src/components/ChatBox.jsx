import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessage, subscribeToMessages, fetchAnyUserProfile } from '../services/firebaseService';
import '../styles/ChatBox.css'; 

function ChatBox({ itemId, onClose }) { 
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [otherUserName, setOtherUserName] = useState('The Other Party'); 
    const [userNames, setUserNames] = useState({}); 
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to fetch name (Aapka code - No change)
    const fetchAndCacheUserName = async (uid) => {
        if (!userNames[uid]) {
            try {
                const userDoc = await fetchAnyUserProfile(uid); 
                const data = userDoc.data();
                const name = data?.displayName || data?.email?.split('@')[0] || 'The Other Party';
                // --- FIX: State update ko function ke andar use karo ---
                setUserNames(prev => ({ ...prev, [uid]: name })); 
                return name;
            } catch (error) {
                setUserNames(prev => ({ ...prev, [uid]: 'The Other Party' }));
                return 'The Other Party';
            }
        }
        return userNames[uid];
    };
    
    // Helper function to get display name
    const getSenderName = (senderId) => {
        // Cache se check karo
        if (userNames[senderId]) {
            return userNames[senderId];
        }
        // Agar current user hai, toh uska naam return karo
        if (senderId === currentUser.uid) {
            return currentUser.displayName || currentUser.email.split('@')[0] || 'Me';
        }
        // Agar doosra user hai aur cache mein nahi hai, toh 'Loading...' dikhao
        return 'Loading...';
    };

    // useEffect for chat setup
    useEffect(() => {
        const setupChat = async () => {
            // --- FIX: Current user ka naam pehle cache karo ---
            if (currentUser && !userNames[currentUser.uid]) {
                const currentName = currentUser.displayName || currentUser.email.split('@')[0] || 'Me';
                setUserNames(prev => ({...prev, [currentUser.uid]: currentName}));
            }
            // ------------------------------------------------

            const unsubscribe = subscribeToMessages(itemId, (newMessages) => {
                setMessages(newMessages);
                
                // Doosre user ka ID dhoondo
                const otherSenderId = newMessages.find(msg => msg.sender !== currentUser.uid)?.sender;

                if (otherSenderId && !userNames[otherSenderId]) {
                    // Agar doosre user ka naam cache mein nahi hai, toh fetch karo
                    fetchAndCacheUserName(otherSenderId).then(name => {
                        setOtherUserName(name); // Title ke liye set karo
                    });
                } else if (otherSenderId) {
                    // Agar cache mein hai, toh direct set karo
                    setOtherUserName(userNames[otherSenderId]);
                }
            });
            return () => unsubscribe();
        };
        
        if (currentUser) {
            setupChat();
        }
    // userNames ko dependency se hata diya taaki infinite loop na chale
    }, [itemId, currentUser]); 


    // handleSend (Aapka code - No change)
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
        <div className="chat-backdrop" onClick={onClose}> 
            <div className="chat-modal" onClick={(e) => e.stopPropagation()}> 
                
                <div className="chat-header">
                    <h4 className="chat-title">Chatting with {otherUserName}</h4>
                    <button onClick={onClose} className="chat-close-btn">Close Chat</button>
                </div>

                <div className="message-list">
                    {messages.map(msg => (
                        <div 
                            key={msg.id} 
                            // --- FIX: Wrapper div message bubble ke liye ---
                            className={`message-wrapper ${msg.sender === currentUser.uid ? 'message-sent-wrapper' : 'message-received-wrapper'}`}
                        >
                            {/* Sender ka naam yahan dikhayenge */}
                            <small className="message-sender">
                               {getSenderName(msg.sender)}
                            </small>
                            <span className="message-bubble">
                                {msg.text}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="chat-form">
                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="Type your message..."
                        className="chat-input"
                    />
                    <button type="submit" className="chat-send-btn">Send</button>
                </form>
            </div>
        </div>
    );
}

export default ChatBox;