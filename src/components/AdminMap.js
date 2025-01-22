"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import ViewOnMap from "@/components/ViewOnMap";
import AddEvent from "@/components/AddEvent";
import "@/styles/AdminMap.css";

const AdminMap = () => {
  const [events, setEvents] = useState([]);
  const [newEventPosition, setNewEventPosition] = useState(null);
  const [showAddEventPopup, setShowAddEventPopup] = useState(false);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // adding events
  const handleMapClick = (latlng) => {
    setNewEventPosition(latlng); // 
    setShowAddEventPopup(true); // 
  };

  // Add a new event
  const handleAddEvent = async (newEvent) => {
    try {
      const eventDoc = await addDoc(collection(db, "events"), newEvent);
      setEvents((prev) => [
        ...prev,
        { id: eventDoc.id, ...newEvent }, // Add new event to local state
      ]);
      setShowAddEventPopup(false); // Close modal
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  return (
    <div className="admin-map">
      <h2>Admin Map</h2>
      <ViewOnMap
        events={events}
        onMarkerClick={(event) => alert(`Viewing event: ${event.title}`)}
        onEventAdded={(newEvent) => setEvents((prev) => [...prev, newEvent])}
        isAdmin={true}
      />
      {showAddEventPopup && newEventPosition && (
        <AddEvent
          event={{
            latitude: newEventPosition.lat,
            longitude: newEventPosition.lng,
          }}
          onClose={() => setShowAddEventPopup(false)}
          onEventAdded={handleAddEvent}
        />
      )}
    </div>
  );
};

export default AdminMap;
