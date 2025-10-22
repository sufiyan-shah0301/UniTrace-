import React, { useState, useEffect } from 'react';
import { fetchAllItems } from '../services/firebaseService';
import ItemCard from '../components/ItemCard'; 

// CSS file import ki
import '../styles/ListingPage.css'; 

// --- ADDED: Search Icon import ---
import { BsSearch } from 'react-icons/bs'; 
// ----------------------------------

// Categories (Aapke code se)
const categories = ['All', 'Electronics', 'Keys', 'Books', 'Bags', 'Clothing', 'Other'];

function ListingPage() {
    // Aapka code (No Change)
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Found');
    const [categoryFilter, setCategoryFilter] = useState('All'); 
    const [sortBy, setSortBy] = useState('newest');

    // Aapka code (No Change)
    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                const snapshot = await fetchAllItems(null, statusFilter); 
                const itemsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setItems(itemsList);
            } catch (error) {
                console.error(`Error fetching ${statusFilter} items:`, error);
                setItems([]);
            } 
        };
        loadItems();
    }, [statusFilter]); 

    // Aapka code (No Change)
    useEffect(() => {
        setLoading(true); 
        const lowerCaseSearch = searchTerm.toLowerCase();
        let results = items.filter(item => {
            const categoryMatch = categoryFilter === 'All' || (item.category && item.category.toLowerCase() === categoryFilter.toLowerCase());
            const searchMatch = !searchTerm || 
                (item.name && item.name.toLowerCase().includes(lowerCaseSearch)) ||
                (item.description && item.description.toLowerCase().includes(lowerCaseSearch)) ||
                (item.category && item.category.toLowerCase().includes(lowerCaseSearch));
            return categoryMatch && searchMatch; 
        });

        results.sort((a, b) => {
            const timeA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0; 
            const timeB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
            if (sortBy === 'newest') {
                return timeB - timeA; 
            } else {
                return timeA - timeB; 
            }
        });
        
        setFilteredItems(results);
        setLoading(false); 
    }, [searchTerm, items, categoryFilter, sortBy]); 

    // Aapka code (No Change)
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div> 
            </div>
        );
    }

    return (
        <div className="listing-page-container">
            {/* Aapka code (No Change) */}
            <h2 className="listing-page-title">UniTrace Board</h2>
            
            {/* Aapka code (No Change) */}
            <div className="status-filter-tabs">
                 <button 
                    onClick={() => { setStatusFilter('Found'); setCategoryFilter('All'); setSearchTerm(''); setSortBy('newest'); }} 
                    className={`status-filter-tab ${statusFilter === 'Found' ? 'active' : ''}`}
                 > Found Items </button>
                 <button 
                    onClick={() => { setStatusFilter('Lost'); setCategoryFilter('All'); setSearchTerm(''); setSortBy('newest'); }} 
                    className={`status-filter-tab ${statusFilter === 'Lost' ? 'active' : ''}`}
                 > Lost Items </button>
            </div>

            {/* Aapka code (No Change) */}
            <div className="controls-container">
                <div className="category-filter-container">
                    {categories.map(category => (
                        <button key={category} onClick={() => setCategoryFilter(category)} className={`category-filter-btn ${categoryFilter === category ? 'active' : ''}`} > {category} </button>
                    ))}
                </div>
                <div className="sort-container">
                    <label htmlFor="sort-by" className="sort-label">Sort by:</label>
                    <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select" >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* --- UPDATED: Search Bar Structure for Icon --- */}
            {/* Ek extra div add kiya hai icon ke liye */}
            <div className="search-bar-container"> 
                <BsSearch className="search-icon" /> 
                <input 
                    type="text" 
                    placeholder={`Search ${statusFilter.toLowerCase()} items by name, description, or category...`} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar-input" // Padding CSS mein adjust hogi
                />
            </div>
            {/* --- End of Search Bar Update --- */}
            
            {/* Aapka code (No Change) */}
            <div className="item-list-grid">
                {filteredItems.map(item => (
                    <ItemCard key={item.id} item={item} /> 
                ))}
                {filteredItems.length === 0 && !loading && (
                    <p className="no-items-message">
                        No {statusFilter.toLowerCase()} items found matching your criteria.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ListingPage;