export const formatDateFields = (dateStr) => {
  if (!dateStr) {
    return {
      backend: "",
      ui: ""
    };
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { backend: "", ui: "" };
  }

  const formatted = date.toISOString().split("T")[0];
  return {
    backend: formatted,  // For API (YYYY-MM-DD)
    ui: formatted         // For <input type="date">
  };
};
export const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};
