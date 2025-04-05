import React from "react";
import Sidebar from "./page_sidebar";
import Header from "./page_header";
import { Outlet } from "react-router-dom";
import "../styles/page_dashboard.css";

const PageDashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PageDashboard;
