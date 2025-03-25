import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import "../styles/IndividualsPage.css";

const API_URL = "http://167.71.169.127:5000/api/individuals"; // ✅ Updated API endpoint

const IndividualsPage = () => {
  const [individuals, setIndividuals] = useState([]);
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const [newIndividual, setNewIndividual] = useState({ FullName: "", DOB: "", BehaviorPlan: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIndividuals();
  }, []);

  const fetchIndividuals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_URL);
      const data = await response.json();

      console.log("✅ API Response:", data);

      if (!data.individuals || !Array.isArray(data.individuals)) {
        throw new Error("Invalid API response format");
      }

      setIndividuals(data.individuals);
    } catch (error) {
      console.error("❌ Error fetching individuals:", error);
      setError("Failed to fetch individuals. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedIndividual(null);
    setNewIndividual({ FullName: "", DOB: "", BehaviorPlan: 0 });
  };

  const handleInputChange = (e) => {
    setNewIndividual({ ...newIndividual, [e.target.name]: e.target.value });
  };

  const handleSaveIndividual = async () => {
    if (!newIndividual.FullName.trim()) {
      alert("Full Name is required!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: selectedIndividual ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "UserID": "3" },
        body: JSON.stringify(newIndividual),
      });

      if (!response.ok) {
        throw new Error("Failed to save individual");
      }

      fetchIndividuals();
      setNewIndividual({ FullName: "", DOB: "", BehaviorPlan: 0 });
      setSelectedIndividual(null);
    } catch (error) {
      console.error("❌ Error saving individual:", error);
      alert("Error saving individual. Please try again.");
    }
  };

  const handleSelectIndividual = (individual) => {
    setSelectedIndividual(individual);
    setNewIndividual({ FullName: individual.FullName, DOB: individual.DOB, BehaviorPlan: individual.BehaviorPlan });
  };

  return (
    <div className="layout-container">
      {/* ✅ Top Row: Logo, Title, Add Button, and Back Button */}
      <div className="layout-header">
        <div className="layout-header-left">
          <img src="/assets/MainLogo.png" alt="Main Logo" className="layout-logo" />
          <span className="layout-welcome-text">Individuals Management</span>
        </div>
        <div className="layout-header-right">
          <div className="layout-controls">
            <Suspense fallback={<div>Loading...</div>}>
              <FaPlus className="layout-icon add-icon" title="Add New Individual" onClick={handleAddNew} />
              <FaArrowLeft className="layout-icon back-icon" title="Back to Dashboard" onClick={() => navigate("/admin-dashboard")} />
            </Suspense>
          </div>
          <img src="/assets/TopLogo.png" alt="Top Logo" className="layout-top-logo" />
        </div>
      </div>

      {/* ✅ Middle Section: Individuals List & Add/Edit Form */}
      <div className="layout-middle-section">
        {/* ✅ Column 1: Individuals List */}
        <div className="layout-column layout-left-column">
          <h2 className="section-title">Individuals ({individuals.length})</h2>

          {loading ? (
            <p>Loading individuals...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : individuals.length === 0 ? (
            <p>No individuals available. Please add a new individual.</p>
          ) : (
            <ul className="individuals-list">
              {individuals.map((individual) => (
                <li
                  key={individual.IndividualID}
                  className={`individual-item ${selectedIndividual?.IndividualID === individual.IndividualID ? "selected" : ""}`}
                  onClick={() => handleSelectIndividual(individual)}
                >
                  {individual.FullName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ✅ Column 2: Add/Edit Form */}
        <div className="layout-column layout-center-column">
          <h2>{selectedIndividual ? "Edit Individual" : "Add New Individual"}</h2>
          <label>Full Name</label>
          <input
            type="text"
            name="FullName"
            placeholder="Enter full name"
            value={newIndividual.FullName}
            onChange={handleInputChange}
          />
          <label>Date of Birth</label>
          <input
            type="date"
            name="DOB"
            value={newIndividual.DOB}
            onChange={handleInputChange}
          />
          <label>Behavior Plan</label>
          <select name="BehaviorPlan" value={newIndividual.BehaviorPlan} onChange={handleInputChange}>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
          <button onClick={handleSaveIndividual}>
            {selectedIndividual ? "Update Individual" : "Add Individual"}
          </button>
        </div>
      </div>

      {/* ✅ Bottom Row */}
      <div className="layout-footer">
        <footer>
          <p>Privacy | Security | &#169; 2025 NotesVia</p>
        </footer>
      </div>
    </div>
  );
};

export default IndividualsPage;
