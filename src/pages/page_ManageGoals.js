import React, { useEffect, useState, useRef } from "react";
import "../styles/page_ManageGoals.css";
import { FaPlus, FaEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";

const PageManageGoals = ({ API_URL }) => {
  const [goals, setGoals] = useState([]);
  const [individuals, setIndividuals] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    individual_id: "",
    goal_code: "",
    description: "",
    start_date: "",
    end_date: ""
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

        const [goalsRes, individualsRes] = await Promise.all([
          fetch(`${API_URL}/goals`),
          fetch(`${API_URL}/individuals`)
        ]);

        if (!goalsRes.ok) throw new Error(`Failed to fetch goals: ${goalsRes.status}`);
        if (!individualsRes.ok) throw new Error(`Failed to fetch individuals: ${individualsRes.status}`);

        const goalsData = await goalsRes.json();
        console.log("GOALS RESPONSE:", goalsData); // <-- add this

        const individualsData = await individualsRes.json();

        setGoals(Array.isArray(goalsData) ? goalsData : []);
        setIndividuals(Array.isArray(individualsData) ? individualsData : []);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (goal) => {
    setEditingId(goal.id);
    setFormData({
      id: goal.id,
      individual_id: goal.individual_id,
      goal_code: goal.goal_code,
      description: goal.description || "",
      start_date: goal.start_date?.split("T")[0] || "",
      end_date: goal.end_date?.split("T")[0] || ""
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
      individual_id: "",
      goal_code: "",
      description: "",
      start_date: "",
      end_date: ""
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      id: null,
      individual_id: "",
      goal_code: "",
      description: "",
      start_date: "",
      end_date: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.goal_code || !formData.description || !formData.individual_id) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const endpoint = formData.id
        ? `${API_URL}/goals/${formData.id}`
        : `${API_URL}/goals`;
      const method = formData.id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save goal");
      }

      const updatedRes = await fetch(`${API_URL}/goals`);
      const updatedData = await updatedRes.json();
      setGoals(Array.isArray(updatedData) ? updatedData : []);
      handleCancel();
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-goal-management">
      <div className="page-goal-header">
        <h3>Manage Goals</h3>
        <button className="page-add-goal-btn" onClick={handleAdd} disabled={submitting}>
          <FaPlus /> Add Goal
        </button>
      </div>
      <div className="page-goal-table-wrapper">
        <table className="page-goal-table">
          <thead>
            <tr>
              <th>Goal Code</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Individual</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {goals.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data-message">
                  No goals found. Click "Add Goal" to create one.
                </td>
              </tr>
            ) : (
              goals.map((goal) => (
                <React.Fragment key={goal.id}>
                  <tr>
                    <td>{goal.goal_code}</td>
                    <td>{goal.description}</td>
                    <td>{formatDateDisplay(goal.start_date)}</td>
                    <td>{formatDateDisplay(goal.end_date)}</td>
                    <td>{individuals.find(i => i.id === goal.individual_id)?.full_name || "N/A"}</td>
                    <td>
                      <button
                        className="page-edit-individual-button"
                        onClick={() => handleEdit(goal)}
                        disabled={submitting}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                  {editingId === goal.id && (
                    <tr>
                      <td colSpan="6">
                        <div className="page-goal-edit-section" ref={editSectionRef}>
                          <div className="page-goal-input-group">
                            <label>Goal Code *</label>
                            <input
                              type="text"
                              name="goal_code"
                              value={formData.goal_code}
                              onChange={handleInputChange}
                              className="goal-input-field"
                              required
                            />
                          </div>
                          <div className="page-goal-input-group">
                            <label>Description *</label>
                            <input
                              type="text"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              className="goal-input-field"
                              required
                            />
                          </div>
                          <div className="page-goal-input-group">
                            <label>Start Date</label>
                            <input
                              type="date"
                              name="start_date"
                              value={formData.start_date}
                              onChange={handleInputChange}
                              className="goal-input-field"
                            />
                          </div>
                          <div className="page-goal-input-group">
                            <label>End Date</label>
                            <input
                              type="date"
                              name="end_date"
                              value={formData.end_date}
                              onChange={handleInputChange}
                              className="goal-input-field"
                            />
                          </div>
                          <div className="page-goal-input-group">
                            <label>Select Individual *</label>
                            <select
                              name="individual_id"
                              value={formData.individual_id}
                              onChange={handleInputChange}
                              className="goal-input-field"
                              required
                            >
                              <option value="">Select Individual</option>
                              {individuals.map((ind) => (
                                <option key={ind.id} value={ind.id}>
                                  {ind.full_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="page-goal-button-group">
                            <button className="page-save-goal-button" onClick={handleSubmit} disabled={submitting}>
                              {submitting ? <FaSpinner className="spinner-icon" /> : <FaSave />}
                              {submitting ? " Saving..." : " Save"}
                            </button>
                            <button className="page-cancel-goal-button" onClick={handleCancel} disabled={submitting}>
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageManageGoals;
