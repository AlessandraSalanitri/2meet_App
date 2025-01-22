"use client";

import React, { useState, useEffect } from "react";
import { fetchSummaryBookings } from "@/app/api/bookings/serverActions"; 
import SubNavBarAdmin from "@/components/SubNavBarAdmin";
import "@/styles/AdminViewBookings.css";

const AdminViewBookings = () => {
  const [bookingsSummary, setBookingsSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("bookings");

  useEffect(() => {
    let isMounted = true;
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const bookings = await fetchSummaryBookings(); // Correct function call
        if (isMounted) setBookingsSummary(bookings);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to fetch bookings. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="admin-view-bookings">
      <SubNavBarAdmin
        currentView={currentView}
        onChangeView={(view) => {
          if (view === "bookings") return;
          window.location.href = view;
        }}
      />

      <h1>User Bookings Summary</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : bookingsSummary.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Event Date</th>
              <th>Event Time</th>
              <th>Location</th>
              <th>Total Bookings</th>
            </tr>
          </thead>
          <tbody>
            {bookingsSummary.map((event, index) => (
              <tr key={index}>
                <td>{event.title}</td>
                <td>{event.date}</td>
                <td>{event.time}</td>
                <td>{event.location}</td>
                <td>{event.bookingsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminViewBookings;
