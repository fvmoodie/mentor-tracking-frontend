import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import "../styles/page_ManageMentors.css"; // ✅ Ensure the CSS file exists

const Page_ManageMentors = ({ API_URL }) => {
  const [mentors, setMentors] = useState([]);
  const [newMentor, setNewMentor] = useState("");
  const [editingMentorIndex, setEditingMentorIndex] = useState(null);
  const [editedMentor, setEditedMentor] = useState("");

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await fetch(`${API_URL}/mentors`);
      if (!response.ok) throw new Error("Failed to fetch mentors");
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  const handleAddMentor = async () => {
    if (!newMentor.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/mentors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newMentor }),
      });
      if (!response.ok) throw new Error("Failed to add mentor");

      setNewMentor("");
      fetchMentors();
    } catch (error) {
      console.error("Error adding mentor:", error);
    }
  };

  const handleEditMentor = (index, mentor) => {
    setEditingMentorIndex(index);
    setEditedMentor(mentor.name);
  };

  const handleSaveMentor = async () => {
    if (!editedMentor.trim() || editingMentorIndex === null) return;
    const mentorId = mentors[editingMentorIndex]?.id;
    if (!mentorId) return;
    try {
      const response = await fetch(`${API_URL}/mentors/${mentorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedMentor }),
      });
      if (response.ok) {
        fetchMentors();
        setEditingMentorIndex(null);
        setEditedMentor("");
      }
    } catch (error) {
      console.error("Error updating mentor:", error);
    }
  };

  return (
    <div className="page-mentor-management">
      <h3>Manage Mentors</h3>
      <div className="page-mentor-input-container">
        <input type="text" placeholder="Enter new mentor" value={newMentor} onChange={(e) => setNewMentor(e.target.value)} className="page-mentor-input" />
        <button className="page-add-mentor-button" onClick={handleAddMentor}>+ Add Mentor</button>
      </div>
      <ul className="page-mentor-list">
        {mentors.length ? (
          mentors.map((mentor, index) => (
            <li key={mentor.id} className="page-mentor-item">
              {editingMentorIndex === index ? (
                <>
                  <input value={editedMentor} onChange={(e) => setEditedMentor(e.target.value)} className="page-mentor-input" />
                  <button className="page-save-mentor-button" onClick={handleSaveMentor}>Save</button>
                  <button className="page-cancel-mentor-button" onClick={() => setEditingMentorIndex(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {mentor.name}
                  <button className="page-edit-mentor-button" onClick={() => handleEditMentor(index, mentor)}>
                    <FaEdit />
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No mentors found.</p>
        )}
      </ul>
    </div>
  );
};

export default Page_ManageMentors;
