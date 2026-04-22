import { db } from "./firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

// Subscribe to real-time driver updates from Firestore
export const subscribeToDrivers = (callback) => {
    if (!db) return () => {};

    const driversRef = collection(db, "drivers");
    return onSnapshot(driversRef, (snapshot) => {
        const driversList = snapshot.docs.map(doc => ({
            // Firestore doesn't automatically put the doc 'id' inside the data payload, so we merge it here
            id: doc.id,
            ...doc.data()
        }));
        callback(driversList);
    }, (error) => {
        console.error("Error listening to drivers real-time stream:", error);
    });
};

// Update a driver's KYC status
export const updateDriverStatus = async (driverId, newStatus) => {
    if (!db) {
        console.warn("Firebase not configured. Cannot update status.");
        return;
    }

    const docRef = doc(db, "drivers", driverId);
    try {
        await updateDoc(docRef, { status: newStatus });
        console.log(`Driver ${driverId} status updated to ${newStatus}`);
    } catch (error) {
        console.error("Error updating driver status:", error);
        throw error;
    }
};
