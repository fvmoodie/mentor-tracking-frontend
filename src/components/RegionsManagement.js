import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import "../styles/RegionManagement.css";

const API_URL = "http://167.71.169.127:5000/api/regions"; // ✅ Updated API endpoint

const RegionsManagement = () => {
  const [regions, setRegions] = useState([]); // ✅ Store region list
  const [selectedRegion, setSelectedRegion] = useState(null); // ✅ Store selected region
  const [newRegion, setNewRegion] = useState({ RegionName: "", Description: "" }); // ✅ Store new region input
  const [loading, setLoading] = useState(true); // ✅ Track API loading state
  const [error, setError] = useState(null); // ✅ Track API errors
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_URL);
      const data = await response.json();

      console.log("✅ API Response:", data); // ✅ Debugging log

      if (!data.regions || !Array.isArray(data.regions)) {
        throw new Error("Invalid API response format");
      }

      setRegions(data.regions); // ✅ Correctly set regions
    } catch (error) {
      console.error("❌ Error fetching regions:", error);
      setError("Failed to fetch regions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedRegion(null); // ✅ Deselect any selected region
    setNewRegion({ RegionName: "", Description: "" }); // ✅ Open a blank form
  };

  const handleInputChange = (e) => {
    setNewRegion({ ...newRegion, [e.target.name]: e.target.value });
  };

  const handleSaveNewRegion = async () => {
    if (!newRegion.RegionName.trim()) {
      alert("Region Name is required!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: selectedRegion ? "PUT" : "POST", // ✅ Support editing
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRegion),
      });

      if (!response.ok) {
        throw new Error("Failed to save region");
      }

      fetchRegions(); // ✅ Refresh region list
      setNewRegion({ RegionName: "", Description: "" }); // ✅ Reset form
      setSelectedRegion(null); // ✅ Deselect after saving
    } catch (error) {
      console.error("❌ Error saving region:", error);
      alert("Error saving region. Please try again.");
    }
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    setNewRegion({ RegionName: region.RegionName, Description: region.Description }); // ✅ Pre-fill for future editing
  };

  return (
    <div className="container">
      {/* ✅ Top Row: Logo, Title, Add Button, and Back Button */}
      <div className="top-row">
        <div className="top-left">
          <img src="/assets/MainLogo.png" alt="Main Logo" className="main-logo" />
          <span className="welcome-text">Regions Management</span>
        </div>
        <div className="top-right">
          <div className="top-controls">
            <Suspense fallback={<div>Loading...</div>}>
              <FaPlus className="icon add-icon large-icon" title="Add New Region" onClick={handleAddNew} />
              <FaArrowLeft className="icon back-icon large-icon" title="Back to Dashboard" onClick={() => navigate("/admin-dashboard")} />
            </Suspense>
          </div>
          <img src="/assets/TopLogo.png" alt="Top Logo" className="top-logo" />
        </div>
      </div>

      {/* Top Row 2: Reduced Height */}
      {<div className="top-row-2"></div>}

      {/* ✅ Middle Section: Region List & Add/Edit Form */}
      <div className="middle-row">
        {/* ✅ Column 1: Region List */}
        <div className="column features-column">
          <h2 className="section-title">Regions ({regions.length})</h2>

          {loading ? (
            <p>Loading regions...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : regions.length === 0 ? (
            <p>No regions available. Please add the first region.</p>
          ) : (
            <ul className="regions-list">
              {regions.map((region) => (
                <li
                  key={region.RegionID}
                  className={`region-item ${selectedRegion?.RegionID === region.RegionID ? "selected" : ""}`}
                  onClick={() => handleSelectRegion(region)}
                >
                  {region.RegionName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ✅ Column 3: Add/Edit Form */}
        <div className="column support-column">
          <h2>{selectedRegion ? "Edit Region" : "Add New Region"}</h2>
          <label>Region Name</label>
          <input
            type="text"
            name="RegionName"
            placeholder="Enter region name"
            value={newRegion.RegionName}
            onChange={handleInputChange}
          />
          <label>Description</label>
          <textarea
            name="Description"
            placeholder="Enter description"
            value={newRegion.Description}
            onChange={handleInputChange}
          ></textarea>
          <button onClick={handleSaveNewRegion}>
            {selectedRegion ? "Update Region" : "Add Region"}
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        <footer>
          <p>Privacy | Security | &#169; 2025 NotesVia</p>
        </footer>
      </div>
    </div>
  );
};

export default RegionsManagement;
