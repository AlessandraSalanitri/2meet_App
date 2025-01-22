/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import SubNavBarAdmin from "@/components/SubNavBarAdmin";
import AddEvent from "@/components/AddEvent";
import ModifyEvent from "@/components/ModifyEvent";
import CancelEvent from "@/components/CancelEvent";
import EventDashboard from "@/components/EventDashboard";
import ViewOnMap from "@/components/ViewOnMap";
import AdminViewBookings from "@/components/AdminViewBookings"; 
import "@/styles/AdminEventsTable.css";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState("table"); // Default to events table view
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);

  // Fetch all events from Firestore
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

  // Refresh events list
  const refreshEvents = async () => {
    try {
      const eventsSnapshot = await getDocs(collection(db, "events"));
      const eventsList = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
    } catch (err) {
      console.error("Error refreshing events:", err);
    }
  };

  return (
    <div className="admin-events-page">
      <h1 className="page-title">Manage Events</h1>

      {/* Sub Navigation Bar */}
      <SubNavBarAdmin
        currentView={currentView}
        onChangeView={(view) => setCurrentView(view)}
      />

      {/* View for Events Table */}
      {currentView === "table" && (
        <>
          <div className="add-event-container">
            <button className="add-event-button" onClick={() => setShowAddPopup(true)}>
              + Add New Event
            </button>
          </div>

          <div className="events-table-container">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Image</th>
                  <th>Event Type</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td className="description-cell">{event.description}</td>
                    <td>{event.date}</td>
                    <td>{event.time}</td>
                    <td>{event.location}</td>
                    <td>{event.latitude}</td>
                    <td>{event.longitude}</td>
                    <td>
                      {event.imageURL ? (
                        <img
                          src={event.imageURL}
                          alt={event.title}
                          className="event-image"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>{event.eventType}</td>
                    <td>{event.availability}</td>
                    <td className="action-buttons">
                      <button
                        className="modify-button"
                        onClick={() => setEditingEvent(event)}
                      >
                        Modify
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => setDeletingEventId(event.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* View for User Dashboard */}
      {currentView === "dashboard" && <EventDashboard />}

      {/* View for Map */}
      {currentView === "map" && (
        <ViewOnMap
          isAdmin={true}
          onAddEvent={(latlng) => {
            setEditingEvent(null);
            setShowAddPopup(true);
            setEditingEvent({
              latitude: latlng.lat,
              longitude: latlng.lng,
              title: "",
              description: "",
              date: "",
              time: "",
              location: "",
              imageURL: "",
              eventType: "",
              availability: "",
            });
          }}
        />
      )}

      {/* View for Bookings Summary */}
      {currentView === "events" && <AdminViewBookings />}

      {/* Add Event Popup */}
      {showAddPopup && (
        <AddEvent
          event={editingEvent}
          onClose={() => {
            setShowAddPopup(false);
            setEditingEvent(null);
          }}
          onEventAdded={() => {
            refreshEvents();
            setShowAddPopup(false);
            setEditingEvent(null);
          }}
        />
      )}

      {/* Modify Event Popup */}
      {editingEvent && !showAddPopup && (
        <ModifyEvent
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onEventModified={refreshEvents}
        />
      )}

      {/* Delete Event Popup */}
      {deletingEventId && (
        <CancelEvent
          eventId={deletingEventId}
          onClose={() => setDeletingEventId(null)}
          onEventDeleted={refreshEvents}
        />
      )}
    </div>
  );
};

export default AdminEvents;
