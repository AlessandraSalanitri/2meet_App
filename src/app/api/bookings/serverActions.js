"use server";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

// Fetch user bookings (for "My Account" page)
export async function fetchUserBookings(userId) {
  if (!userId) {
    throw new Error("User is not authenticated");
  }

  try {
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", userId)
    );
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookingsList = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bookingsList; //for the user
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw new Error("Failed to fetch bookings.");
  }
}

// Fetch summary bookings (for admin view)
export async function fetchSummaryBookings() {
  try {
    const bookingsSnapshot = await getDocs(collection(db, "bookings"));
    const bookingsList = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Summarize bookings by event for admin
    const summary = bookingsList.reduce((acc, booking) => {
      const eventKey = booking.eventId; 
      if (!acc[eventKey]) {
        acc[eventKey] = {
          title: booking.title,
          date: booking.date,
          time: booking.time,
          location: booking.location,
          bookingsCount: 0,
        };
      }
      acc[eventKey].bookingsCount += 1;
      return acc;
    }, {});

    return Object.values(summary); 
  } catch (error) {
    console.error("Error fetching summary bookings:", error);
    throw new Error("Failed to fetch summary bookings.");
  }
}
