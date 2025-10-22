import React, { useState, useEffect } from 'react'; // Added useEffect for preview cleanup
import { postNewItem } from '../services/firebaseService';
import { uploadImage } from '../utils/cloudinaryUploader'; 
import { useNavigate } from 'react-router-dom';

// Nayi CSS file import ki
import '../styles/PostItem.css'; 

// --- ADDED: Notification component ko import kiya ---
import Notification from '../components/Notification'; 
// --------------------------------------------------

// Aapka code (No Change)
const categories = ['Electronics', 'Keys', 'Books', 'Bags', 'Clothing', 'Other'];

function PostItem() {
    // --- UPDATED: itemData mein location ko empty start kiya ---
    const [itemData, setItemData] = useState({ 
        name: '', 
        description: '', 
        category: categories[0], 
        location: '' // Location ab yahan se handle hoga, default empty
    });
    // ----------------------------------------------------------
    // Aapka code (No Change)
    const [status, setStatus] = useState('Found'); 
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ message: '', type: '' });

    // handleSubmit mein location check add kiya hai
    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '' }); 
        if (!imageFile) {
             setNotification({ message: 'Please select an image.', type: 'error' });
             // Aap chahein toh yahan original alert bhi rakh sakte hain
             // return alert('Please select an image.'); 
             return; 
        }
        // --- ADDED: Location check ---
        if (!itemData.location || !itemData.location.trim()) { // Check if location is empty or just whitespace
             setNotification({ message: 'Please enter the location.', type: 'error'});
             return; // Stop submission if location is empty
        }
        // -----------------------------
        setLoading(true);
        try {
            const imageUrl = await uploadImage(imageFile); 
            const finalItemData = { ...itemData, status: status }; 
            await postNewItem(finalItemData, imageUrl);
            setNotification({ message: 'Item successfully posted!', type: 'success' });
            setTimeout(() => {
                 navigate('/'); 
            }, 1500); 
        } catch (error) {
            console.error('Submission failed:', error);
            setNotification({ message: `Failed to post item: ${error.message || 'Unknown error'}`, type: 'error' });
            setLoading(false); 
        } 
    };

    // Aapka handleFileChange (No change)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setImagePreview(reader.result); };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    // Aapka useEffect cleanup (No change)
     useEffect(() => {
        return () => {
            if (imagePreview) { URL.revokeObjectURL(imagePreview); }
        };
    }, [imagePreview]);


    return (
        // Aapka code (No change)
        <div className="post-item-container"> 
            
            {/* Notification Component (Aapka code - No change) */}
            <Notification 
                message={notification.message} 
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })} 
            />

            <div className="post-item-card"> 
                <h2 className="post-item-title">Post an Item</h2> 

                <form onSubmit={handleSubmit} className="post-item-form">
                    
                    {/* Status Selector (Aapka code - No change) */}
                    <div>
                        <label htmlFor="item-status" className="form-label">Are you posting a Found or Lost item?</label>
                        <select 
                            id="item-status"
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            className="form-select" 
                            style={{ backgroundColor: status === 'Found' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.15)' }} 
                        >
                            <option value="Found">I Found an Item</option>
                            <option value="Lost">I Lost an Item</option>
                        </select>
                    </div>
                    
                    {/* Item Name (Aapka code - No change) */}
                    <div>
                         <label htmlFor="item-name" className="form-label">{status === 'Found' ? "What did you find?" : "What did you lose?"}</label>
                        <input 
                            id="item-name"
                            type="text" 
                            placeholder={status === 'Found' ? "e.g., Black Earbuds" : "e.g., Red Wallet"} 
                            value={itemData.name} 
                            onChange={(e) => setItemData({...itemData, name: e.target.value})}
                            required
                            className="form-input"
                        />
                    </div>
                    
                    {/* Category (Aapka code - No change) */}
                    <div>
                         <label htmlFor="item-category" className="form-label">Category</label>
                        <select 
                            id="item-category"
                            value={itemData.category}
                            onChange={(e) => setItemData({...itemData, category: e.target.value})}
                            required
                            className="form-select"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* --- ADDED: Location Input Field --- */}
                    <div>
                        <label htmlFor="item-location" className="form-label">
                            {status === 'Found' ? "Location Found" : "Last Known Location"}
                        </label>
                        <input
                            id="item-location"
                            type="text"
                            placeholder="e.g., Library 2nd Floor, Near Canteen Gate"
                            value={itemData.location} 
                            // Update itemData state on change
                            onChange={(e) => setItemData({...itemData, location: e.target.value})} 
                            required // Make location required
                            className="form-input" // Reuse existing style
                        />
                    </div>
                    {/* --- End of Location Input --- */}

                    {/* Description (Aapka code - No change) */}
                    <div>
                         <label htmlFor="item-description" className="form-label">Description</label>
                        <textarea 
                            id="item-description"
                            placeholder="Color, brand, unique marks, etc." 
                            value={itemData.description} 
                            onChange={(e) => setItemData({...itemData, description: e.target.value})}
                            required
                            className="form-textarea"
                        />
                    </div>
                    
                    {/* File Input and Preview (Aapka code - No change) */}
                    <div>
                         <label htmlFor="item-image-upload" className="form-file-label">Upload Image</label>
                         <input 
                            id="item-image-upload" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            required 
                            className="form-file-input" 
                         />
                         {imageFile && <span className="file-name">{imageFile.name}</span>}
                         {imagePreview && ( <div className="image-preview"> <img src={imagePreview} alt="Selected item preview"/> </div> )}
                    </div>

                    {/* Submit Button (Aapka code - No change) */}
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Submitting...' : `Post ${status} Item`}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostItem;