"use client";

import React, { useState } from "react";
import { cancelEventOnServer } from "@/app/api/events/serverActions"; // server action
import "@/styles/AdminModals.css";

const CancelEvent = ({ eventId, onClose, onEventDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    const response = await cancelEventOnServer(eventId);
    setLoading(false);

    if (response.success) {
      alert("Event deleted successfully!");
      onEventDeleted(); // Notify parent
      onClose(); // Close modal
    } else {
      setError(response.error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete this event? <br />
          <strong>This action cannot be undone.</strong>
        </p>
        {error && <p className="error">{error}</p>}
        <div className="modal-actions">
          <button
            className="delete-button"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Confirm"}
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelEvent;
