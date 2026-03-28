// src/services/storage.js
// Firebase Firestore for trip logs

const firebaseConfig = {
  apiKey: "AIzaSyC5qPfbvZkEyzCiOJSKqdCThKu1G-BOzpY",
  authDomain: "atlasfishing-f4674.firebaseapp.com",
  projectId: "atlasfishing-f4674",
  storageBucket: "atlasfishing-f4674.firebasestorage.app",
  messagingSenderId: "711232785759",
  appId: "1:711232785759:web:72b139958ca99637febaea"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const TRIPS_COLLECTION = 'trips';

export async function saveTrip(tripData) {
  try {
    const docRef = await db.collection(TRIPS_COLLECTION).add({
      date: tripData.date,
      river: tripData.river || '',
      catchCount: parseInt(tripData.catchCount || 0),
      notes: tripData.notes || '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    return { id: docRef.id, ...tripData };
  } catch (error) {
    console.error("Save trip error:", error);
    throw new Error("Failed to save trip. Please try again.");
  }
}

export async function getTrips() {
  try {
    const snapshot = await db.collection(TRIPS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Get trips error:", error);
    return [];
  }
}
