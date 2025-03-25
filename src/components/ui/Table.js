import React from "react";

export const Table = ({ children }) => {
  return <table>{children}</table>;
};

export const TableHeader = ({ children }) => {
  return <thead>{children}</thead>;
};

export const TableRow = ({ children }) => {
  return <tr>{children}</tr>;
};

export const TableHead = ({ children }) => {
  return <th>{children}</th>;
};

export const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const TableCell = ({ children }) => {
  return <td>{children}</td>;
};

export const Label = ({ children }) => {
  return <label>{children}</label>;
};

export const Input = ({ type = "text", value, onChange }) => {
  return <input type={type} value={value} onChange={onChange} />;
};

export default Table;
