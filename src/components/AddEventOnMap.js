/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import AddEvent from "@/components/AddEvent";
import "@/styles/ViewOnMap.css"; 

const AddEventOnMap = ({ isAdmin, mapInstance, onEventAdded }) => {
  const [newEventPosition, setNewEventPosition] = useState(null); // To store clicked coordinates
  const [isAddEventMode, setIsAddEventMode] = useState(false); // Toggle for adding events

  // Handle map click
  const handleMapClick = (e) => {
    if (!isAdmin || !isAddEventMode) return; // Only allow admin users in Add Event mode
    const latlng = e.latlng;
    setNewEventPosition(latlng);
  };

  // Handle adding the event
  const handleAddEvent = async (eventData) => {
    try {
      const eventDoc = await addDoc(collection(db, "events"), eventData);
      const newEvent = { id: eventDoc.id, ...eventData };
      onEventAdded(newEvent); // Notify parent
      setNewEventPosition(null); // Reset position
      setIsAddEventMode(false); // Exit Add Event mode
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Attach click listener to map instance
  React.useEffect(() => {
    if (!mapInstance || !isAdmin) return;

    mapInstance.on("click", handleMapClick); 
    return () => mapInstance.off("click", handleMapClick); 
  }, [mapInstance, isAdmin, isAddEventMode]);

  return (
    <div>
      {/* Toggle Add Event Mode */}
      {isAdmin && (
        <button
          className={`add-event-mode-toggle ${isAddEventMode ? "active" : ""}`}
          onClick={() => setIsAddEventMode((prev) => !prev)}
        >
          {isAddEventMode ? "Disable Add Event Mode" : "Enable Add Event Mode"}
        </button>
      )}

      {/* Add Event Modal */}
      {newEventPosition && (
        <AddEvent
          event={{
            latitude: newEventPosition.lat,
            longitude: newEventPosition.lng,
          }}
          onClose={() => setNewEventPosition(null)}
          onEventAdded={handleAddEvent}
        />
      )}
    </div>
  );
};

export default AddEventOnMap;
