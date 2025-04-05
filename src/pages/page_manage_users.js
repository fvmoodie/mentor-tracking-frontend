// File: pages/page_manage_users.js
import React, { useState } from "react";
import useApiData from "../hooks/useApiData";
import EditableRow from "../components/EditableRow";
import "../styles/page_manage_users.css";

const PageManageUsers = () => {
  const { data: users, loading, refetch } = useApiData("https://notesvia.duckdns.org/api/users/");
  const { data: roles } = useApiData("https://notesvia.duckdns.org/api/roles/");
  const { data: regions } = useApiData("https://notesvia.duckdns.org/api/regions/");
  const [editedMap, setEditedMap] = useState({});
  const token = localStorage.getItem("token");

  const fields = [
    { name: "full_name", label: "Full Name" },
    { name: "email", label: "Email" },
    {
      name: "role_id",
      type: "select",
      options: roles.map((r) => ({ value: r.role_id, label: r.role_name })),
    },
    {
      name: "region_id",
      type: "select",
      options: [{ value: "", label: "-- None --" }].concat(
        regions.map((r) => ({ value: r.region_id, label: r.region_name }))
      ),
    },
    {
      name: "is_active",
      type: "select",
      options: [
        { value: 1, label: "Active" },
        { value: 0, label: "Inactive" },
      ],
    },
    { name: "initials", label: "Initials" },
    { name: "digital_signature", label: "Digital Signature" },
  ];

  const handleEdit = (id, field, value) => {
    setEditedMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id) => {
    const updated = editedMap[id];
    if (!updated) return;

    const original = users.find((u) => u.user_id === id);
    const merged = { ...original, ...updated };

    await fetch(`https://notesvia.duckdns.org/api/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(merged),
    });

    setEditedMap((prev) => {
      const updatedMap = { ...prev };
      delete updatedMap[id];
      return updatedMap;
    });

    refetch();
  };

  return (
    <div className="page-manage-users-container">
      <h2 className="page-manage-users-title">Manage Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        users.map((user) => (
          <EditableRow
            key={user.user_id}
            rowData={editedMap[user.user_id] || user}
            fields={fields}
            onChange={(field, val) => handleEdit(user.user_id, field, val)}
            onSave={() => handleSave(user.user_id)}
          />
        ))
      )}
    </div>
  );
};

export default PageManageUsers;
