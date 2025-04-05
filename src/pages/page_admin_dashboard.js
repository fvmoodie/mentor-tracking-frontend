import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/page_admin_dashboard.css";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import Page_ManageRoles from "./page_ManageRoles";
import Page_ManageRegions from "./page_ManageRegions";
import Page_ManageUsers from "./page_ManageUsers";
import Page_ManageIndividuals from './page_ManageIndividuals';
import Page_ManageGoals from './page_ManageGoals';
import Page_ManageObjectives from './page_ManageObjectives';

const PageAdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://167.71.169.127:5000/api";

  return (
    <div className="page-admin-dashboard-container">
      <header className="page-admin-header">
        <div className="page-header-left">
          <img src="/assets/MainLogo.png" alt="Main Logo" className="page-main-logo" />
          <h1 className="page-dashboard-title">Administrator Dashboard</h1>
        </div>
        <div className="page-header-right">
          <input type="text" placeholder="Search..." className="page-search-bar" />
          <FaPlus className="page-header-icon" />
          <FaSignOutAlt className="page-header-icon" onClick={() => navigate("/login")} />
        </div>
      </header>

      <div className="page-dashboard-content">
        {/* LEFT MENU SECTION */}
        <aside className="page-left-column-section">
          {["Setup & Configure", "User Management", "Individual Management", "Activity Tracking", "Task & Reports"].map((item) => (
            <button key={item} className={`page-left-menu-button ${selectedMenu === item ? "active" : ""}`} 
              onClick={() => {
                setSelectedMenu(item);
                setSelectedSubMenu(null);
              }}>
              {item}
            </button>
          ))}
        </aside>

        {/* MAIN CENTER COLUMN SECTION */}
        <main className={`page-center-column-section ${selectedMenu ? "active" : ""}`}>
          {selectedMenu ? (
            <>
              <h2>{selectedMenu}</h2>
              <div className="submenu-container">
                {selectedMenu === "Setup & Configure" && ["Manage Roles", "Manage Regions", "Manage Users"].map((subItem) => (
                  <button key={subItem} className={`page-center-submenu-button ${selectedSubMenu === subItem ? "active" : ""}`} 
                    onClick={() => setSelectedSubMenu(subItem)}>
                    {subItem}
                  </button>
                ))}
                {selectedMenu === "Individual Management" && 
                  ["Manage Individuals", "Manage Goals", "Manage Objectives"].map((subItem) => (
                    <button 
                      key={subItem} 
                      className={`page-center-submenu-button ${selectedSubMenu === subItem ? "active" : ""}`} 
                      onClick={() => setSelectedSubMenu(subItem)}
                    >
                      {subItem}
                    </button>
                  ))
                }
              </div>
            </>
          ) : (
            <p className="page-placeholder-text">Select a menu option to get started.</p>
          )}
        </main>

        {/* RIGHT PANEL: DYNAMIC COMPONENTS */}
        <aside className={`page-right-column-section ${selectedSubMenu ? "active" : ""}`}>
          {selectedSubMenu === "Manage Roles" && <Page_ManageRoles API_URL={API_URL} />}
          {selectedSubMenu === "Manage Regions" && <Page_ManageRegions API_URL={API_URL} />}
          {selectedSubMenu === "Manage Users" && <Page_ManageUsers API_URL={API_URL} />}
          {selectedSubMenu === "Manage Individuals" && <Page_ManageIndividuals API_URL={API_URL} />}
          {selectedSubMenu === "Manage Goals" && <Page_ManageGoals API_URL={API_URL} />}
          {selectedSubMenu === "Manage Objectives" && <Page_ManageObjectives API_URL={API_URL} />}
        </aside>
      </div>

      <footer className="page-admin-footer">Privacy | Security | © 2025 NotesVia</footer>
    </div>
  );
};

export default PageAdminDashboard;
