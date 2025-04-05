import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/page_sidebar.css";

const PageSidebar = () => {
  const location = useLocation();
  const roleId = parseInt(localStorage.getItem("role_id"), 10);

  // Define base menu items per role
  const navItemsByRole = {
    1: [ // Admin
      { path: "/admin-dashboard/manage-users", label: "👥 Manage Users" },
      { path: "/admin-dashboard/manage-roles", label: "🛡️ Manage Roles" },
      { path: "/admin-dashboard/manage-regions", label: "🌍 Manage Regions" },
      { path: "/admin-dashboard/individuals", label: "👤 Individuals" },
      { path: "/admin-dashboard/goals", label: "🎯 Goals" },
      { path: "/admin-dashboard/objectives", label: "📋 Objectives" },
      { path: "/admin-dashboard/daily-progress", label: "📅 Daily Progress" },
      { path: "/admin-dashboard/objective-progress", label: "🎯 Objective Progress" },
      { path: "/admin-dashboard/dpn-report", label: "📝 DPN Report" },
      { path: "/admin-dashboard/ods-report", label: "📘 ODS Report" }
    ],
    2: [ // Manager
      { path: "/admin-dashboard/individuals", label: "👤 Individuals" },
      { path: "/admin-dashboard/goals", label: "🎯 Goals" },
      { path: "/admin-dashboard/objectives", label: "📋 Objectives" },
      { path: "/admin-dashboard/daily-progress", label: "📅 Daily Progress" },
      { path: "/admin-dashboard/objective-progress", label: "🎯 Objective Progress" },
      { path: "/admin-dashboard/dpn-report", label: "📝 DPN Report" },
      { path: "/admin-dashboard/ods-report", label: "📘 ODS Report" }
    ],
    3: [ // Regular User
      { path: "/user-dashboard/objective-progress", label: "📋 Objectives" },
      { path: "/user-dashboard/daily-progress", label: "📅 Daily Progress" },
      { path: "/user-dashboard/dpn-report", label: "📝 DPN Report" },
      { path: "/user-dashboard/ods-report", label: "📘 ODS Report" }
    ]
  };

  const navItems = navItemsByRole[roleId] || [];

  return (
    <aside className="sidebar-container">
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item, idx) => (
            <li
              key={idx}
              className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <Link to={item.path} className="sidebar-link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default PageSidebar;
