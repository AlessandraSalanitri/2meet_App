"use client";

import { useRouter } from "next/navigation"; // Next.js router
import useProtectedRoute from "@/hooks/useProtectedRoute"; 
import "@/styles/UserDashboard.css"; 

const UserDashboard = () => {
  const router = useRouter();
  const isLoading = useProtectedRoute("regular"); 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <h1>Welcome to 2meet</h1>

      <div className="dashboard-cards">
        {/* Card 1: Go to Your Account */}
        <div className="dashboard-card" onClick={() => router.push("/account")}>
          <h2>Your Booking</h2>
          <p>Manage your bookings</p>
        </div>

        {/* Card 2: Go to Events */}
        <div className="dashboard-card" onClick={() => router.push("/events")}>
          <h2>Go to Events</h2>
          <p>Explore and book your favorite events.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
