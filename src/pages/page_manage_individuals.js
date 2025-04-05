import React, { useEffect, useState } from "react";
import "../styles/page_manage_individuals.css";

const PageManageIndividuals = () => {
  const [individuals, setIndividuals] = useState([]);
  const [regions, setRegions] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [newIndividual, setNewIndividual] = useState({
    name: "",
    date_of_birth: "",
    behavior_support_plan_active: false,
    region_id: "",
    mentor_user_id: ""
  });
  const [toast, setToast] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [iRes, rRes, mRes] = await Promise.all([
        fetch("https://notesvia.duckdns.org/api/individuals", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include"
        }),
        fetch("https://notesvia.duckdns.org/api/regions", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include"
        }),
        fetch("https://notesvia.duckdns.org/api/users", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include"
        }),
      ]);

      const [iData, rData, mData] = await Promise.all([
        iRes.json(),
        rRes.json(),
        mRes.json()
      ]);

      setIndividuals(iData);
      setRegions(rData);
      setMentors(mData.filter((u) => u.role_id === 2));
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  const handleChange = (id, field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id) => {
    const original = individuals.find((ind) => ind.individual_id === id);
    const updates = editedData[id];
    
    if (!updates) return;

    const data = {
      name: updates.name ?? original.name,
      date_of_birth: updates.date_of_birth ?? original.date_of_birth,
      behavior_support_plan_active:
        updates.behavior_support_plan_active ?? original.behavior_support_plan_active,
      region_id: updates.region_id ?? original.region_id,
      mentor_user_id: updates.mentor_user_id ?? original.mentor_user_id,
    };

    // ✅ Ensure date_of_birth is in correct format
    if (data.date_of_birth) {
      const parsed = new Date(data.date_of_birth);
      data.date_of_birth = parsed.toISOString().slice(0, 10);
    }

    try {
      const res = await fetch(`https://notesvia.duckdns.org/api/individuals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      if (res.ok) {
        showToast("Individual updated");
        setEditedData((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this individual?")) return;

    try {
      await fetch(`https://notesvia.duckdns.org/api/individuals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
      });
      showToast("Archived");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChange = (field, value) => {
    setNewIndividual((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdd = async () => {
    const { name, region_id} = newIndividual;
    if (!name || !region_id) {
      showToast("Name and region are required");
      return;
    }

    const payload = { ...newIndividual };
    if (payload.date_of_birth) {
      const parsed = new Date(payload.date_of_birth);
      payload.date_of_birth = parsed.toISOString().slice(0, 10);
    }

    try {
      const res = await fetch("https://notesvia.duckdns.org/api/individuals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast("Individual added");
        setNewIndividual({
          name: "",
          date_of_birth: "",
          behavior_support_plan_active: false,
          region_id: "",
          mentor_user_id: ""
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const formatDateForInput = (date) => {
    try {
      const d = new Date(date);
      return d.toISOString().slice(0, 10); // Format as YYYY-MM-DD
    } catch {
      return "";
    }
  };

  return (
    <div className="page-manage-individuals-container">
      <h2>Manage Individuals</h2>
      {toast && <div className="page-manage-individuals-toast">{toast}</div>}

      <div className="page-manage-individuals-list">
        {/* Add New Individual Section */}
        <div className="page-manage-individuals-row new-row">
          <input
            type="text"
            placeholder="Name"
            value={newIndividual.name}
            onChange={(e) => handleAddChange("name", e.target.value)}
          />
          <input
            type="date"
            value={newIndividual.date_of_birth}
            onChange={(e) => handleAddChange("date_of_birth", e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={newIndividual.behavior_support_plan_active}
              onChange={(e) =>
                handleAddChange("behavior_support_plan_active", e.target.checked)
              }
            /> BSP
          </label>
          <select
            value={newIndividual.region_id}
            onChange={(e) =>
              handleAddChange("region_id", parseInt(e.target.value))
            }
          >
            <option value="">-- Region --</option>
            {regions.map((r) => (
              <option key={r.region_id} value={r.region_id}>{r.region_name}</option>
            ))}
          </select>
          <select
            value={newIndividual.mentor_user_id || ""}
            onChange={(e) =>
              handleAddChange("mentor_user_id", parseInt(e.target.value))
            }
          >
            <option value="">-- Mentor --</option>
            {mentors.map((m) => (
              <option key={m.user_id} value={m.user_id}>{m.full_name}</option>
            ))}
          </select>
          <button onClick={handleAdd}>Add</button>
        </div>

        {/* Existing Individual Records */}
        {individuals.map((ind) => (
          <div key={ind.individual_id} className="page-manage-individuals-row">
            <input
              type="text"
              value={editedData[ind.individual_id]?.name ?? ind.name}
              onChange={(e) =>
                handleChange(ind.individual_id, "name", e.target.value)
              }
            />
            <input
              type="date"
              value={
                editedData[ind.individual_id]?.date_of_birth !== undefined
                  ? editedData[ind.individual_id].date_of_birth
                  : formatDateForInput(ind.date_of_birth)
              }
              onChange={(e) =>
                handleChange(ind.individual_id, "date_of_birth", e.target.value)
              }
            />
            <label>
              <input
                type="checkbox"
                checked={
                  editedData[ind.individual_id]?.behavior_support_plan_active ??
                  ind.behavior_support_plan_active
                }
                onChange={(e) =>
                  handleChange(ind.individual_id, "behavior_support_plan_active", e.target.checked)
                }
              /> BSP
            </label>
            <select
              value={editedData[ind.individual_id]?.region_id ?? ind.region_id ?? ""}
              onChange={(e) =>
                handleChange(ind.individual_id, "region_id", parseInt(e.target.value))
              }
            >
              {regions.map((r) => (
                <option key={r.region_id} value={r.region_id}>{r.region_name}</option>
              ))}
            </select>
            <select
              value={editedData[ind.individual_id]?.mentor_user_id ?? ind.mentor_user_id ?? ""}
              onChange={(e) =>
                handleChange(ind.individual_id, "mentor_user_id", parseInt(e.target.value))
              }
            >
              <option value="">-- Mentor --</option>
              {mentors.map((m) => (
                <option key={m.user_id} value={m.user_id}>{m.full_name}</option>
              ))}
            </select>
            <button
              className="page-manage-individuals-save-btn"
              onClick={() => handleSave(ind.individual_id)}
            >
              Save
            </button>
            <button
              className="page-manage-individuals-archive-btn"
              onClick={() => handleArchive(ind.individual_id)}
            >
              Archive
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageManageIndividuals;
