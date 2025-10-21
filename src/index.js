// src/index.js - FIX for "render is not a function"

import React from 'react';
// FIX: Import createRoot from 'react-dom/client' for React 18
import { createRoot } from 'react-dom/client'; 
import App from './App';
import './index.css';

// Find the container element
const container = document.getElementById('root');

// CRITICAL FIX: Use the new createRoot API
if (container) {
    const root = createRoot(container); 
    
    // Render the application
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    // Fallback error, just in case the root element isn't found
    console.error("The root element with id 'root' was not found in the document.");
}