import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth Pages
import PageLogin from "./pages/page_login";
import PageSignup from "./pages/page_signup";
import PageForgotPassword from "./pages/page_forgot_password";
import PageResetPassword from "./pages/page_reset_password";

// Dashboard & Management Pages
import PageDashboard from "./pages/page_dashboard";
import PageManageUsers from "./pages/page_manage_users";
import PageManageRoles from "./pages/page_manage_roles";
import PageManageRegions from "./pages/page_manage_regions";
import PageManageIndividuals from "./pages/page_manage_individuals";
import PageManageGoals from "./pages/page_manage_goals";
import PageManageObjectives from "./pages/page_manage_objectives";
import PageManageProgressNotes from "./pages/page_manage_progress_notes";
import PageManageObjectiveProgress from "./pages/page_manage_objective_progress";
import PageExportDPN from "./pages/page_export_dpn";
import PageExportODS from "./pages/page_export_ods"; // ✅ ODS Report Page

// Placeholder Pages
const Objectives = () => <h2>Objectives</h2>;
const DailyProgress = () => <h2>Daily Progress</h2>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Pages */}
        <Route path="/" element={<PageLogin />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/register" element={<PageSignup />} />
        <Route path="/forgot-password" element={<PageForgotPassword />} />
        <Route path="/reset-password" element={<PageResetPassword />} />

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<PageDashboard />}>
          <Route path="manage-users" element={<PageManageUsers />} />
          <Route path="manage-roles" element={<PageManageRoles />} />
          <Route path="manage-regions" element={<PageManageRegions />} />
          <Route path="individuals" element={<PageManageIndividuals />} />
          <Route path="goals" element={<PageManageGoals />} />
          <Route path="objectives" element={<PageManageObjectives />} />
          <Route path="daily-progress" element={<PageManageProgressNotes />} />
          <Route path="objective-progress" element={<PageManageObjectiveProgress />} />
          <Route path="dpn-report" element={<PageExportDPN />} />
          <Route path="ods-report" element={<PageExportODS />} /> {/* ✅ New ODS Report Page */}
        </Route>

        {/* User Dashboard */}
        <Route path="/user-dashboard" element={<PageDashboard />}>
          <Route path="objectives" element={<Objectives />} />
          <Route path="daily-progress" element={<PageManageProgressNotes />} />
          <Route path="objective-progress" element={<PageManageObjectiveProgress />} />
          <Route path="dpn-report" element={<PageExportDPN />} />
          <Route path="ods-report" element={<PageExportODS />} /> {/* ✅ New ODS Report Page */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
