import React, { useState, useEffect } from 'react';
import { fetchMyPostedItems, fetchMyClaimedItems } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard'; 
import ChatBox from '../components/ChatBox'; 

import '../styles/DashboardPage.css'; 
import '../styles/ListingPage.css'; 

function DashboardPage() {
    const { currentUser } = useAuth();
    const [postedItems, setPostedItems] = useState([]);
    const [claimedItems, setClaimedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posted');
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
        if (currentUser) {
            loadDashboardData();
        } else {
            setLoading(false); 
        }
    }, [currentUser]); 

    // --- YEH IF BLOCK HATA DIYA HAI ---
    // if (activeChatId) { ... } 
    
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    const itemsToDisplay = activeTab === 'posted' ? postedItems : claimedItems;

    return (
        // Ek wrapper fragment add kiya
        <>
            <div className="dashboard-page-container">
                <h2 className="dashboard-title">Your Activity Dashboard</h2>

                <div className="dashboard-tabs">
                    <button 
                        onClick={() => setActiveTab('posted')}
                        className={`dashboard-tab ${activeTab === 'posted' ? 'active' : ''}`}
                    >
                        My Posted Items ({postedItems.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('claimed')}
                        className={`dashboard-tab ${activeTab === 'claimed' ? 'active' : ''}`}
                    >
                        My Claimed Items ({claimedItems.length})
                    </button>
                </div>

                <div className="item-list-grid">
                    {itemsToDisplay.length > 0 ? (
                        itemsToDisplay.map(item => (
                            <ItemCard 
                                key={item.id} 
                                item={item} 
                                isDashboard={true} 
                                setActiveChatId={setActiveChatId} 
                            />
                        ))
                    ) : (
                        <p className="no-items-message">You have no {activeTab} items.</p>
                    )}
                </div>
            </div>

            {/* --- CHATBOX KO YAHAN RENDER KIYA HAI --- */}
            {/* Jab activeChatId set hoga, yeh modal ki tarah upar aa jayega */}
            {activeChatId && (
                <ChatBox 
                    itemId={activeChatId} 
                    onClose={() => setActiveChatId(null)} 
                />
            )}
        </>
    );
}

export default DashboardPage;