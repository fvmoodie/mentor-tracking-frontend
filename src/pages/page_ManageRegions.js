import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import "../styles/page_ManageRegions.css";

const Page_ManageRegions = ({ API_URL }) => {
  const [regions, setRegions] = useState([]);
  const [newRegion, setNewRegion] = useState("");
  const [editingRegionIndex, setEditingRegionIndex] = useState(null);
  const [editedRegion, setEditedRegion] = useState("");

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await fetch(`${API_URL}/regions`);
      if (!response.ok) throw new Error("Failed to fetch regions");
      const data = await response.json();
      setRegions(data);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const handleAddRegion = async () => {
    if (!newRegion.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/regions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRegion }),
      });
      if (!response.ok) throw new Error("Failed to add region");

      setNewRegion("");
      fetchRegions();
    } catch (error) {
      console.error("Error adding region:", error);
    }
  };

  const handleEditRegion = (index, region) => {
    setEditingRegionIndex(index);
    setEditedRegion(region.name);
  };

  const handleSaveRegion = async () => {
    if (!editedRegion.trim() || editingRegionIndex === null) return;
    const regionId = regions[editingRegionIndex]?.id;
    if (!regionId) return;
    try {
      const response = await fetch(`${API_URL}/regions/${regionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedRegion }),
      });
      if (response.ok) {
        fetchRegions();
        setEditingRegionIndex(null);
        setEditedRegion("");
      }
    } catch (error) {
      console.error("Error updating region:", error);
    }
  };

  return (
    <div className="page-region-management">
      <h3>Manage Regions</h3>
      <div className="page-region-input-container">
        <input type="text" placeholder="Enter new region" value={newRegion} onChange={(e) => setNewRegion(e.target.value)} className="page-region-input" />
        <button className="page-add-region-button" onClick={handleAddRegion}>+ Add Region</button>
      </div>
      <ul className="page-region-list">
        {regions.length ? (
          regions.map((region, index) => (
            <li key={region.id} className="page-region-item">
              {editingRegionIndex === index ? (
                <>
                  <input value={editedRegion} onChange={(e) => setEditedRegion(e.target.value)} className="page-region-input" />
                  <button className="page-save-region-button" onClick={handleSaveRegion}>Save</button>
                  <button className="page-cancel-region-button" onClick={() => setEditingRegionIndex(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {region.name}
                  <button className="page-edit-region-button" onClick={() => handleEditRegion(index, region)}>
                    <FaEdit />
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No regions found.</p>
        )}
      </ul>
    </div>
  );
};

export default Page_ManageRegions;
