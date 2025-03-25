import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/AssignRegionRole.css";

const API_URL = "http://167.71.169.127:5000/users";
const ROLE_API_URL = "http://167.71.169.127:5000/assign-role";

const AssignRegionRole = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filter, setFilter] = useState("inactive"); // Default to inactive users
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(filter);
    fetchRoles();
  }, [filter]);

  const fetchUsers = async (status) => {
    try {
      console.log(`Fetching ${status} users...`); // Debugging log
      setUsers([]); // ✅ Clear previous data before fetching

      const response = await fetch(`${API_URL}/${status}`);
      const data = await response.json();

      // ✅ Ensure State Updates Correctly
      if (status === "inactive") {
        setUsers(data.inactive_users || []); // ✅ Force empty array if no users
      } else {
        setUsers(data.active_users || []); // ✅ Set Active Users correctly
      }

      console.log(`${status} Users Loaded:`, data); // Debugging log
    } catch (error) {
      console.error(`Error fetching ${status} users:`, error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/roles`);
      const data = await response.json();
      setRoles(data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleRoleChange = async (userId, roleId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.UserID === userId ? { ...user, RoleID: roleId } : user
      )
    );

    const endpoint = filter === "inactive" ? ROLE_API_URL : `${ROLE_API_URL}/update`;
    const method = filter === "inactive" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID: userId, RoleID: roleId }),
      });

      if (!response.ok) {
        throw new Error("Error updating role.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Error updating role.");
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/activate/${userId}`, {
        method: "PUT",
      });
      if (response.ok) {
        alert("User activated successfully!");
        fetchUsers(filter);
      } else {
        alert("Error activating user.");
      }
    } catch (error) {
      console.error("Error activating user:", error);
    }
  };

  return (
    <div className="assign-role-container">
      <div className="top-row">
        <div className="top-left">
          <img src="/assets/MainLogo.png" alt="Main Logo" className="main-logo" />
          <h2>Assign User Role</h2>
        </div>
        <div className="top-right">
          {/* ✅ Fixed Header for User List */}
          <div className="assign-role-users-header">
            <h3>{filter === "inactive" ? "Inactive" : "Active"} Users ({users.length})</h3>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <FaArrowLeft className="icon back-icon" title="Back" onClick={() => navigate("/admin-dashboard")} />
          </Suspense>
          <img src="/assets/TopLogo.png" alt="Top Logo" className="top-logo" />
        </div>
      </div>

      {/* ✅ Adjusted Second Row (No Text, Just Layout) */}
      <div className="assign-role-top-row-2"></div>

      <div className="assign-role-middle-section">
        {/* Filter Box */}
        <div className="assign-role-filter-box">
          <h3>Filter Users</h3>
          <select
            className="assign-role-dropdown"
            value={filter}
            onChange={(e) => {
              const newFilter = e.target.value;
              setFilter(newFilter);
              setUsers([]); // ✅ Reset users before fetching new data
            }}
          >
            <option value="inactive">Inactive Users</option>
            <option value="active">Active Users</option>
          </select>
        </div>

        {/* User List */}
        <div className="assign-role-users-container">
          {users.map((user) => (
            <div key={user.UserID} className="assign-role-user-row">
              {/* ✅ User Name (Fixed Width) */}
              <div className="assign-role-user-name">{user.FullName}</div>

              {/* ✅ Role Dropdown (Aligned Properly) */}
              <div className="assign-role-selection">
                <select
                  className="assign-role-dropdown"
                  value={user.RoleID || ""}
                  onChange={(e) => handleRoleChange(user.UserID, e.target.value)}
                >
                  <option value="">Select Role</option>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <option key={role.RoleID} value={role.RoleID}>
                        {role.RoleName}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading roles...</option>
                  )}
                </select>
              </div>

              {/* ✅ Activate Button (Fixed Width & Properly Aligned) */}
              {filter === "inactive" && (
                <div className="assign-role-activate-user">
                  <button className="assign-role-activate-btn" onClick={() => handleActivateUser(user.UserID)}>
                    Activate
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-row">
        <footer>
          <p>Privacy | Security | &#169; 2025 NotesVia</p>
        </footer>
      </div>
    </div>
  );
};

export default AssignRegionRole;
