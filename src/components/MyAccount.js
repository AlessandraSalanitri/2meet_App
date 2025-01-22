/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig"; // Firebase imports
import { fetchUserBookings } from "@/app/api/bookings/serverActions"; 
import "@/styles/MyAccount.css";

const MyAccount = () => {
  const [currentBookings, setCurrentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const now = new Date();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true); // Start loading state
        const user = auth.currentUser;

        if (!user) {
          if (!loading) return;
          router.push("/login");
          return;
        }

        // Fetch bookings using the server action
        const bookings = await fetchUserBookings(user.uid);

        // Separate current and past bookings based on event date
        const current = bookings.filter(
          (booking) => new Date(booking.date) >= now
        );
        const past = bookings.filter((booking) => new Date(booking.date) < now);

        setCurrentBookings(current);
        setPastBookings(past);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false); 
      }
    };

    fetchBookings();
  }, [router]); 

  const handleCancelBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId)); 
      setCurrentBookings((prev) =>
        prev.filter((booking) => booking.id !== bookingId)
      ); // Remove from current bookings list
      alert("Booking canceled successfully.");
    } catch (err) {
      console.error("Error canceling booking:", err);
      setError("Failed to cancel booking. Please try again.");
    }
  };

  const toggleBookingDetails = (bookingId) => {
    setExpandedBooking((prev) => (prev === bookingId ? null : bookingId));
  };

  return (
    <div className="my-account">
      <h1>My Account</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {/* Current Bookings */}
          <div className="bookings-section">
            <h2>Current Bookings</h2>
            {currentBookings.length === 0 ? (
              <p>No current bookings found.</p>
            ) : (
              <ul className="bookings-list">
                {currentBookings.map((booking) => (
                  <li key={booking.id} className="booking-item">
                    <div className="booking-summary">
                      <span className="booking-title">{booking.title}</span>
                      <div className="booking-actions">
                        <button
                          className="toggle-details-button"
                          onClick={() => toggleBookingDetails(booking.id)}
                        >
                          {expandedBooking === booking.id ? "▲" : "▼"}
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                    {expandedBooking === booking.id && (
                      <div className="booking-details">
                        <p>
                          <strong>Event Date:</strong> {booking.date}
                        </p>
                        <p>
                          <strong>Event Location:</strong> {booking.location}
                        </p>
                        <p>
                          <strong>Event Time:</strong> {booking.time}
                        </p>
                        <div className="qr-code-container">
                          <p>
                            <strong>Your QR Code:</strong>
                          </p>
                          <img
                            src="/assets/qrcode.png"
                            alt="QR Code for Booking"
                            className="qr-code"
                          />
                          <p>Show this QR code at the event entry</p>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Past Bookings */}
          <div className="bookings-section">
            <h2>Past Bookings</h2>
            {pastBookings.length === 0 ? (
              <p>No past bookings found.</p>
            ) : (
              <ul className="bookings-list">
                {pastBookings.map((booking) => (
                  <li key={booking.id} className="booking-item">
                    <div className="booking-summary">
                      <span className="booking-title">{booking.title}</span>
                      <button
                        className="toggle-details-button"
                        onClick={() => toggleBookingDetails(booking.id)}
                      >
                        {expandedBooking === booking.id ? "▲" : "▼"}
                      </button>
                    </div>
                    {expandedBooking === booking.id && (
                      <div className="booking-details">
                        <p>
                          <strong>Event Date:</strong> {booking.date}
                        </p>
                        <p>
                          <strong>Event Location:</strong> {booking.location}
                        </p>
                        <p>
                          <strong>Event Time:</strong> {booking.time}
                        </p>
                        <div className="qr-code-container">
                          <p>
                            <strong>Your QR Code:</strong>
                          </p>
                          <img
                            src="/assets/qrcode.png"
                            alt="QR Code for Booking"
                            className="qr-code"
                          />
                          <p>This QR code has expired</p>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <button className="back-to-events" onClick={() => router.push("/events")}>
        Go Back to Events
      </button>
    </div>
  );
};

export default MyAccount;
