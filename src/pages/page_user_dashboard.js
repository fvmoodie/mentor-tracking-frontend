import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/page_user_dashboard.css";
import { FaSignOutAlt } from "react-icons/fa";

const PageUserDashboard = () => {
  const [individuals, setIndividuals] = useState([]);
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const [userName, setUserName] = useState("User");

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://167.71.169.127:5000/api";

  useEffect(() => {
    fetchIndividuals();
    const storedUser = localStorage.getItem("userName") || "User";
    setUserName(storedUser);
  }, []);

  const fetchIndividuals = async () => {
    try {
      const res = await fetch(`${API_URL}/individuals`);
      const data = await res.json();
      setIndividuals(data);
    } catch (error) {
      console.error("Error loading individuals:", error);
    }
  };

  return (
    <div className="page-user-dashboard-container">
      <header className="page-user-header">
        <div className="page-header-left">
          <img src="/assets/MainLogo.png" alt="Main Logo" className="page-main-logo" />
          <h1 className="page-dashboard-title">Welcome back, {userName}</h1>
        </div>
        <div className="page-header-right">
          <FaSignOutAlt className="page-header-icon" onClick={() => navigate("/login")} />
        </div>
      </header>

      <div className="page-dashboard-content">
        {/* LEFT MENU: Assigned Individuals */}
        <aside className="page-left-column-section">
          {individuals.map((person) => (
            <button
              key={person.id}
              className={`page-left-menu-button ${selectedIndividual === person.id ? "active" : ""}`}
              onClick={() => {
                setSelectedIndividual(person.id);
                setSelectedSubMenu(null);
              }}
            >
              {person.full_name}
            </button>
          ))}
        </aside>

        {/* CENTER MENU: Submenu Options */}
        <main className={`page-center-column-section ${selectedIndividual ? "active" : ""}`}>
          {selectedIndividual ? (
            <>
              <h2>Menu</h2>
              <div className="submenu-container-scrollable">
                {["Morning routines", "Afternoon routines", "Evening routines", "Community activity", "Medical", "Emergency", "Goal objectives", "Task Reminders", "Reports & Submissions"].map((item) => (
                  <button
                    key={item}
                    className={`page-center-submenu-button ${selectedSubMenu === item ? "active" : ""}`}
                    onClick={() => setSelectedSubMenu(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="page-placeholder-text">Select an individual to view menu.</p>
          )}
        </main>

        {/* RIGHT PANEL */}
        <aside className={`page-right-column-section ${selectedSubMenu ? "active" : ""}`}>
          {selectedIndividual && selectedSubMenu && (
            <div>
              <h2>{selectedSubMenu}</h2>
              <p>Content for {selectedSubMenu} will appear here...</p>
            </div>
          )}
        </aside>
      </div>

      <footer className="page-user-footer">Privacy | Security | © 2025 NotesVia</footer>
    </div>
  );
};

export default PageUserDashboard;
