import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import Navbar from "../../Screens/Navbar/Navbar";
import axios from "axios";
import baseURL from '../../ApiUrl/Apiurl';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [resourceId, setResourceId] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const selectedCompany = localStorage.getItem("selectedCompany");

  useEffect(() => {
    const fetchUserAndResource = async () => {
      try {
        // 1. Get user details
        const userResponse = await axios.get(`${baseURL}/users/`);
        const matchedUser = userResponse.data.find(user => user.user_id === userId);
        if (matchedUser) {
          setUserDetails(matchedUser);
        }

        // 2. Get resource matching the userId and companyId
        const resourceResponse = await axios.get(
          `${baseURL}/resources/?user_id=${userId}&company_id=${selectedCompany}`
        );

        const matchedResource = resourceResponse.data?.data?.find(
          (resource) => resource.user === userId
        );

        if (matchedResource) {
          setResourceId(matchedResource.resource_id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && selectedCompany) {
      fetchUserAndResource();
    }
  }, [userId, selectedCompany]);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2>Dashboard</h2>
        {loading ? (
          <p>Loading user details...</p>
        ) : userDetails ? (
          <div className="user-details">
            <p><strong>User ID:</strong> {userDetails.user_id}</p>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Full Name:</strong> {userDetails.full_name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Mobile No:</strong> {userDetails.mobile}</p>
            <p><strong>Telephone:</strong> {userDetails.telephone}</p>
            <p><strong>City:</strong> {userDetails.city}</p>
            <p><strong>Country Code:</strong> {userDetails.country_code}</p>
            <p><strong>Role:</strong> {userDetails.role}</p>

            {/* ✅ Show resource ID if found */}
            {resourceId && (
              <p><strong>Resource ID:</strong> {resourceId}</p>
            )}
          </div>
        ) : (
          <p>User not found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
