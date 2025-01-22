"use client";

import React, { useState } from "react";
import { modifyEventOnServer } from "@/app/api/events/serverActions"; // server action
import "@/styles/AdminModals.css";

const ModifyEvent = ({ event, onClose, onEventModified }) => {
  const [updatedEvent, setUpdatedEvent] = useState(event);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent((prev) => ({ ...prev, [name]: value }));
  };

  // calling the function from the server-side to modify event
  const handleModify = async () => {
    setLoading(true);
    const response = await modifyEventOnServer(updatedEvent);
    setLoading(false);

    if (response.success) {
      alert("Event updated successfully!");
      onEventModified(); // Notify parent
      onClose(); // Close modal
    } else {
      setError(response.error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Modify Event</h2>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Event Title"
            value={updatedEvent.title}
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
            value={updatedEvent.description}
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
            value={updatedEvent.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={updatedEvent.time}
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
            value={updatedEvent.location}
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
            value={updatedEvent.latitude}
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
            value={updatedEvent.longitude}
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
            value={updatedEvent.imageURL}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventType">Event Type</label>
          <select
            id="eventType"
            name="eventType"
            value={updatedEvent.eventType}
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
            value={updatedEvent.availability}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button
            className="save-button"
            onClick={handleModify}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyEvent;
