/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import React from "react";
import "@/styles/Booking.css";
import { handleBooking } from "../app/utils/bookingUtils";

const Booking = ({ selectedEvent, setSelectedEvent, setEvents }) => {
  const router = useRouter(); 

  if (!selectedEvent) return null;

  const confirmBooking = async () => {
    await handleBooking(selectedEvent, setEvents, setSelectedEvent);
  };

  return (
    <div className="booking-overlay">
      <div className="booking-popup">
        {selectedEvent.confirmed ? (
          <div className="booking-confirmation">
            <button
              className="close-modal"
              onClick={() => setSelectedEvent(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h2>Fantastic! You are booked in!</h2>
            <p>
              <strong>Event:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <img src="/assets/qrcode.png" alt="QR Code" className="qr-code" width="150"/>
            <p>Present this QR code at the entrance.</p>
            <button
              className="profile-link"
              onClick={() => router.push("/account")}
            >
              Go to Your Profile to See the Booking
            </button>
          </div>
        ) : (
          <>
            <h2>Confirm Your Booking</h2>
            <p>
              <strong>Event:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <div className="booking-actions">
              <button className="confirm-button" onClick={confirmBooking}>
                Yes, Confirm
              </button>
              <button
                className="cancel-button"
                onClick={() => setSelectedEvent(null)}
              >
                No, Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Booking;
