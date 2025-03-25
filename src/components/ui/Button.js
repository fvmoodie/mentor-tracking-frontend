import React from "react";

const Button = ({ children, onClick, variant = "primary" }) => {
  return (
    <button className={`btn ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
