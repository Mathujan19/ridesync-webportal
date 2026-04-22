import { db } from "./firebase";
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

// Listen to Dispatch Queue requests
export const subscribeToDispatchQueue = (callback) => {
    if (!db) return () => {};

    const queueRef = collection(db, "dispatchQueue");
    // Ideally we would query(queueRef, where("status", "==", "Pending"))
    return onSnapshot(queueRef, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(requests);
    }, (error) => {
        console.error("Error listening to dispatch queue:", error);
    });
};

// Assign or Reject a dispatch queue request
export const updateDispatchRequest = async (reqId, newStatus) => {
    if (!db) return;
    const docRef = doc(db, "dispatchQueue", reqId);
    try {
        await updateDoc(docRef, { status: newStatus });
    } catch (error) {
        console.error("Error updating dispatch request:", error);
        throw error;
    }
};

// Listen to SOS Chat Messages for a specific trip
export const subscribeToSosChat = (tripId, callback) => {
    if (!db) return () => {};
    // Ensure tripId is provided, fallback to a main chat document if building a generic mock
    const chatRef = collection(db, "sosAlerts", tripId, "messages");
    const q = query(chatRef, orderBy("timestamp", "asc"));
    
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(messages);
    }, (error) => {
        console.error("Error listening to SOS chat:", error);
    });
};

// Send an SOS response from Admin
export const sendSosMessage = async (tripId, text) => {
    if (!db) return;
    const chatRef = collection(db, "sosAlerts", tripId, "messages");
    try {
        await addDoc(chatRef, {
            text: text,
            sender: "admin",
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error sending SOS message:", error);
        throw error;
    }
};
