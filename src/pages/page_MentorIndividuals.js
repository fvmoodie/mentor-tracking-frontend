import React, { useEffect, useState } from "react";
import "../styles/page_MentorIndividuals.css";

const PageMentorIndividuals = ({ API_URL }) => {
  const [individuals, setIndividuals] = useState([]);

  useEffect(() => {
    const mentorId = localStorage.getItem("mentor_id");
    if (mentorId) {
      fetch(`${API_URL}/individuals/mentor/${mentorId}`)
        .then((res) => res.json())
        .then((data) => setIndividuals(data))
        .catch((err) => console.error("Error fetching individuals:", err));
    }
  }, [API_URL]);

  return (
    <div className="page-mentor-individuals-container">
      <h2 className="page-mentor-individuals-title">My Assigned Individuals</h2>
      <div className="page-mentor-individuals-table-wrapper">
        <table className="page-mentor-individuals-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Date of Birth</th>
              <th>Behavior Plan</th>
              <th>Mentor</th>
            </tr>
          </thead>
          <tbody>
            {individuals.map((individual) => (
              <tr key={individual.id}>
                <td>{individual.full_name}</td>
                <td>{new Date(individual.dob).toLocaleDateString()}</td>
                <td>{individual.behavior_plan ? "Yes" : "No"}</td>
                <td>{individual.mentor_name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageMentorIndividuals;
