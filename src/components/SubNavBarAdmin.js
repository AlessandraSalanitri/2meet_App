"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Use router for navigation
import "@/styles/SubNavBarAdmin.css";

const SubNavBarAdmin = ({ currentView, onChangeView }) => {
  const router = useRouter(); // Next.js router for navigation

  return (
    <div className="subnav-admin">
      <button
        className={currentView === "table" ? "active" : ""}
        onClick={() => onChangeView("table")}
      >
        View Events Table
      </button>

      <button
        className={currentView === "dashboard" ? "active" : ""}
        onClick={() => onChangeView("dashboard")}
      >
        View as User
      </button>

      <button
        className={currentView === "map" ? "active" : ""}
        onClick={() => onChangeView("map")}
      >
        View on Map
      </button>

      <button
        className={currentView === "bookings" ? "active" : ""}
        onClick={() => {
          router.push("/admin/bookings"); 
        }}
      >
        View Events Booking
      </button>
    </div>
  );
};

export default SubNavBarAdmin;
