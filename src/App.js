import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageLogin from "./pages/page_login";
import PageRegister from "./pages/page_register";
import PageAdminDashboard from "./pages/page_admin_dashboard";
import PageUserDashboard from "./pages/page_user_dashboard";
import PageManageRoles from "./pages/page_ManageRoles";
import PageManageRegions from "./pages/page_ManageRegions";
import PageManageUsers from "./pages/page_ManageUsers";
import PageManageIndividuals from "./pages/page_ManageIndividuals";
import PageMentorIndividuals from "./pages/page_MentorIndividuals";

// ✅ Forgot Password Flow Pages (lowercase file names as preferred)
import PageRequestReset from "./pages/page_requestreset";
import PageVerifyCode from "./pages/page_verifycode";
import PageResetPassword from "./pages/page_resetpassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/register" element={<PageRegister />} />
        <Route path="/admin-dashboard" element={<PageAdminDashboard />} />
        <Route path="/user-dashboard" element={<PageUserDashboard />} />
        <Route path="/admin-dashboard/manage-roles" element={<PageManageRoles />} />
        <Route path="/admin-dashboard/manage-regions" element={<PageManageRegions />} />
        <Route path="/admin-dashboard/manage-users" element={<PageManageUsers />} />
        <Route path="/admin-dashboard/manage-individuals" element={<PageManageIndividuals />} />
        <Route path="/mentor-dashboard/individuals" element={<PageMentorIndividuals />} />

        {/* ✅ Forgot Password Flow */}
        <Route path="/forgot-password" element={<PageRequestReset />} />
        <Route path="/verify-code" element={<PageVerifyCode />} />
        <Route path="/reset-password" element={<PageResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
