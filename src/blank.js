// src/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';  // Import your HomePage component
import LoginPage from './components/LoginPage';  // Import your LoginPage component
import DashboardPage from './components/DashboardPage'; // Import your DashboardPage component

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />  {/* HomePage route */}
        <Route path="/login" component={LoginPage} />  {/* LoginPage route */}
        <Route path="/dashboard" component={DashboardPage} />  {/* DashboardPage route */}
      </Switch>
    </Router>
  );
};

export default AppRouter;
