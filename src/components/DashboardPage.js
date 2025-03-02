// src/components/DashboardPage.js
import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);

  // Simulating data fetching
  useEffect(() => {
    const userDataFromStorage = {
      name: 'John Doe',
      email: 'user@example.com',
      role: 'Admin',
    };
    setUserData(userDataFromStorage);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {userData ? (
        <div>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default DashboardPage;
