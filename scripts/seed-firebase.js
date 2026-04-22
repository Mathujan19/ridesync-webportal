import { db } from "../src/services/firebase.js";
import { collection, doc, setDoc } from "firebase/firestore";

// Run this script inside your components or via a temp button once you add your .env keys!
export const seedFirebaseDatabase = async () => {
    if (!db) {
        console.error("Firebase is not initialized. Add your keys to .env.local first!");
        return;
    }

    console.log("Seeding Firestore with initial mock data...");

    const mockDrivers = [
        { id: "S-001", name: "Kamal Perera", status: "Pending Verification", rating: 4.8, vehicles: 1, joined: "Oct 12, 2025" },
        { id: "S-002", name: "Nimal Silva", status: "Under Review", rating: 4.5, vehicles: 1, joined: "Oct 14, 2025" },
        { id: "S-003", name: "Sunil Silva", status: "Documents Rejected", rating: 3.9, vehicles: 2, joined: "Oct 15, 2025" },
        { id: "S-004", name: "Anura Kumara", status: "Pending Verification", rating: 4.9, vehicles: 1, joined: "Oct 16, 2025" },
    ];

    const mockDispatchReqs = [
        { id: "req-1", type: "VIP Passenger Pickup", from: "Galle Face Hotel", to: "BIA Airport", status: "Pending" },
        { id: "req-2", type: "Premium Sedan", from: "One Galle Face", to: "Mount Lavinia", status: "Pending" }
    ];

    try {
        // Seed Drivers
        for (const driver of mockDrivers) {
            await setDoc(doc(collection(db, "drivers"), driver.id), driver);
        }
        
        // Seed Dispatch Queue
        for (const req of mockDispatchReqs) {
            await setDoc(doc(collection(db, "dispatchQueue"), req.id), req);
        }

        // Seed SOS T-102 Chat
        const msg1 = { text: "Help, the passenger is acting extremely aggressive.", sender: "driver", timestamp: new Date(Date.now() - 60000) };
        await setDoc(doc(collection(db, "sosAlerts", "T-102", "messages"), "msg-1"), msg1);

        console.log("✅ Seeding Complete! Refresh the dashboard!");
    } catch (err) {
        console.error("Failed to seed database:", err);
    }
};
