import React, { useEffect, useState } from "react";
import "../styles/page_manage_progress_notes.css";

const PageManageProgressNotes = () => {
  const [individuals, setIndividuals] = useState([]);
  const [selectedIndividualId, setSelectedIndividualId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [existingNote, setExistingNote] = useState(null);
  const [noteData, setNoteData] = useState({
    encounter_date: "",
    narrative_morning: "",
    narrative_afternoon: "",
    narrative_evening: "",
    day_program_details: "",
  });
  const [medicalSuppliesUsed, setMedicalSuppliesUsed] = useState([]);
  const [toast, setToast] = useState("");
  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("user_id"));

  const startVoiceInput = (field) => {
    if (!("webkitSpeechRecognition" in window)) {
      showToast("Voice input not supported in this browser");
      return;
    }
    if (existingNote) {
      showToast("Voice input is only available in add mode");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNoteData((prev) => ({ ...prev, [field]: (prev[field] || "") + " " + transcript }));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      showToast("Voice input failed");
    };

    recognition.start();
  };

  useEffect(() => {
    fetchIndividuals();
  }, []);

  useEffect(() => {
    if (selectedIndividualId && selectedDate) {
      detectNoteMode();
    }
  }, [selectedIndividualId, selectedDate]);

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

  const detectNoteMode = async () => {
    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/progress-notes/individuals/${selectedIndividualId}?date=${selectedDate}&include_details=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (!res.ok) {
        const text = await res.text();
        console.error("Non-JSON error:", text);
        showToast("Failed to detect existing note.");
        return;
      }
      const data = await res.json();
      if (data.length > 0) {
        const note = data[0];
        setExistingNote(note);
        setNoteData({
          encounter_date: selectedDate,
          narrative_morning: note.narrative_morning || "",
          narrative_afternoon: note.narrative_afternoon || "",
          narrative_evening: note.narrative_evening || "",
          day_program_details: note.day_program_details || "",
        });
        setMedicalSuppliesUsed(note.medical_supplies_used || []);
        showToast("Edit mode: record found for this date.");
      } else {
        setExistingNote(null);
        setNoteData({
          encounter_date: selectedDate,
          narrative_morning: "",
          narrative_afternoon: "",
          narrative_evening: "",
          day_program_details: "",
        });
        setMedicalSuppliesUsed([]);
        showToast("Add mode: no record exists for this date.");
      }
    } catch (err) {
      console.error("Failed to detect mode", err);
      showToast("Error detecting note mode.");
    }
  };

  const handleChange = (field, value) => {
    setNoteData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSupplyField = (index, field, value) => {
    const updated = [...medicalSuppliesUsed];
    updated[index][field] = value;
    setMedicalSuppliesUsed(updated);
  };

  const addSupplyEntry = () => {
    setMedicalSuppliesUsed([...medicalSuppliesUsed, { supply_type: "", quantity_used: 1, other_description: "" }]);
  };

  const removeSupplyEntry = (index) => {
    const updated = [...medicalSuppliesUsed];
    updated.splice(index, 1);
    setMedicalSuppliesUsed(updated);
  };

  const repeatYesterdaySupplies = async () => {
    if (!selectedDate || !selectedIndividualId) {
      showToast("Please select a date and individual first");
      return;
    }
    try {
      const res = await fetch(
        `https://notesvia.duckdns.org/api/progress-notes/individuals/${selectedIndividualId}?before=${selectedDate}&include_details=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.length > 0 && data[0].medical_supplies_used?.length > 0) {
        setMedicalSuppliesUsed(data[0].medical_supplies_used);
        showToast("Supplies copied from last entry.");
      } else {
        showToast("No previous supplies found.");
      }
    } catch (err) {
      console.error("Failed to repeat supplies", err);
      showToast("Error fetching yesterday’s supplies.");
    }
  };

  const handleSave = async () => {
    if (!selectedDate || !selectedIndividualId) {
      showToast("Date and Individual are required");
      return;
    }

    const payload = {
      ...noteData,
      user_id: userId,
      individual_id: selectedIndividualId,
      medical_supplies_used: medicalSuppliesUsed,
    };

    try {
      const url = existingNote
        ? `https://notesvia.duckdns.org/api/progress-notes/${existingNote.note_id}`
        : `https://notesvia.duckdns.org/api/progress-notes/individuals/${selectedIndividualId}`;
      const method = existingNote ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(existingNote ? "Note updated" : "Note added");
        detectNoteMode();
      } else {
        showToast(data?.error || "An unexpected error occurred");
      }
    } catch (err) {
      console.error("Failed to save note", err);
      showToast("Failed to save progress note");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="page-manage-progress-notes-container">
      <h2 className="page-manage-progress-notes-heading">Manage Progress Notes</h2>
      {toast && <div className="page-manage-progress-notes-toast">{toast}</div>}

      <div className="page-manage-progress-notes-form">
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

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {selectedIndividualId && selectedDate && (
        <div className="page-manage-progress-notes-form">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
            <textarea
              placeholder="Morning Narrative"
              value={noteData.narrative_morning}
              onChange={(e) => handleChange("narrative_morning", e.target.value)}
            />
            {!existingNote && noteData.narrative_morning === "" && (
              <button
                type="button"
                className="page-manage-progress-notes-voice-btn"
                onClick={() => startVoiceInput("narrative_morning")}
              >🎤</button>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
            <textarea
              placeholder="Afternoon Narrative"
              value={noteData.narrative_afternoon}
              onChange={(e) => handleChange("narrative_afternoon", e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
            <textarea
              placeholder="Evening Narrative"
              value={noteData.narrative_evening}
              onChange={(e) => handleChange("narrative_evening", e.target.value)}
            />
          </div>
          <textarea
            placeholder="Day Program Details"
            value={noteData.day_program_details}
            onChange={(e) => handleChange("day_program_details", e.target.value)}
          />

          <button onClick={repeatYesterdaySupplies}>Repeat Yesterday’s Supplies</button>

          {medicalSuppliesUsed.map((entry, index) => (
            <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}>
              <select
                value={entry.supply_type}
                onChange={(e) => updateSupplyField(index, "supply_type", e.target.value)}
              >
                <option value="">Select Supply</option>
                <option value="Gloves">Gloves</option>
                <option value="Chucks">Chucks</option>
                <option value="Pull ups">Pull ups</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                value={entry.quantity_used || 1}
                onChange={(e) => updateSupplyField(index, "quantity_used", e.target.value)}
              />
              {entry.supply_type === "Other" && (
                <input
                  type="text"
                  placeholder="Other description"
                  value={entry.other_description || ""}
                  onChange={(e) => updateSupplyField(index, "other_description", e.target.value)}
                />
              )}
              <button type="button" onClick={() => removeSupplyEntry(index)}>🗑️</button>
            </div>
          ))}
          <button type="button" onClick={addSupplyEntry}>➕ Add Supply</button>
          <button onClick={handleSave}>{existingNote ? "Update Note" : "Add Note"}</button>
        </div>
      )}
    </div>
  );
};

export default PageManageProgressNotes;
