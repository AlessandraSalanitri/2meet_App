/* eslint-disable @next/next/no-img-element */
"use client";

const EventList = ({ events, onEventSelect }) => {
  return (
    <div className="event-list">
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="event-card">
            <img src={event.imageURL || "/placeholder.jpg"} alt={event.title || "Event Image"} className="event-image"/>
            <h2>{event.title || "Untitled Event"}</h2>
            <p>{event.description || "No description available."}</p>
            <p>📍 Location: {event.location || "Unknown"}</p>
            <p>📅 Date: {event.date || "Unknown"}</p>
            <p>⏰ Time: {event.time || "Unknown"}</p>
            <button onClick={() => onEventSelect(event)} className="book-button">
              Book
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;
