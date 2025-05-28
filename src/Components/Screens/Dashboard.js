import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import Navbar from "./Navbar/Navbar";

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [userMobile, setUserMobile] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setUserMobile(localStorage.getItem("userMobile"));
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <h2>Customer Dashboard</h2>
      <p>Logged in as UserID: <strong>{userId || "Not found"}</strong></p>
      <p>Mobile Number: <strong>{userMobile || "Not found"}</strong></p>
    </div>
  );
};

export default Dashboard;
