// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { fetchMyPostedItems, fetchMyClaimedItems } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard'; 
import ChatBox from '../components/ChatBox'; // FIX: Import ChatBox

function DashboardPage() {
    const { currentUser } = useAuth();
    const [postedItems, setPostedItems] = useState([]);
    const [claimedItems, setClaimedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posted');
    // FIX: State to manage the open chat window
    const [activeChatId, setActiveChatId] = useState(null); 

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const postedSnapshot = await fetchMyPostedItems();
                const postedList = postedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPostedItems(postedList);

                const claimedSnapshot = await fetchMyClaimedItems();
                const claimedList = claimedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setClaimedItems(claimedList);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    // FIX: Show ChatBox if activeChatId is set
    if (activeChatId) {
        return (
            <ChatBox 
                itemId={activeChatId} 
                onClose={() => setActiveChatId(null)} // Function to close the chat
            />
        );
    }
    
    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Dashboard...</div>;

    const itemsToDisplay = activeTab === 'posted' ? postedItems : claimedItems;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Your Activity Dashboard</h2>

            {/* Tab Navigation */}
            <div style={{ marginBottom: '30px' }}>
                <button 
                    onClick={() => setActiveTab('posted')}
                    style={{ padding: '10px', marginRight: '10px', backgroundColor: activeTab === 'posted' ? '#007bff' : '#f0f0f0', color: activeTab === 'posted' ? 'white' : 'black' }}
                >
                    My Posted Items ({postedItems.length})
                </button>
                <button 
                    onClick={() => setActiveTab('claimed')}
                    style={{ padding: '10px', backgroundColor: activeTab === 'claimed' ? '#007bff' : '#f0f0f0', color: activeTab === 'claimed' ? 'white' : 'black' }}
                >
                    My Claimed Items ({claimedItems.length})
                </button>
            </div>

            {/* Item List */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
                {itemsToDisplay.length > 0 ? (
                    itemsToDisplay.map(item => (
                        // FIX: Pass setActiveChatId function to ItemCard
                        <ItemCard 
                            key={item.id} 
                            item={item} 
                            isDashboard={true} 
                            setActiveChatId={setActiveChatId} 
                        />
                    ))
                ) : (
                    <p>You have no {activeTab} items.</p>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;