import React, { useEffect, useState } from "react";
import "../styles/page_manage_regions.css";

const PageManageRegions = () => {
  const [regions, setRegions] = useState([]);
  const [newRegion, setNewRegion] = useState({ region_name: "", description: "" });
  const [editMap, setEditMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const token = localStorage.getItem("token");
  const roleId = parseInt(localStorage.getItem("role_id")); // 1 = Admin, 2 = Manager

  const isAdmin = roleId === 1;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://notesvia.duckdns.org/api/regions/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch regions");

      const data = await res.json();
      setRegions(data);
    } catch (error) {
      showToast("Error fetching regions", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleAdd = async () => {
    if (!newRegion.region_name.trim()) return;
    try {
      const res = await fetch("https://notesvia.duckdns.org/api/regions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(newRegion),
      });

      if (!res.ok) throw new Error("Create failed");

      setNewRegion({ region_name: "", description: "" });
      showToast("Region added", "success");
      fetchRegions();
    } catch (error) {
      showToast("Error creating region", "error");
    }
  };

  const handleEdit = async (id) => {
    const updated = editMap[id];
    if (!updated || !updated.region_name.trim()) return;

    try {
      const res = await fetch(`https://notesvia.duckdns.org/api/regions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Update failed");

      showToast("Region updated", "success");
      fetchRegions();
    } catch (error) {
      showToast("Error updating region", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this region?")) return;

    try {
      const res = await fetch(`https://notesvia.duckdns.org/api/regions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.error || "Error deleting region";
        showToast(errorMsg, "error");
      } else {
        showToast(data?.message || "Region deleted", "success");
        fetchRegions();
      }
    } catch (error) {
      showToast("Unexpected error deleting region", "error");
      console.error(error);
    }
  };

  return (
    <div className="page-manage-regions-container">
      <h2 className="page-manage-regions-title">Manage Regions</h2>

      {toast.message && (
        <div className={`page-manage-regions-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {isAdmin && (
        <div className="page-manage-regions-add">
          <input
            type="text"
            placeholder="New region name"
            value={newRegion.region_name}
            onChange={(e) =>
              setNewRegion({ ...newRegion, region_name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={newRegion.description}
            onChange={(e) =>
              setNewRegion({ ...newRegion, description: e.target.value })
            }
          />
          <button className="page-manage-regions-add-btn" onClick={handleAdd}>
            Add
          </button>
        </div>
      )}

      {loading ? (
        <div className="page-manage-regions-spinner">Loading regions...</div>
      ) : (
        <div className="page-manage-regions-list">
          {regions.map((region) => {
            const edit = editMap[region.region_id] ?? {
              region_name: region.region_name,
              description: region.description,
            };

            return (
              <div key={region.region_id} className="page-manage-regions-row">
                <input
                  type="text"
                  value={edit.region_name}
                  onChange={(e) =>
                    setEditMap((prev) => ({
                      ...prev,
                      [region.region_id]: {
                        ...edit,
                        region_name: e.target.value,
                      },
                    }))
                  }
                  disabled={!isAdmin}
                />
                <input
                  type="text"
                  value={edit.description}
                  onChange={(e) =>
                    setEditMap((prev) => ({
                      ...prev,
                      [region.region_id]: {
                        ...edit,
                        description: e.target.value,
                      },
                    }))
                  }
                  disabled={!isAdmin}
                />
                {isAdmin && (
                  <>
                    <button
                      className="page-manage-regions-save-btn"
                      onClick={() => handleEdit(region.region_id)}
                    >
                      Save
                    </button>
                    <button
                      className="page-manage-regions-delete-btn"
                      onClick={() => handleDelete(region.region_id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageManageRegions;
