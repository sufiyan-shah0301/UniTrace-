// src/pages/ListingPage.jsx

import React, { useState, useEffect } from 'react';
// FIX: Correct path to the services folder
import { fetchAllItems } from '../services/firebaseService';
import ItemCard from '../components/ItemCard'; // Assume you are creating this

function ListingPage() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Found');

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                const snapshot = await fetchAllItems(null, statusFilter); 
                const itemsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setItems(itemsList);
                setFilteredItems(itemsList);
            } catch (error) {
                console.error(`Error fetching ${statusFilter} items:`, error);
                setItems([]);
                setFilteredItems([]);
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, [statusFilter]);

    useEffect(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = items.filter(item => 
            (item.name && item.name.toLowerCase().includes(lowerCaseSearch)) ||
            (item.description && item.description.toLowerCase().includes(lowerCaseSearch))
        );
        setFilteredItems(results);
    }, [searchTerm, items]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Lost & Found items...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Campus Lost and Found Board</h2>
            
            {/* Status Filter Tabs */}
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={() => setStatusFilter('Found')} 
                    style={{ padding: '10px', marginRight: '10px', backgroundColor: statusFilter === 'Found' ? '#007bff' : '#f0f0f0', color: statusFilter === 'Found' ? 'white' : 'black' }}
                >
                    Found Items
                </button>
                <button 
                    onClick={() => setStatusFilter('Lost')} 
                    style={{ padding: '10px', backgroundColor: statusFilter === 'Lost' ? '#007bff' : '#f0f0f0', color: statusFilter === 'Lost' ? 'white' : 'black' }}
                >
                    Lost Items
                </button>
            </div>

            {/* Search Bar */}
            <input 
                type="text" 
                placeholder={`Search ${statusFilter.toLowerCase()} items by name or description...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '30px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            
            {/* Item List */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
                {filteredItems.map(item => (
                    <ItemCard key={item.id} item={item} />
                ))}
                {filteredItems.length === 0 && <p style={{ width: '100%', textAlign: 'center' }}>No {statusFilter.toLowerCase()} items found matching your criteria.</p>}
            </div>
        </div>
    );
}

export default ListingPage;