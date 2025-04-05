// File: components/EditableRow.js
import React from "react";

const EditableRow = ({ rowData, fields, onChange, onSave }) => {
  return (
    <div className="page-manage-users-row">
      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <select
              key={field.name}
              value={rowData[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        }

        return (
          <input
            key={field.name}
            type="text"
            value={rowData[field.name] ?? ""}
            placeholder={field.label}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );
      })}
      <button onClick={onSave}>Save</button>
    </div>
  );
};

export default EditableRow;
