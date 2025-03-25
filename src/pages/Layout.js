import { useState, lazy, Suspense } from "react";
import "../styles/StandardLayout.css"; // ✅ Now using the new StandardLayout.css

const FaPlus = lazy(() => import("react-icons/fa").then((module) => ({ default: module.FaPlus }))); // ✅ Replaced settings icon with FaPlus
const FaSignOutAlt = lazy(() => import("react-icons/fa").then((module) => ({ default: module.FaSignOutAlt })));

const Layout = ({ title, leftSection, centerSection, rightSection, layoutType, onAddNew }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="layout-container">
      {/* 🔹 Top Row 1: Header with Logo, Search, Add & Logout */}
      <div className="layout-header">
        <div className="layout-header-left">
          <img src="/assets/MainLogo.png" alt="Main Logo" className="layout-logo" />
          <span className="layout-welcome-text">{title}</span>
        </div>
        <div className="layout-header-right">
          <div className="layout-controls">
            <input type="text" placeholder="Search..." className="layout-search-bar" />
            <Suspense fallback={<div>Loading...</div>}>
              <FaPlus className="layout-icon add-icon" title="Add New" onClick={onAddNew} /> {/* ✅ Add new button */}
              <FaSignOutAlt className="layout-icon logout-icon" title="Log Out" onClick={handleLogout} />
            </Suspense>
          </div>
          <img src="/assets/TopLogo.png" alt="Top Logo" className="layout-top-logo" />
        </div>
      </div>

      {/* 🔹 Top Row 2: Notification Bar */}
      <div className="layout-notification-bar"></div>

      {/* 🔹 Middle Section: Dynamic Layout */}
      <div className="layout-middle-section">
        {layoutType === "dashboard" ? (
          <>
            <div className="layout-column layout-left-column">{leftSection}</div>
            <div className="layout-column layout-center-column">{centerSection}</div>
            <div className="layout-column layout-right-column">{rightSection}</div>
          </>
        ) : (
          <>
            <div className="layout-column layout-left-column">{leftSection}</div>
            <div className="layout-column layout-center-column">{centerSection}</div>
          </>
        )}
      </div>

      {/* 🔹 Bottom Row: Footer */}
      <div className="layout-footer">
        <footer>
          <p>Privacy | Security | &#169; 2025 NotesVia</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
