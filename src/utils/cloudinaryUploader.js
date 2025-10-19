// src/utils/cloudinaryUploader.js
import axios from 'axios';

// --- CLOUDINARY CONFIGURATION (WITH EXPOSED API KEY FOR TESTING) ---
const CLOUD_NAME = "dlyvkfykv"; 
const UPLOAD_PRESET = "LOST_FOUND"; 
// WARNING: THIS KEY IS NOW EXPOSED IN THE FRONTEND. DO NOT DEPLOY LIKE THIS.
const CLOUDINARY_API_KEY = "618348428123118"; 
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;


export const uploadImage = async (file) => {
    if (!file) {
        throw new Error("No file selected for upload.");
    }
    
    // TIMESTAMP IS REQUIRED WHEN SENDING API_KEY
    const timestamp = Date.now() / 1000;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    // 1. ADD API KEY AND TIMESTAMP FOR TESTING
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp);

    try {
        console.log("Starting image upload to Cloudinary...");
        
        // Use axios.post without explicit Content-Type headers
        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
        
        // Cloudinary's successful response contains the secure URL
        const imageUrl = response.data.secure_url;
        console.log("Image uploaded successfully. URL:", imageUrl);
        return imageUrl; 

    } catch (error) {
        // Log the full error to the console for debugging
        console.error("Cloudinary upload failed:", error); 
        
        let errorMessage = "Failed to upload image. Please try again.";
        if (error.response && error.response.data && error.response.data.error) {
            errorMessage = `Upload Error: ${error.response.data.error.message}`;
        }
        throw new Error(errorMessage);
    }
};