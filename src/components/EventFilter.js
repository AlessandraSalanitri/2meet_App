"use client";

import React from "react";

const EventFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onApplyFilters,
  filters,
}) => {
  return (
    <div className="event-filters">
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="dynamic-search-bar"
      />

      <button onClick={() => setSelectedCategory("all")}>All Categories</button>
      <button onClick={() => setSelectedCategory("music")}>Music</button>
      <button onClick={() => setSelectedCategory("sports")}>Sports</button>
      {/* Example category filters */}
      <button onClick={() => setSelectedCategory("conference")}>
        Conference
      </button>

      {/* Sort Events */}
      <select
        value={filters.sortBy || ""}
        onChange={(e) => onApplyFilters({ sortBy: e.target.value })}
      >
        <option value="">Sort By</option>
        <option value="date">Date</option>
        <option value="location">Location</option>
        <option value="availability">Availability</option>
      </select>
    </div>
  );
};

export default EventFilters;
