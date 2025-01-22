"use client";

import React, { useState } from "react";
import { addEventToServer } from "@/app/api/events/serverActions"; // server action
import "@/styles/AdminModals.css";

const AddEvent = ({ event, onClose, onEventAdded }) => {
  // Initialize state with provided event data (e.g., latitude, longitude)
  const [newEvent, setNewEvent] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    time: event?.time || "",
    location: event?.location || "",
    latitude: event?.latitude || "", // Pre-filled latitude
    longitude: event?.longitude || "", // Pre-filled longitude
    imageURL: event?.imageURL || "",
    eventType: event?.eventType || "",
    availability: event?.availability || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  // calling the function from the server-side to add event
  const handleAddEvent = async () => {
    setLoading(true);
    const response = await addEventToServer(newEvent);
    setLoading(false);

    if (response.success) {
      alert("Event added successfully!");
      onEventAdded(); // Notify parent
      onClose(); // Close modal
    } else {
      setError(response.error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Event</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={newEvent.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            type="text"
            id="time"
            name="time"
            placeholder="e.g., 10:00AM"
            value={newEvent.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Event Location"
            value={newEvent.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            placeholder="Latitude"
            value={newEvent.latitude}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            placeholder="Longitude"
            value={newEvent.longitude}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageURL">Image URL</label>
          <input
            type="text"
            id="imageURL"
            name="imageURL"
            placeholder="Paste image link here"
            value={newEvent.imageURL}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventType">Event Type</label>
          <select
            id="eventType"
            name="eventType"
            value={newEvent.eventType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Event Type
            </option>
            <option value="learning">Learning</option>
            <option value="festival">Festival</option>
            <option value="gigs">Gigs</option>
            <option value="clubs">Clubs</option>
            <option value="sports">Sports</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="availability">Availability</label>
          <input
            type="number"
            id="availability"
            name="availability"
            placeholder="Number of Seats"
            value={newEvent.availability}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button
            className="add-button"
            onClick={handleAddEvent}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Event"}
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
