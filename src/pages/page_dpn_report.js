import React, { useState, useEffect } from "react";
import "../styles/page_export_dpn.css";

const PageExportDPN = () => {
  const [individuals, setIndividuals] = useState([]);
  const [selectedIndividual, setSelectedIndividual] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchIndividuals();
  }, []);

  const fetchIndividuals = async () => {
    try {
      const res = await fetch("https://notesvia.duckdns.org/api/individuals", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setIndividuals(data);
    } catch (err) {
      console.error("Failed to fetch individuals", err);
      alert("Could not load individuals. Please try again.");
    }
  };

  const handleDownload = async () => {
    if (!selectedIndividual || !selectedMonth) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://notesvia.duckdns.org/api/reports/dpn/${selectedIndividual}?month=${selectedMonth}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `DPN_${selectedIndividual}_${selectedMonth}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading report", err);
      alert("Failed to download report. Please check your connection or token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-export-dpn-container">
      <h2 className="page-export-dpn-heading">North America Area<br/>Daily Progress Report (Monthly Export)</h2>

      <div className="page-export-dpn-row">
        <select
          value={selectedIndividual}
          onChange={(e) => setSelectedIndividual(e.target.value)}
        >
          <option value="">-- Select Individual --</option>
          {individuals.map((ind) => (
            <option key={ind.individual_id} value={ind.individual_id}>
              {ind.name}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <button
        className="page-export-dpn-btn"
        onClick={handleDownload}
        disabled={!selectedIndividual || !selectedMonth || loading}
      >
        {loading ? "Generating Report..." : "📥 Download Monthly PDF"}
      </button>
    </div>
  );
};

export default PageExportDPN;
