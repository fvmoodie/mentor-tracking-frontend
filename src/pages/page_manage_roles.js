import React, { useEffect, useState } from "react";
import "../styles/page_manage_roles.css";

const roleDescriptions = {
  Admin: "Full access to all system functions.",
  Manager: "Can manage users and individuals within their region.",
  Staff: "Standard user role with limited access.",
};

const PageManageRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://notesvia.duckdns.org/api/roles/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch roles");

      const data = await res.json();
      setRoles(data);
    } catch (error) {
      showToast("Error fetching roles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="page-manage-roles-container">
      <h2 className="page-manage-roles-title">System Roles</h2>

      {toast && <div className="page-manage-roles-toast">{toast}</div>}

      {loading ? (
        <div className="page-manage-roles-spinner">Loading roles...</div>
      ) : (
        <div className="page-manage-roles-list">
          {roles.map((role) => {
            const description =
              roleDescriptions[role.role_name] || "No description available.";
            return (
              <div
                key={role.role_id}
                className="page-manage-roles-readonly-row"
                title={description}
              >
                <strong>{role.role_name}</strong>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageManageRoles;
