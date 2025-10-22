import firebase, { auth, db, FieldValue } from '../firebase';

// --- AUTHENTICATION & CORE ITEM MANAGEMENT ---
export const signUpUser = (email, password) => { return auth.createUserWithEmailAndPassword(email, password); };
export const signInUser = (email, password) => { return auth.signInWithEmailAndPassword(email, password); };
export const signInWithGoogle = () => { const provider = new firebase.auth.GoogleAuthProvider(); return auth.signInWithPopup(provider); };
export const signOutUser = () => { return auth.signOut(); };
export const sendPasswordReset = (email) => { return auth.sendPasswordResetEmail(email); }; // Yeh function add kar diya

export const postNewItem = (itemData, imageUrl) => {
    const uid = auth.currentUser.uid;
    // Location data bhi save ho raha hai
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

// --- DASHBOARD & REUNION ---
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

// --- CHAT MANAGEMENT ---
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

// --- USER PROFILE MANAGEMENT (FINAL FIX YAHAN HAI) ---
export const updateProfile = async (uid, updates) => {
    // update() ki jagah set() with merge:true use kiya hai
    // Yeh document na hone par naya banayega, aur agar hai toh update karega
    return db.collection('users').doc(uid).set(updates, { merge: true });
};

export const fetchAnyUserProfile = async (uid) => {
    return db.collection('users').doc(uid).get();
};