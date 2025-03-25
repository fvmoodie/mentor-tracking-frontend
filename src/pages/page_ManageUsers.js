import React, { useState, useEffect } from "react";
import { FaUserCheck, FaUserSlash, FaEdit } from "react-icons/fa";
import "../styles/page_ManageUsers.css";

const Page_ManageUsers = ({ API_URL }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [editedDataMap, setEditedDataMap] = useState({});
  const [showToast, setShowToast] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchRegions();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/roles`);
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await fetch(`${API_URL}/regions`);
      const data = await res.json();
      setRegions(data);
    } catch (err) {
      console.error("Error fetching regions:", err);
    }
  };

  const toggleExpand = (user) => {
    setExpandedUserId(expandedUserId === user.id ? null : user.id);
    setEditedDataMap((prev) => ({
      ...prev,
      [user.id]: {
        role: user.role,
        region: regions.find((r) => r.name === user.region)?.id || null,
      },
    }));
  };

  const saveChanges = async (userId) => {
    const edited = editedDataMap[userId];
    if (!edited) return;

    try {
      await Promise.all([
        fetch(`${API_URL}/users/${userId}/role`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: edited.role, modified_by: 1 }),
        }),
        fetch(`${API_URL}/users/${userId}/region`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ region: edited.region, modified_by: 1 }),
        }),
      ]);

      // ✅ Ensure mentor record (only if role = Manager and region assigned)
      if (edited.role === "Manager" && edited.region) {
        await fetch(`${API_URL}/mentors/ensure`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }

      await fetchUsers();
      setExpandedUserId(null);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const toggleStatus = async (userId) => {
    try {
      await fetch(`${API_URL}/users/${userId}/activate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, modified_by: 1 }),
      });
      await fetchUsers();
    } catch (err) {
      console.error("Status error:", err);
    }
  };

  return (
    <div className="page-user-management">
      <h3>Manage Users</h3>
      {showToast && (
        <div className="toast">✅ Mentor record created successfully!</div>
      )}
      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Region</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr onClick={() => toggleExpand(user)}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className={user.is_active ? "deactivate-button" : "activate-button"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(user.id);
                      }}
                    >
                      {user.is_active ? <FaUserSlash /> : <FaUserCheck />}
                    </button>
                  </td>
                  <td>{user.region || "N/A"}</td>
                  <td>
                    <button className="edit-button">
                      <FaEdit />
                    </button>
                  </td>
                </tr>

                {expandedUserId === user.id && (
                  <tr>
                    <td colSpan="6">
                      <div className="expanded-content">
                        <label>Role:</label>
                        <select
                          className="role-dropdown"
                          value={editedDataMap[user.id]?.role || ""}
                          onChange={(e) =>
                            setEditedDataMap((prev) => ({
                              ...prev,
                              [user.id]: {
                                ...prev[user.id],
                                role: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="">Select Role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </select>

                        <label>Region:</label>
                        <select
                          className="region-dropdown"
                          value={editedDataMap[user.id]?.region || ""}
                          onChange={(e) =>
                            setEditedDataMap((prev) => ({
                              ...prev,
                              [user.id]: {
                                ...prev[user.id],
                                region: parseInt(e.target.value),
                              },
                            }))
                          }
                        >
                          <option value="">Select Region</option>
                          {regions.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          ))}
                        </select>

                        <button className="save-button" onClick={() => saveChanges(user.id)}>
                          Save
                        </button>
                        <button className="cancel-button" onClick={() => setExpandedUserId(null)}>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page_ManageUsers;
