import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function subscribeToCollection(collectionName, callback) {
  if (!db) return () => {};

  const collectionRef = collection(db, collectionName);
  return onSnapshot(
    collectionRef,
    (snapshot) => {
      const items = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      callback(items);
    },
    (error) => {
      console.error(`Error listening to ${collectionName} stream:`, error);
    }
  );
}

export const subscribeToBuses = (callback) =>
  subscribeToCollection("buses", callback);

export const subscribeToConductors = (callback) =>
  subscribeToCollection("conductors", callback);