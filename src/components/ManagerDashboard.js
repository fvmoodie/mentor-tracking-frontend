import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Ensure correct CSS file is linked

// Lazy Load Icons
const FaCog = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaCog })));
const FaSignOutAlt = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaSignOutAlt })));

const ManagerDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();

  const handleMouseEnter = (menu) => {
    if (window.innerWidth > 768) {
      setActiveMenu(menu);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setActiveMenu('');
    }
  };

  const handleMenuClick = (menu) => {
    if (window.innerWidth <= 768) {
      setActiveMenu(activeMenu === menu ? '' : menu);
    }
  };

  
  const handleLogout = () => {
    localStorage.clear(); // Clear all session data
    navigate('/'); // Redirect to login
  };
  
  return (
    <div className="container">
      {/* Top Row 1: Header with Logo, Search, Settings & Logout */}
      <div className="top-row">
        <div className="top-left">
          <img src="/assets/MainLogo.png" alt="Main Logo" className="main-logo" />
          <span className="welcome-text">Manager Dashboard</span>
        </div>
        <div className="top-right">
          <div className="top-controls">
            <input type="text" placeholder="Search..." className="search-bar" />
            <Suspense fallback={<div>Loading...</div>}>
              <FaCog className="icon settings-icon large-icon" title="Settings" />
              <FaSignOutAlt 
                className="icon logout-icon large-icon" 
                title="Log Out" 
                onClick={handleLogout} 
              />
            </Suspense>
          </div>
          <img src="/assets/TopLogo.png" alt="Top Logo" className="top-logo" />
        </div>
      </div>

      {/* Top Row 2: Reduced Height */}
      <div className="top-row-2"></div>

      {/* Middle Section: Three Equal Columns */}
      <div className="middle-row">
        {/* Column 1: Manager Features with Submenus */}
        <div className="column features-column">
          {[
            { title: "👥 User Management", subItems: ["View all users", "Assign roles", "Manage permissions"] },
            { title: "📊 Reports & Analytics", subItems: ["View system reports", "User activity logs", "Export data"] },
            { title: "⚙️ System Settings", subItems: ["Configure system preferences", "Manage integrations", "Backup & restore"] },
            { title: "📄 Documentation & Policies", subItems: ["Company policies", "Compliance guidelines", "User manuals"] },
          ].map((menu, index) => (
            <div
              key={index}
              className="menu-item"
              tabIndex="0"
              onMouseEnter={() => handleMouseEnter(menu.title)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleMenuClick(menu.title)}
              onKeyDown={(e) => e.key === "Enter" && handleMenuClick(menu.title)}
              role="button"
              aria-expanded={activeMenu === menu.title}
            >
              <h2 className="main-menu-item">{menu.title}</h2>
              {activeMenu === menu.title && (
                <div className="sub-menu">
                  {menu.subItems.map((item, i) => (
                    <p key={i} className="sub-menu-item">{item}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Column 2: Middle Logo */}
        <div className="column middle-column">
          <img src="/assets/MiddleLogo.png" alt="Middle Logo" className="middle-logo" />
        </div>

        {/* Column 3: Support Links */}
        <div className="column support-column">
          <h2>Need Assistance?</h2>
          <ul>
            <li><a href="/forgot-password">Forgot ID/Password?</a></li>
            <li><a href="/problem-logging-in">Problem logging in?</a></li>
          </ul>
        </div>
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

export default ManagerDashboard;
