import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomLoginPage from './components/CustomLoginPage';
import MentorDashboard from './components/MentorDashboard';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import NewUserPage from './components/NewUserPage';
import RegionsManagement from './components/RegionsManagement'; // ✅ Import Regions Management
import AssignRegionRole from './components/AssignRegionRole'; // ✅ Import Assign Region Role

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token"); // Check if user has a valid token
    return token ? children : <Navigate to="/" replace />; // Redirect to login if no token
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<CustomLoginPage />} />
        <Route path="/register" element={<NewUserPage />} /> {/* ✅ Now public */}

        {/* Protected Routes (Require Login) */}
        <Route path="/mentor-dashboard" element={<PrivateRoute><MentorDashboard /></PrivateRoute>} />
        <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/manager-dashboard" element={<PrivateRoute><ManagerDashboard /></PrivateRoute>} />
        <Route path="/regions-management" element={<PrivateRoute><RegionsManagement /></PrivateRoute>} /> {/* ✅ Added Regions Management Route */}
        <Route path="/assign-regionrole" element={<PrivateRoute><AssignRegionRole /></PrivateRoute>} /> 
      </Routes>
    </Router>
  );
};

export default AppRouter;
