import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import Navbar from "../../Screens/Navbar/Navbar";
import axios from "axios";

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axios.get("http://175.29.21.7:8006/users/")
        .then((res) => {
          const matchedUser = res.data.find(user => user.user_id === userId);
          if (matchedUser) {
            setUserDetails(matchedUser);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2>Customer Dashboard</h2>
        {userDetails ? (
          <div className="user-details">
            <p><strong>User ID:</strong> {userDetails.user_id}</p>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Full Name:</strong> {userDetails.full_name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Mobile No:</strong> {userDetails.mobile_no}</p>
            <p><strong>Telephone:</strong> {userDetails.telephone}</p>
            <p><strong>City:</strong> {userDetails.city}</p>
            <p><strong>Country:</strong> {userDetails.country_code}</p>
            <p><strong>Customer Type:</strong> {userDetails.customer_type}</p>
            <p><strong>Status:</strong> {userDetails.status}</p>
            <p><strong>Remarks:</strong> {userDetails.remarks}</p>
            <p><strong>Role:</strong> {userDetails.role}</p>
            <p><strong>Hourly Rate:</strong> {userDetails.hourly_rate}</p>
            <p><strong>Address:</strong> {userDetails.address}</p>
            <p><strong>Availability:</strong> {userDetails.availability}</p>
            <p><strong>Rating:</strong> {userDetails.rating}</p>
            <p><strong>Created By:</strong> {userDetails.created_by}</p>
            <p><strong>Updated By:</strong> {userDetails.updated_by}</p>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
