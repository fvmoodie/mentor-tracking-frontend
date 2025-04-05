import React, { useEffect, useState } from "react";
import "../styles/page_manage_objectives.css";

const PageManageObjectives = () => {
  const [individuals, setIndividuals] = useState([]);
  const [selectedIndividualId, setSelectedIndividualId] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [objectives, setObjectives] = useState([]);
  const [editedObjectives, setEditedObjectives] = useState({});
  const [newObjective, setNewObjective] = useState({
    objective_code: "",
    objective_description: "",
    frequency: "",
    start_date: "",
    end_date: "",
  });
  const [toast, setToast] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchIndividuals();
  }, []);

  useEffect(() => {
    if (selectedIndividualId) fetchGoals();
  }, [selectedIndividualId]);

  useEffect(() => {
    if (selectedGoalId) fetchObjectives();
  }, [selectedGoalId]);

  const formatDateForInput = (date) => {
    try {
      const d = new Date(date);
      return d.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  const fetchIndividuals = async () => {
    try {
      const res = await fetch("https://notesvia.duckdns.org/api/individuals", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await res.json();
      setIndividuals(data);
    } catch (err) {
      console.error("Failed to load individuals", err);
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/goals/individuals/${selectedIndividualId}/goals`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error("Failed to load goals", err);
    }
  };

  const fetchObjectives = async () => {
    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/objectives/goals/${selectedGoalId}/objectives`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      const data = await res.json();
      setObjectives(data);
    } catch (err) {
      console.error("Failed to fetch objectives", err);
    }
  };

  const handleChange = (field, value) => {
    setNewObjective((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditChange = (id, field, value) => {
    setEditedObjectives((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleAdd = async () => {
    if (!newObjective.objective_description) {
      showToast("Objective description is required");
      return;
    }

    const payload = { ...newObjective };
    ["start_date", "end_date"].forEach((field) => {
      if (payload[field]) {
        const d = new Date(payload[field]);
        payload[field] = d.toISOString().slice(0, 10);
      }
    });

    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/objectives/goals/${selectedGoalId}/objectives`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            ...payload,
            created_by_user_id: parseInt(localStorage.getItem("user_id")),
          }),
        }
      );
      if (res.ok) {
        showToast("Objective added");
        setNewObjective({
          objective_code: "",
          objective_description: "",
          frequency: "",
          start_date: "",
          end_date: "",
        });
        fetchObjectives();
      }
    } catch (err) {
      console.error("Failed to add objective", err);
    }
  };

  const handleSave = async (objective) => {
    const updates = editedObjectives[objective.objective_id];
    if (!updates) return;

    const payload = {
      objective_code: updates.objective_code ?? objective.objective_code,
      objective_description: updates.objective_description ?? objective.objective_description,
      frequency: updates.frequency ?? objective.frequency,
      start_date: updates.start_date ?? objective.start_date,
      end_date: updates.end_date ?? objective.end_date,
    };

    ["start_date", "end_date"].forEach((field) => {
      if (payload[field]) {
        const d = new Date(payload[field]);
        payload[field] = d.toISOString().slice(0, 10);
      }
    });

    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/objectives/${objective.objective_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        showToast("Objective updated");
        setEditedObjectives((prev) => {
          const copy = { ...prev };
          delete copy[objective.objective_id];
          return copy;
        });
        fetchObjectives();
      }
    } catch (err) {
      console.error("Failed to update objective", err);
    }
  };

  const handleDelete = async (objectiveId) => {
    if (!window.confirm("Delete this objective?")) return;
    try {
      const res = await fetch(`https://notesvia.duckdns.org/api/objectives/${objectiveId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        showToast("Objective deleted");
        fetchObjectives();
      }
    } catch (err) {
      console.error("Failed to delete objective", err);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="page-manage-objectives-container">
      <h2>Manage Objectives</h2>
      {toast && <div className="page-manage-objectives-toast">{toast}</div>}

      <div className="page-manage-objectives-form">
        <select
          value={selectedIndividualId}
          onChange={(e) => {
            setSelectedIndividualId(e.target.value);
            setSelectedGoalId("");
            setGoals([]);
            setObjectives([]);
          }}
        >
          <option value="">-- Select Individual --</option>
          {individuals.map((ind) => (
            <option key={ind.individual_id} value={ind.individual_id}>
              {ind.name}
            </option>
          ))}
        </select>
      </div>

      {selectedIndividualId && (
        <div className="page-manage-objectives-form">
          <select
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
          >
            <option value="">-- Select Goal --</option>
            {goals.map((goal) => (
              <option key={goal.goal_id} value={goal.goal_id}>
                {goal.goal_description}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedGoalId && (
        <>
          <div className="page-manage-objectives-form">
            <input
              type="text"
              placeholder="Objective Code"
              value={newObjective.objective_code}
              onChange={(e) => handleChange("objective_code", e.target.value)}
            />
            <input
              type="text"
              placeholder="Objective Description"
              value={newObjective.objective_description}
              onChange={(e) => handleChange("objective_description", e.target.value)}
            />
            <input
              type="text"
              placeholder="Frequency"
              value={newObjective.frequency}
              onChange={(e) => handleChange("frequency", e.target.value)}
            />
            <input
              type="date"
              value={formatDateForInput(newObjective.start_date)}
              onChange={(e) => handleChange("start_date", e.target.value)}
            />
            <input
              type="date"
              value={formatDateForInput(newObjective.end_date)}
              onChange={(e) => handleChange("end_date", e.target.value)}
            />
            <button onClick={handleAdd}>Add Objective</button>
          </div>

          <div className="page-manage-objectives-list">
            {objectives.map((objective) => {
              const edits = editedObjectives[objective.objective_id] || {};
              return (
                <div key={objective.objective_id} className="page-manage-objectives-row">
                  <input
                    type="text"
                    value={edits.objective_code ?? objective.objective_code}
                    onChange={(e) =>
                      handleEditChange(objective.objective_id, "objective_code", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    value={edits.objective_description ?? objective.objective_description}
                    onChange={(e) =>
                      handleEditChange(objective.objective_id, "objective_description", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    value={edits.frequency ?? objective.frequency}
                    onChange={(e) =>
                      handleEditChange(objective.objective_id, "frequency", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    value={
                      edits.start_date !== undefined
                        ? edits.start_date
                        : formatDateForInput(objective.start_date)
                    }
                    onChange={(e) =>
                      handleEditChange(objective.objective_id, "start_date", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    value={
                      edits.end_date !== undefined
                        ? edits.end_date
                        : formatDateForInput(objective.end_date)
                    }
                    onChange={(e) =>
                      handleEditChange(objective.objective_id, "end_date", e.target.value)
                    }
                  />
                  <button onClick={() => handleSave(objective)}>Save</button>
                  <button onClick={() => handleDelete(objective.objective_id)}>Delete</button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PageManageObjectives;
