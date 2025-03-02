import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomLoginPage from './components/CustomLoginPage';
import DashboardPage from './components/DashboardPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Set CustomLoginPage as the default page */}
        <Route path="/" element={<CustomLoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
