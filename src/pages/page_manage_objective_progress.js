import React, { useEffect, useState } from "react";
import "../styles/page_manage_objective_progress.css";

const PageManageObjectiveProgress = () => {
  const [individuals, setIndividuals] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [selectedIndividualId, setSelectedIndividualId] = useState("");
  const [selectedObjectiveId, setSelectedObjectiveId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [objectiveDescription, setObjectiveDescription] = useState("");
  const [existingRecord, setExistingRecord] = useState(null);
  const [progressData, setProgressData] = useState({
    key_focus: "",
    prompt_code: "",
    progress_rating: "",
    progress_evidence: "",
    response: "",
    plan: "",
  });
  const [toast, setToast] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchIndividuals();
  }, []);

  useEffect(() => {
    if (selectedIndividualId) {
      fetchObjectivesForIndividual();
    }
  }, [selectedIndividualId]);

  useEffect(() => {
    if (selectedIndividualId && selectedObjectiveId && selectedDate) {
      detectProgressRecord();
    }
  }, [selectedIndividualId, selectedObjectiveId, selectedDate]);

  const fetchIndividuals = async () => {
    try {
      const res = await fetch("https://notesvia.duckdns.org/api/individuals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setIndividuals(data);
    } catch (err) {
      console.error("Failed to fetch individuals", err);
    }
  };

  const fetchObjectivesForIndividual = async () => {
    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/objectives/individual/${selectedIndividualId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setObjectives(data);
    } catch (err) {
      console.error("Failed to fetch objectives", err);
    }
  };

  const detectProgressRecord = async () => {
    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/objective-progress/${selectedIndividualId}?objective_id=${selectedObjectiveId}&date=${selectedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.length > 0) {
        setExistingRecord(data[0]);
        setProgressData({
          key_focus: data[0].key_focus || "",
          prompt_code: data[0].prompt_code || "",
          progress_rating: data[0].progress_rating || "",
          progress_evidence: data[0].progress_evidence || "",
          response: data[0].response || "",
          plan: data[0].plan || "",
        });
      } else {
        setExistingRecord(null);
        setProgressData({
          key_focus: "",
          prompt_code: "",
          progress_rating: "",
          progress_evidence: "",
          response: "",
          plan: "",
        });
      }
    } catch (err) {
      console.error("Failed to detect existing record", err);
    }
  };

  const handleChange = (field, value) => {
    setProgressData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const payload = {
      ...progressData,
      individual_id: selectedIndividualId,
      objective_id: selectedObjectiveId,
      encounter_date: selectedDate,
    };

    try {
        const url = existingRecord
        ? `https://notesvia.duckdns.org/api/objective-progress/${existingRecord.progress_id}`
        : `https://notesvia.duckdns.org/api/objective-progress/${selectedIndividualId}`;
      const method = existingRecord ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(existingRecord ? "Progress updated" : "Progress saved");
        detectProgressRecord();
      } else {
        showToast(data?.error || "An error occurred");
      }
    } catch (err) {
      console.error("Save failed", err);
      showToast("Save failed");
    }
  };

  const handleDelete = async () => {
    if (!existingRecord) return;
    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/objective-progress/${existingRecord.progress_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        showToast("Progress record deleted");
        setExistingRecord(null);
        setProgressData({
          key_focus: "",
          prompt_code: "",
          progress_rating: "",
          progress_evidence: "",
          response: "",
          plan: "",
        });
      } else {
        showToast("Delete failed");
      }
    } catch (err) {
      console.error("Delete error", err);
      showToast("Delete failed");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="page-manage-objective-progress-container">
      <h2 className="page-manage-objective-progress-heading">Objective Progress</h2>
      {toast && <div className="page-manage-objective-progress-toast">{toast}</div>}

      <div className="page-manage-objective-progress-form">
                       <div className="page-manage-objective-progress-row">
                   <select
                     value={selectedIndividualId}
                     onChange={(e) => {
                       setSelectedIndividualId(e.target.value);
                       setSelectedObjectiveId("");
                       setObjectiveDescription("");
                     }}
                   >
                     <option value="">-- Select Individual --</option>
                     {individuals.map((ind) => (
                       <option key={ind.individual_id} value={ind.individual_id}>
                         {ind.name}
                       </option>
                     ))}
                   </select>
                 
                   <select
                     value={selectedObjectiveId}
                     onChange={(e) => {
                       setSelectedObjectiveId(e.target.value);
                       const selected = objectives.find(
                         (o) => o.objective_id === parseInt(e.target.value)
                       );
                       setObjectiveDescription(selected?.objective_description || "");
                     }}
                   >
                     <option value="">-- Select Objective --</option>
                     {objectives.map((obj) => (
                       <option key={obj.objective_id} value={obj.objective_id}>
                         {obj.objective_code}
                       </option>
                     ))}
                   </select>
                 
                   <input
                     type="date"
                     value={selectedDate}
                     onChange={(e) => setSelectedDate(e.target.value)}
                   />
                 </div>
                 
                 {objectiveDescription && (
                   <div className="page-manage-objective-progress-description">
                     📘 {objectiveDescription}
                   </div>
                 )}
                         <div className="page-manage-objective-progress-row-inline">
        <select
          value={progressData.key_focus}
          onChange={(e) => handleChange("key_focus", e.target.value)}
        >
          <option value="">-- Key Focus --</option>
          <option value="I">I</option>
          <option value="H">H</option>
          <option value="A">A</option>
          <option value="R">R</option>
          <option value="PA">PA</option>
        </select>

        <select
          value={progressData.prompt_code}
          onChange={(e) => handleChange("prompt_code", e.target.value)}
        >
          <option value="">-- Prompt Code --</option>
          <option value="0VP">0VP</option>
          <option value="1VP">1VP</option>
          <option value="2VP">2VP</option>
          <option value="3VP">3VP</option>
        </select>

        <select
          value={progressData.progress_rating}
          onChange={(e) => handleChange("progress_rating", e.target.value)}
        >
          <option value="">-- Progress Rating --</option>
          <option value="Some Progress">Some Progress</option>
          <option value="Regression">Regression</option>
          <option value="No Change">No Change</option>
          <option value="Complete">Complete</option>
        </select>
        </div>
        <textarea
          placeholder="Progress Evidence..."
          value={progressData.progress_evidence}
          onChange={(e) => handleChange("progress_evidence", e.target.value)}
        />
        <textarea
          placeholder="Response..."
          value={progressData.response}
          onChange={(e) => handleChange("response", e.target.value)}
        />
        <textarea
          placeholder="Plan..."
          value={progressData.plan}
          onChange={(e) => handleChange("plan", e.target.value)}
        />

        <div className="page-objective-progress-actions">
          <button className="page-objective-progress-btn" onClick={handleSave}>
            {existingRecord ? "Update Progress" : "Save Progress"}
          </button>
          {existingRecord && (
            <button
              className="page-objective-progress-btn delete"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageManageObjectiveProgress;
