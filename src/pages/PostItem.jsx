// src/pages/PostItem.jsx

import React, { useState } from 'react';
import { postNewItem } from '../services/firebaseService';
import { uploadImage } from '../utils/cloudinaryUploader'; 
import { useNavigate } from 'react-router-dom';

function PostItem() {
    const [itemData, setItemData] = useState({ name: '', description: '', category: 'Electronics', location: 'Campus' });
    const [status, setStatus] = useState('Found'); // NEW STATE for status selection (Found/Lost)
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) return alert('Please select an image.');

        setLoading(true);
        try {
            // STEP 1: UPLOAD IMAGE TO CLOUDINARY
            const imageUrl = await uploadImage(imageFile); 

            // STEP 2: SEND ALL DATA (INCLUDING URL) TO FIREBASE BACKEND
            // FIX: Use the dynamic 'status' state
            const finalItemData = { ...itemData, status: status }; 
            await postNewItem(finalItemData, imageUrl);

            alert('Item successfully posted!');
            navigate('/'); 
        } catch (error) {
            console.error('Submission failed:', error);
            alert(`Failed to post item: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>Post an Item</h2> {/* Generic Title */}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* FIX: STATUS SELECTOR */}
                <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    style={{ padding: '10px', backgroundColor: status === 'Found' ? '#d4edda' : '#f8d7da' }}
                >
                    <option value="Found">I Found an Item (Status: Found)</option>
                    <option value="Lost">I Lost an Item (Status: Lost)</option>
                </select>
                
                {/* Dynamically update the placeholder based on status */}
                <input 
                    type="text" 
                    placeholder={status === 'Found' ? "What did you find? (e.g., Black Earbuds)" : "What did you lose? (e.g., Red Wallet)"} 
                    value={itemData.name} 
                    onChange={(e) => setItemData({...itemData, name: e.target.value})}
                    required
                    style={{ padding: '10px' }}
                />
                
                <select 
                    value={itemData.category}
                    onChange={(e) => setItemData({...itemData, category: e.target.value})}
                    required
                    style={{ padding: '10px' }}
                >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Keys">Keys/Wallet</option>
                </select>
                <textarea 
                    placeholder="Description (color, location, unique marks)" 
                    value={itemData.description} 
                    onChange={(e) => setItemData({...itemData, description: e.target.value})}
                    required
                    style={{ padding: '10px' }}
                />
                
                {/* Input for the file */}
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImageFile(e.target.files[0])} 
                    required 
                    style={{ padding: '10px', border: '1px solid #ccc' }}
                />

                <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {loading ? 'Submitting...' : `Post ${status} Item`}
                </button>
            </form>
        </div>
    );
}

export default PostItem;