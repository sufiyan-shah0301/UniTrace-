// src/services/firebaseService.js

import firebase, { auth, db, FieldValue } from '../firebase';

// --- AUTHENTICATION & CORE ITEM MANAGEMENT (No changes) ---
export const signUpUser = (email, password) => { return auth.createUserWithEmailAndPassword(email, password); };
export const signInUser = (email, password) => { return auth.signInWithEmailAndPassword(email, password); };
export const signInWithGoogle = () => { const provider = new firebase.auth.GoogleAuthProvider(); return auth.signInWithPopup(provider); };
export const signOutUser = () => { return auth.signOut(); };

export const postNewItem = (itemData, imageUrl) => {
    const uid = auth.currentUser.uid;
    return db.collection('items').add({ ...itemData, imageUrl, ownerUID: uid, timestamp: FieldValue.serverTimestamp() });
};
export const fetchAllItems = (category = null, status = 'Found') => {
    let query = db.collection('items').where('status', '==', status);
    if (category) { query = query.where('category', '==', category); }
    return query.orderBy('timestamp', 'desc').get();
};
export const claimItem = (itemId, posterUID) => {
    const claimantUID = auth.currentUser.uid;
    return db.collection('items').doc(itemId).update({ status: 'Claim Pending', claimantUID: claimantUID });
};

// --- DASHBOARD & REUNION (No changes) ---
export const fetchMyPostedItems = () => {
    const uid = auth.currentUser.uid;
    return db.collection('items').where('ownerUID', '==', uid).orderBy('timestamp', 'desc').get();
};
export const fetchMyClaimedItems = () => {
    const uid = auth.currentUser.uid;
    return db.collection('items').where('claimantUID', '==', uid).orderBy('timestamp', 'desc').get();
};
export const markAsReunited = (itemId) => {
    return db.collection('items').doc(itemId).update({ status: 'Reunited' });
};

// --- CHAT MANAGEMENT (No changes) ---
export const sendMessage = async (chatId, senderId, text) => {
    return db.collection('chats').doc(chatId).collection('messages').add({
        sender: senderId,
        text: text,
        timestamp: FieldValue.serverTimestamp()
    });
};
export const subscribeToMessages = (chatId, callback) => {
    return db.collection('chats').doc(chatId).collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(messages);
        });
};

// --- USER PROFILE MANAGEMENT (Finalized) ---
export const updateProfile = async (uid, updates) => {
    return db.collection('users').doc(uid).update(updates);
};

export const fetchAnyUserProfile = async (uid) => {
    return db.collection('users').doc(uid).get();
};
//