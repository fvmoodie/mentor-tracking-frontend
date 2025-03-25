import React, { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa"; // ✅ FaPlus for Add Button
import "../styles/Dashboard.css"; // Same styling as Admin Dashboard

const RegionsManagement = () => {
  const navigate = useNavigate();

  const handleAddNew = () => {
    console.log("Add New Region Clicked!"); // ✅ This will later open an Add Region form
  };

  return (
    <div className="container">
      {/* ✅ Top Row: Logo, Title, Add Button, and Back Button */}
      <div className="top-row">
        <div className="top-left">
          <img src="/assets/MainLogo.png" alt="Main Logo" className="main-logo" /> {/* ✅ Logo Stays */}
          <span className="welcome-text">Regions Management</span>
        </div>
        <div className="top-right">
          <div className="top-controls">
            <Suspense fallback={<div>Loading...</div>}>
              <FaPlus
                className="icon add-icon large-icon" /* ✅ Replaced Settings with Add Button */
                title="Add New Region"
                onClick={handleAddNew}
              />
              <FaArrowLeft
                className="icon back-icon large-icon" /* ✅ Back Button is now on the right */
                title="Back to Dashboard"
                onClick={() => navigate("/admin-dashboard")}
              />
            </Suspense>
          </div>
          <img src="/assets/TopLogo.png" alt="Top Logo" className="top-logo" />
        </div>
      </div>

      {/* Top Row 2: Reduced Height */}
      <div className="top-row-2"></div>

      {/* Middle Section: Three Equal Columns (Same as Admin Dashboard) */}
      <div className="middle-row">
        <div className="column features-column"></div> {/* Empty for now */}
        <div className="column middle-column">
          <img src="/assets/MiddleLogo.png" alt="Middle Logo" className="middle-logo" />
        </div>
        <div className="column support-column"></div> {/* Empty for now */}
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        <footer>
          <p>Privacy | Security | &#169; 2025 NotesVia</p>
        </footer>
      </div>
    </div>
  );
};

export default RegionsManagement;
