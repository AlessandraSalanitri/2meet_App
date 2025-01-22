"use client";

import { useRouter } from "next/navigation"; 
import useProtectedRoute from "@/hooks/useProtectedRoute"; // Admin only access
import "@/styles/AdminDashboard.css"; 

const AdminDashboard = () => {
  const router = useRouter();
  const isLoading = useProtectedRoute("admin"); // access to admins only

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Welcome to Admin Features</h1>

      <div className="dashboard-cards">
        {/* Card 1: Go to Users Management */}
        <div className="dashboard-card" onClick={() => router.push("/adminusers")}>
          <h2>Users</h2>
          <p>View all users, create new ones, and manage credentials.</p>
        </div>

        {/* Card 2: Go to Events Management */}
        <div className="dashboard-card" onClick={() => router.push("/adminevents")}>
          <h2>Go to Events</h2>
          <p>View all events, create new ones, modify, or delete an event.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
