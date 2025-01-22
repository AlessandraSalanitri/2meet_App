"use client";

import React, { useState, useEffect } from "react";
import { fetchEventsFromServer } from "@/app/api/events/serverActions"; // server action
import EventList from "@/components/EventList";
import Booking from "@/components/Booking";
import SubNavBarEvents from "@/components/SubNavBarEvents";
import "@/styles/EventDashboard.css";

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const events = await fetchEventsFromServer(); 
        setEvents(events);
      } catch (err) {
        setError("Failed to fetch events. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter and sort logic
  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory
      ? event.eventType === selectedCategory
      : true;

    const matchesLocation = filters.location
      ? event.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    const matchesDate = filters.date ? event.date === filters.date : true;

    const matchesSearchTerm = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesLocation && matchesDate && matchesSearchTerm;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (filters.sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (filters.sortBy === "location") {
      return a.location.localeCompare(b.location);
    } else if (filters.sortBy === "availability") {
      return b.availability - a.availability;
    }
    return 0;
  });

  return (
    <div className="event-dashboard">
      {/* SubNavBar for Filters and Categories */}
      <SubNavBarEvents
        onCategoryClick={(filterType, value) => {
          if (value === "all") {
            setSelectedCategory("");
            setFilters({});
            setSearchTerm("");
          } else if (filterType === "location") {
            setFilters((prev) => ({ ...prev, location: value }));
          } else if (filterType === "date") {
            setFilters((prev) => ({ ...prev, date: value }));
          } else if (filterType === "eventType") {
            setSelectedCategory(value);
          }
        }}
        onApplyFilters={(appliedFilters) => {
          setFilters((prev) => ({
            ...prev,
            sortBy: appliedFilters.sortBy,
          }));
        }}
      />

      {/* Loading/Error Handling */}
      {loading && <p>Loading events...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Event List */}
      {!loading && !error && (
        <EventList
          events={sortedEvents}
          onEventSelect={(event) => setSelectedEvent(event)}
        />
      )}

      {/* Booking Modal */}
      {selectedEvent && (
        <Booking
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setEvents={setEvents}
        />
      )}
    </div>
  );
};

export default EventDashboard;
