"use server";

import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

// Fetch all events
export async function fetchEventsFromServer() {
  try {
    const eventsSnapshot = await getDocs(collection(db, "events"));
    const eventsList = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return eventsList; 
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    throw new Error("Failed to fetch events.");
  }
}

// Add a new event
export async function addEventToServer(newEvent) {
  try {
    const docRef = await addDoc(collection(db, "events"), newEvent);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding event:", error);
    return { success: false, error: "Failed to add event. Please try again." };
  }
}

// Modify an existing event
export async function modifyEventOnServer(updatedEvent) {
  try {
    const eventRef = doc(db, "events", updatedEvent.id);

    const changes = Object.keys(updatedEvent).reduce((acc, key) => {
      acc[key] = updatedEvent[key];
      return acc;
    }, {});

    await updateDoc(eventRef, changes);
    return { success: true };
  } catch (error) {
    console.error("Error modifying event:", error);
    return { success: false, error: "Failed to modify event. Please try again." };
  }
}

// Cancel an event
export async function cancelEventOnServer(eventId) {
  try {
    const eventRef = doc(db, "events", eventId);
    await deleteDoc(eventRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: "Failed to delete event. Please try again." };
  }
}
