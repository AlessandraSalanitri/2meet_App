import { collection, addDoc, doc, updateDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseConfig";

export const handleBooking = async (event, setEvents, setSelectedEvent) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("You need to log in to book an event!");
      return;
    }

    // Check if the user already booked the event
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      where("eventId", "==", event.id)
    );
    const existingBookingsSnapshot = await getDocs(bookingsQuery);

    if (!existingBookingsSnapshot.empty) {
      alert("You have already booked this event.");
      setSelectedEvent(null); // Close the modal
      return;
    }

    // Update availability
    const updatedAvailability = event.availability - 1;
    if (updatedAvailability < 0) {
      alert("Sorry, this event is fully booked!");
      setSelectedEvent(null); // Close the modal
      return;
    }

    const eventDocRef = doc(db, "events", event.id);
    await updateDoc(eventDocRef, { availability: updatedAvailability });

    // Save booking to Firestore
    const bookingData = {
      bookingDate: new Date().toISOString(),
      date: event.date,
      eventId: event.id,
      location: event.location,
      time: event.time,
      title: event.title,
      userId: user.uid,
    };
    await addDoc(collection(db, "bookings"), bookingData);

    // Update state
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id === event.id ? { ...ev, availability: updatedAvailability } : ev
      )
    );

    setSelectedEvent({ ...event, confirmed: true });
  } catch (err) {
    alert("Failed to confirm booking. Please try again.");
    console.error(err);
  }
};
