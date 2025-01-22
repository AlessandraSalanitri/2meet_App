"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaMapMarkerAlt, FaCalendarAlt, FaSnowflake } from "react-icons/fa";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { BiDrink, BiMusic, BiFoodMenu, BiBook, BiSun } from "react-icons/bi";
import "@/styles/SubNavBarEvents.css";

const SubNavBarEvents = ({ onCategoryClick, onApplyFilters }) => {
  const [activeCategory, setActiveCategory] = useState(""); // Track active category
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current view is the map view
  const isMapView = pathname === "/view-on-map-page";

  // Handle category selection
  const handleCategorySelect = (filterType, value) => {
    setActiveCategory(value); // Update active category
    onCategoryClick(filterType, value); // Trigger parent callback
  };

  return (
    <div className="subnav-container">
      {/* Search and Sort Section */}
      <div className="search-bar-container">
        {/* Search by Location */}
        <div className="search-input-group">
          <FaMapMarkerAlt />
          <input
            type="text"
            placeholder="Search by Location"
            className="search-input"
            onChange={(e) => onCategoryClick("location", e.target.value)}
          />
        </div>

        {/* Search by Date */}
        <div className="search-input-group">
          <FaCalendarAlt />
          <input
            type="date"
            className="search-input"
            onChange={(e) => onCategoryClick("date", e.target.value)}
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="sort-by-container">
          <label htmlFor="sort-by" className="sort-by-label">
            Sort By:
          </label>
          <select
            id="sort-by"
            className="sort-by-select"
            onChange={(e) => onApplyFilters({ sortBy: e.target.value })}
          >
            <option value="">Select</option>
            <option value="date">Date</option>
            <option value="location">Location</option>
            <option value="availability">Availability</option>
          </select>
        </div>

        {/* Toggle View Button */}
        <button
          className="view-on-map-btn"
          onClick={() => {
            if (isMapView) {
              router.push("/events"); // Redirect to the events list
            } else {
              router.push("/view-on-map-page"); // Redirect to the map view
            }
          }}
        >
          <FaMapMarkerAlt className="view-on-map-icon" />
          <span className="view-on-map-text">
            {isMapView ? "Return to Events" : "View on Map"}
          </span>
        </button>
      </div>

      {/* Categories Section */}
      <div className="categories-container">
        <button
          className={`category-item ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => handleCategorySelect("all", "all")}
        >
          <BiSun className="icon" />
          All Events
        </button>
        <button
          className={`category-item ${activeCategory === "learning" ? "active" : ""}`}
          onClick={() => handleCategorySelect("eventType", "learning")}
        >
          <BiBook className="icon" />
          Learning
        </button>
        <button
          className={`category-item ${activeCategory === "clubs" ? "active" : ""}`}
          onClick={() => handleCategorySelect("eventType", "clubs")}
        >
          <BiMusic className="icon" />
          Clubs
        </button>
        <button
          className={`category-item ${activeCategory === "gigs" ? "active" : ""}`}
          onClick={() => handleCategorySelect("eventType", "gigs")}
        >
          <BiDrink className="icon" />
          Gigs
        </button>
        <button
          className={`category-item ${activeCategory === "festival" ? "active" : ""}`}
          onClick={() => handleCategorySelect("eventType", "festival")}
        >
          <BiFoodMenu className="icon" />
          Festivals
        </button>
        <button
          className={`category-item ${activeCategory === "sports" ? "active" : ""}`}
          onClick={() => handleCategorySelect("eventType", "sports")}
        >
          <MdOutlineSportsSoccer className="icon" />
          Sports
        </button>
        <button
          className={`category-item ${activeCategory === "seasonal" ? "active" : ""}`}
          onClick={() => handleCategorySelect("eventType", "seasonal")}
        >
          <FaSnowflake className="icon" />
          Seasonal & Tours
        </button>
      </div>
    </div>
  );
};

export default SubNavBarEvents;
