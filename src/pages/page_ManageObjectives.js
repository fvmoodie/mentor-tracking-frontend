import React, { useEffect, useState, useRef } from "react";
import "../styles/page_ManageObjectives.css";
import { FaPlus, FaEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { formatDateFields } from "../utils/dateUtils";

const PageManageObjectives = ({ API_URL }) => {
  const [objectives, setObjectives] = useState([]);
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    goal_id: "",
    objective_code: "",
    description: "",
    frequency: "Weekly",
    start_date_ui: "",
    start_date_backend: "",
    end_date_ui: "",
    end_date_backend: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const editSectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [objectivesRes, goalsRes] = await Promise.all([
          fetch(`${API_URL}/objectives`),
          fetch(`${API_URL}/goals`)
        ]);

        if (!objectivesRes.ok) throw new Error(`Failed to fetch objectives: ${objectivesRes.status}`);
        if (!goalsRes.ok) throw new Error(`Failed to fetch goals: ${goalsRes.status}`);

        const objectivesData = await objectivesRes.json();
        const goalsData = await goalsRes.json();

        setObjectives(Array.isArray(objectivesData) ? objectivesData : []);
        setGoals(Array.isArray(goalsData) ? goalsData : []);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "start_date") {
      setFormData(prev => ({
        ...prev,
        start_date_ui: value,
        start_date_backend: value || null
      }));
    } else if (name === "end_date") {
      setFormData(prev => ({
        ...prev,
        end_date_ui: value,
        end_date_backend: value || null
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (objective) => {
    const start = formatDateFields(objective.start_date);
    const end = formatDateFields(objective.end_date);
    setEditingId(objective.id);
    setFormData({
      id: objective.id,
      goal_id: objective.goal_id,
      objective_code: objective.objective_code,
      description: objective.description,
      frequency: objective.frequency,
      start_date_ui: start.ui,
      start_date_backend: start.backend,
      end_date_ui: end.ui,
      end_date_backend: end.backend
    });
    setShowForm(true);
    setTimeout(() => {
      editSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      id: null,
      goal_id: "",
      objective_code: "",
      description: "",
      frequency: "Weekly",
      start_date_ui: "",
      start_date_backend: "",
      end_date_ui: "",
      end_date_backend: ""
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      id: null,
      goal_id: "",
      objective_code: "",
      description: "",
      frequency: "Weekly",
      start_date_ui: "",
      start_date_backend: "",
      end_date_ui: "",
      end_date_backend: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.objective_code || !formData.description || !formData.goal_id) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const endpoint = formData.id
        ? `${API_URL}/objectives/${formData.id}`
        : `${API_URL}/objectives`;
      const method = formData.id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.id,
          goal_id: formData.goal_id,
          objective_code: formData.objective_code,
          description: formData.description,
          frequency: formData.frequency,
          start_date: formData.start_date_backend,
          end_date: formData.end_date_backend
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save objective");
      }

      const updatedRes = await fetch(`${API_URL}/objectives`);
      const updatedData = await updatedRes.json();
      setObjectives(Array.isArray(updatedData) ? updatedData : []);
      handleCancel();
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-objective-management">
      <div className="page-objective-header">
        <h3>Manage Objectives</h3>
        <button className="page-add-objective-btn" onClick={handleAdd} disabled={submitting}>
          <FaPlus /> Add Objective
        </button>
      </div>
      <div className="page-objective-table-wrapper">
        <table className="page-objective-table">
          <thead>
            <tr>
              <th>Objective Code</th>
              <th>Description</th>
              <th>Frequency</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Goal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {objectives.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data-message">
                  No objectives found. Click "Add Objective" to create one.
                </td>
              </tr>
            ) : (
              objectives.map((obj) => (
                <React.Fragment key={obj.id}>
                  <tr>
                    <td>{obj.objective_code}</td>
                    <td>{obj.description}</td>
                    <td>{obj.frequency}</td>
                    <td>{formatDate(obj.start_date)}</td>
                    <td>{formatDate(obj.end_date)}</td>
                    <td>{goals.find(g => g.id === obj.goal_id)?.goal_code || "N/A"}</td>
                    <td>
                      <button
                        className="page-edit-individual-button"
                        onClick={() => handleEdit(obj)}
                        disabled={submitting}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
            {showForm && (
              <tr>
                <td colSpan="7">
                  <div className="page-objective-edit-section" ref={editSectionRef}>
                    <div className="page-objective-input-group">
                      <label>Objective Code *</label>
                      <input
                        type="text"
                        name="objective_code"
                        value={formData.objective_code}
                        onChange={handleInputChange}
                        className="objective-input-field"
                        required
                      />
                    </div>
                    <div className="page-objective-input-group">
                      <label>Description *</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="objective-input-field"
                        required
                      />
                    </div>
                    <div className="page-objective-input-group">
                      <label>Frequency *</label>
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleInputChange}
                        className="objective-input-field"
                        required
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    <div className="page-objective-input-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date_ui}
                        onChange={handleInputChange}
                        className="objective-input-field"
                      />
                    </div>
                    <div className="page-objective-input-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date_ui}
                        onChange={handleInputChange}
                        className="objective-input-field"
                      />
                    </div>
                    <div className="page-objective-input-group">
                      <label>Select Goal *</label>
                      <select
                        name="goal_id"
                        value={formData.goal_id}
                        onChange={handleInputChange}
                        className="objective-input-field"
                        required
                      >
                        <option value="">Select Goal</option>
                        {goals.map((goal) => (
                          <option key={goal.id} value={goal.id}>
                            {goal.goal_code} - {goal.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="page-objective-button-group">
                      <button
                        className="page-save-objective-button"
                        onClick={handleSubmit}
                        disabled={submitting}
                      >
                        {submitting ? <FaSpinner className="spinner-icon" /> : <FaSave />}
                        {submitting ? " Saving..." : " Save"}
                      </button>
                      <button
                        className="page-cancel-objective-button"
                        onClick={handleCancel}
                        disabled={submitting}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageManageObjectives;
