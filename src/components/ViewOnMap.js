/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { fetchEventsFromServer } from "@/app/api/events/serverActions"; // server action
import SubNavBarEvents from "./SubNavBarEvents";
import Booking from "./Booking";
import AddEvent from "./AddEvent";
import "@/styles/ViewOnMapPage.css";

// default Leaflet marker icon
const DefaultIcon = L.icon({
  iconUrl: "/assets/marker-icon.png",
  iconRetinaUrl: "/assets/marker-icon-2x.png",
  shadowUrl: "/assets/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ViewOnMap = ({ isAdmin, onAddEvent }) => {
  const mapRef = useRef(null); // Map container reference
  const mapInstance = useRef(null); // Leaflet map instance
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newEventPosition, setNewEventPosition] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [isAddEventMode, setIsAddEventMode] = useState(false);

  // Fetch events from server
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await fetchEventsFromServer(); // Call server action
        setEvents(eventsData);
        setFilteredEvents(eventsData); // Initialize filtered events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on filters
  useEffect(() => {
    const filtered = events.filter((event) => {
      const matchesCategory =
        filters.category && filters.category !== "all"
          ? event.eventType === filters.category
          : true;
      const matchesLocation = filters.location
        ? event.location.toLowerCase().includes(filters.location.toLowerCase())
        : true;
      const matchesDate = filters.date ? event.date === filters.date : true;

      return matchesCategory && matchesLocation && matchesDate;
    });

    setFilteredEvents(filtered);
  }, [filters, events]);

  // Initialize the map
  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([51.505, -0.09], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance.current);
      if (isAdmin) {
        mapInstance.current.on("click", (e) => {
          onAddEvent(e.latlng); 
        });
      }
    }
  }, [isAdmin, onAddEvent]);

  // Update markers on the map when filtered events change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for filtered events
    filteredEvents.forEach((event) => {
      const lat = parseFloat(event.latitude);
      const lng = parseFloat(event.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`<strong>${event.title}</strong><br>${event.location}`);
        marker.on("click", () => setSelectedEvent(event));
      } else {
        console.error("Invalid coordinates for event:", event);
      }
    });
  }, [filteredEvents]);

  // Handle adding new event
  const handleEventAdded = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]); // Add to event list
    setFilteredEvents((prevEvents) => [...prevEvents, newEvent]); // Update filtered events
    setNewEventPosition(null); // Clear the map click position
    setShowAddEventModal(false); // Close the modal
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        {/* Sub Navigation Bar for Filters */}
        <SubNavBarEvents
          onCategoryClick={(filterType, value) => {
            setFilters((prev) => ({ ...prev, [filterType]: value }));
          }}
        />

        {/* Map container */}
        <div ref={mapRef} style={{ height: "600px", width: "100%" }} />

        {/* Add Event Mode Toggle */}
        {isAdmin && (
          <button
            className={`add-event-mode-toggle ${
              isAddEventMode ? "active" : ""
            }`}
            onClick={() => setIsAddEventMode((prev) => !prev)}
          >
            {isAddEventMode ? "Disable Add Event Mode" : "Enable Add Event Mode"}
          </button>
        )}
      </div>

         {/* Event Details Sidebar */}
         {selectedEvent && (
        <div className="event-details-sidebar">
          <button
            className="close-sidebar"
            onClick={() => setSelectedEvent(null)}
          >
            &times;
          </button>
          <img
            src={selectedEvent.imageURL}
            alt={selectedEvent.title}
            className="event-image"
          />
          <h2>{selectedEvent.title}</h2>
          <p>{selectedEvent.description}</p>
          <p>📍 Location: {selectedEvent.location}</p>
          <p>📅 Date: {selectedEvent.date}</p>
          <p>⏰ Time: {selectedEvent.time}</p>
          <p>🔒 Availability: {selectedEvent.availability}</p>
          <button
            className="book-button"
            onClick={() => setIsBookingModalOpen(true)}
          >
            Book
          </button>
        </div>
      )}

      Booking Confirmation Modal
      {isBookingModalOpen && selectedEvent && (
        <Booking
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setEvents={setEvents}
        />
      )}

      {/* Add Event Modal for Admin */}
      {showAddEventModal && isAdmin && newEventPosition && (
        <AddEvent
          event={{
            latitude: newEventPosition.lat,
            longitude: newEventPosition.lng,
          }}
          onClose={() => {
            setNewEventPosition(null);
            setShowAddEventModal(false);
          }}
          onEventAdded={handleEventAdded}
        />
      )}
    </div>
  );
};

export default ViewOnMap;
