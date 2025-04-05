import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/page_header.css";

const PageHeader = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("full_name") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header-bar">
      <div className="header-logo">
        <img src="/assets/MainLogo.png" alt="NotesVia Logo" />
      </div>
      <div className="header-welcome">Welcome back, {fullName}</div>
      <button className="header-logout" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default PageHeader;
