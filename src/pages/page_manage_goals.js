import React, { useEffect, useState } from "react";
import "../styles/page_manage_goals.css";

const PageManageGoals = () => {
  const [individuals, setIndividuals] = useState([]);
  const [selectedIndividualId, setSelectedIndividualId] = useState("");
  const [goals, setGoals] = useState([]);
  const [editedGoals, setEditedGoals] = useState({});
  const [newGoal, setNewGoal] = useState({
    goal_code: "",
    goal_description: "",
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
      console.error("Failed to fetch goals", err);
    }
  };

  const handleChange = (field, value) => {
    setNewGoal((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditChange = (id, field, value) => {
    setEditedGoals((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleAdd = async () => {
    if (!newGoal.goal_description) {
      showToast("Goal description is required");
      return;
    }

    const payload = { ...newGoal };
    ["start_date", "end_date"].forEach((field) => {
      if (payload[field]) {
        const d = new Date(payload[field]);
        payload[field] = d.toISOString().slice(0, 10);
      }
    });

    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/goals/individuals/${selectedIndividualId}/goals`,
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
        showToast("Goal added");
        setNewGoal({
          goal_code: "",
          goal_description: "",
          start_date: "",
          end_date: "",
        });
        fetchGoals();
      }
    } catch (err) {
      console.error("Failed to add goal", err);
    }
  };

  const handleSave = async (goal) => {
    const updates = editedGoals[goal.goal_id];
    if (!updates) return;

    const payload = {
      goal_code: updates.goal_code ?? goal.goal_code,
      goal_description: updates.goal_description ?? goal.goal_description,
      start_date: updates.start_date ?? goal.start_date,
      end_date: updates.end_date ?? goal.end_date,
    };

    ["start_date", "end_date"].forEach((field) => {
      if (payload[field]) {
        const d = new Date(payload[field]);
        payload[field] = d.toISOString().slice(0, 10);
      }
    });

    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/goals/${goal.goal_id}`,
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
        showToast("Goal updated");
        setEditedGoals((prev) => {
          const copy = { ...prev };
          delete copy[goal.goal_id];
          return copy;
        });
        fetchGoals();
      }
    } catch (err) {
      console.error("Failed to update goal", err);
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      const res = await fetch(`https://notesvia.duckdns.org/api/goals/${goalId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        showToast("Goal deleted");
        fetchGoals();
      }
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="page-manage-goals-container">
      <h2>Manage Goals</h2>
      {toast && <div className="page-manage-goals-toast">{toast}</div>}

      <div className="page-manage-goals-form">
        <select
          value={selectedIndividualId}
          onChange={(e) => setSelectedIndividualId(e.target.value)}
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
        <>
          <div className="page-manage-goals-form">
            <input
              type="text"
              placeholder="Goal Code"
              className="goal-code"
              value={newGoal.goal_code}
              onChange={(e) => handleChange("goal_code", e.target.value)}
            />
            <input
              type="text"
              placeholder="Goal Description"
              className="goal-description"
              value={newGoal.goal_description}
              onChange={(e) => handleChange("goal_description", e.target.value)}
            />
            <input
              type="date"
              className="goal-date"
              value={formatDateForInput(newGoal.start_date)}
              onChange={(e) => handleChange("start_date", e.target.value)}
            />
            <input
              type="date"
              className="goal-date"
              value={formatDateForInput(newGoal.end_date)}
              onChange={(e) => handleChange("end_date", e.target.value)}
            />
            <button onClick={handleAdd}>Add Goal</button>
          </div>

          <div className="page-manage-goals-list">
            {goals.map((goal) => {
              const edits = editedGoals[goal.goal_id] || {};
              return (
                <div key={goal.goal_id} className="page-manage-goals-row">
                  <input
                    type="text"
                    className="goal-code"
                    value={edits.goal_code ?? goal.goal_code}
                    onChange={(e) =>
                      handleEditChange(goal.goal_id, "goal_code", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="goal-description"
                    value={edits.goal_description ?? goal.goal_description}
                    onChange={(e) =>
                      handleEditChange(goal.goal_id, "goal_description", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    className="goal-date"
                    value={
                      edits.start_date !== undefined
                        ? edits.start_date
                        : formatDateForInput(goal.start_date)
                    }
                    onChange={(e) =>
                      handleEditChange(goal.goal_id, "start_date", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    className="goal-date"
                    value={
                      edits.end_date !== undefined
                        ? edits.end_date
                        : formatDateForInput(goal.end_date)
                    }
                    onChange={(e) =>
                      handleEditChange(goal.goal_id, "end_date", e.target.value)
                    }
                  />
                  <button onClick={() => handleSave(goal)}>Save</button>
                  <button onClick={() => handleDelete(goal.goal_id)}>Delete</button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PageManageGoals;
