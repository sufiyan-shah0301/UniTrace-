// src/firebase.js

import firebase from 'firebase/app'; 
import 'firebase/auth'; 
import 'firebase/firestore'; 

const firebaseConfig = {
    // Your complete project configuration keys obtained from Firebase Console
    apiKey: "AIzaSyDznw0f14Wb_sHjGyUwxFWBg_rQ93kzp4M",
    authDomain: "campus-lost-and-found-6bd29.firebaseapp.com",
    projectId: "campus-lost-and-found-6bd29",
    storageBucket: "campus-lost-and-found-6bd29.firebasestorage.app",
    messagingSenderId: "935884095229",
    appId: "1:935884095229:web:fe617cfa7abce011f44894",
};

// Initializes the Firebase app only if it hasn't been initialized already
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// EXPORTS: Export the initialized services
export const auth = firebase.auth();
export const db = firebase.firestore();

// Export FieldValue for server timestamps and atomic updates
export const FieldValue = firebase.firestore.FieldValue; 

// Note: We are also exporting the base 'firebase' module for GoogleAuthProvider usage
export default firebase;