import React, { useEffect, useState, useRef } from "react";
import "../styles/page_ManageIndividuals.css";
import { FaPlus, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const PageManageIndividuals = ({ API_URL }) => {
  const [individuals, setIndividuals] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    full_name: "",
    dob: "",
    behavior_plan: 1,
    mentor_id: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const editSectionRef = useRef(null);

  useEffect(() => {
    fetchIndividuals();
    fetchMentors();
  }, []);

  const fetchIndividuals = async () => {
    const res = await fetch(`${API_URL}/individuals`);
    const data = await res.json();
    setIndividuals(data);
  };

  const fetchMentors = async () => {
    const res = await fetch(`${API_URL}/mentors`);
    const data = await res.json();
    setMentors(data);
  };

  const formatDate = (dob) => {
    if (!dob) return "N/A";
    const date = new Date(dob);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value
    }));
  };

  const handleEdit = (individual) => {
    setEditingId(individual.id);
    setFormData({
      id: individual.id,
      full_name: individual.full_name,
      dob: individual.dob.split("T")[0],
      behavior_plan: individual.behavior_plan,
      mentor_id: mentors.find((m) => m.name === individual.mentor_name)?.id || ""
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
      full_name: "",
      dob: "",
      behavior_plan: 1,
      mentor_id: ""
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      id: null,
      full_name: "",
      dob: "",
      behavior_plan: 1,
      mentor_id: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    console.log("Submitting DOB:", formData.dob);

    const endpoint = formData.id
      ? `${API_URL}/individuals/${formData.id}`
      : `${API_URL}/individuals`;
    const method = formData.id ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      await fetchIndividuals();
      handleCancel();
    } else {
      const err = await res.json();
      alert(err.error || "Something went wrong.");
    }
  };

  return (
    <div className="page-individual-management">
      <div className="page-individual-header">
        <h3>Manage Individuals</h3>
        <button className="page-add-btn" onClick={handleAdd}>
          <FaPlus /> Add Individual
        </button>
      </div>

      <div className="page-individual-table-wrapper">
        <table className="page-individual-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Date of Birth</th>
              <th>Behavior Plan</th>
              <th>Mentor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {individuals.map((ind) => (
              <React.Fragment key={ind.id}>
                <tr>
                  <td>{ind.full_name}</td>
                  <td>{formatDate(ind.dob)}</td>
                  <td>{ind.behavior_plan ? "Yes" : "No"}</td>
                  <td>{ind.mentor_name || "N/A"}</td>
                  <td>
                    <button
                      className="page-edit-individual-button"
                      onClick={() => handleEdit(ind)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
                {editingId === ind.id && (
                  <tr>
                    <td colSpan="5">
                      <div className="page-individual-edit-section" ref={editSectionRef}>
                        <div className="page-input-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            className="input-field"
                          />
                        </div>
                        <div className="page-input-group">
                          <label>Date of Birth</label>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="input-field"
                          />
                        </div>
                        <div className="individual-checkbox-group">
                          <input
                            type="checkbox"
                            id="behavior_plan"
                            name="behavior_plan"
                            checked={formData.behavior_plan === 1}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="behavior_plan">Behavior Plan</label>
                        </div>
                        <div className="page-input-group">
                          <label>Select Mentor</label>
                          <select
                            name="mentor_id"
                            value={formData.mentor_id}
                            onChange={handleInputChange}
                            className="input-field"
                          >
                            <option value="">Select Mentor</option>
                            {Array.isArray(mentors) ? (
                              mentors.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No mentors available</option>
                            )}
                          </select>
                        </div>
                        <div className="page-button-group">
                          <button className="page-save-individual-button" onClick={handleSubmit}>
                            <FaSave /> Save
                          </button>
                          <button className="page-cancel-individual-button" onClick={handleCancel}>
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {showForm && editingId === null && (
              <tr>
                <td colSpan="5">
                  <div className="page-individual-edit-section" ref={editSectionRef}>
                    <div className="page-input-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div className="page-input-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div className="individual-checkbox-group">
                      <input
                        type="checkbox"
                        id="behavior_plan"
                        name="behavior_plan"
                        checked={formData.behavior_plan === 1}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="behavior_plan">Behavior Plan</label>
                    </div>
                    <div className="page-input-group">
                      <label>Select Mentor</label>
                      <select
                        name="mentor_id"
                        value={formData.mentor_id}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Select Mentor</option>
                        {Array.isArray(mentors) ? (
                          mentors.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No mentors available</option>
                        )}
                      </select>
                    </div>
                    <div className="page-button-group">
                      <button className="page-save-individual-button" onClick={handleSubmit}>
                        <FaSave /> Save
                      </button>
                      <button className="page-cancel-individual-button" onClick={handleCancel}>
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

export default PageManageIndividuals;
