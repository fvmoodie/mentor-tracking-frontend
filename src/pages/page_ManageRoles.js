import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import "../styles/page_ManageRoles.css";

const Page_ManageRoles = ({ API_URL }) => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [editingRoleIndex, setEditingRoleIndex] = useState(null);
  const [editedRole, setEditedRole] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/roles`);
      if (!response.ok) throw new Error("Failed to fetch roles");
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRole }),
      });
      if (!response.ok) throw new Error("Failed to add role");

      setNewRole("");
      fetchRoles();
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const handleEditRole = (index, role) => {
    setEditingRoleIndex(index);
    setEditedRole(role.name);
  };

  const handleSaveRole = async () => {
    if (!editedRole.trim() || editingRoleIndex === null) return;
    const roleId = roles[editingRoleIndex]?.id;
    if (!roleId) return;
    try {
      const response = await fetch(`${API_URL}/roles/${roleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedRole }),
      });
      if (response.ok) {
        fetchRoles();
        setEditingRoleIndex(null);
        setEditedRole("");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="page-role-management">
      <h3>Manage Roles</h3>
      <div className="page-role-input-container">
        <input type="text" placeholder="Enter new role" value={newRole} onChange={(e) => setNewRole(e.target.value)} className="page-role-input" />
        <button className="page-add-role-button" onClick={handleAddRole}>+ Add Role</button>
      </div>
      <ul className="page-role-list">
        {roles.length ? (
          roles.map((role, index) => (
            <li key={role.id} className="page-role-item">
              {editingRoleIndex === index ? (
                <>
                  <input value={editedRole} onChange={(e) => setEditedRole(e.target.value)} className="page-role-input" />
                  <button className="page-save-role-button" onClick={handleSaveRole}>Save</button>
                  <button className="page-cancel-role-button" onClick={() => setEditingRoleIndex(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {role.name}
                  <button className="page-edit-role-button" onClick={() => handleEditRole(index, role)}>
                    <FaEdit />
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No roles found.</p>
        )}
      </ul>
    </div>
  );
};

export default Page_ManageRoles;
