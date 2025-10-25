import React, { useState, useEffect } from 'react';
import "./ProfileDetails.css";
import Navbar from "../../Screens/Navbar/Navbar";
import axios from "axios";
import baseURL from '../../ApiUrl/Apiurl';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [resourceId, setResourceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Get userId from multiple sources for reliability
  const getUserId = () => {
    return localStorage.getItem("userId") || (location.state && location.state.userId);
  };

  const getSelectedCompany = () => {
    return localStorage.getItem("selectedCompany");
  };

  useEffect(() => {
    const fetchUserAndResource = async () => {
      const userId = getUserId();
      const selectedCompany = getSelectedCompany();

      if (!userId) {
        console.error("No user ID found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Option 1: Use data passed from login via state (immediately available)
        if (location.state && location.state.userData) {
          setUserDetails(location.state.userData);
        } else {
          // Option 2: Fetch from API (fallback)
          const userResponse = await axios.get(`${baseURL}/users/`);
          const matchedUser = userResponse.data.find(user => user.user_id === userId);
          if (matchedUser) {
            setUserDetails(matchedUser);
          }
        }

        // Fetch resource data only if selectedCompany is available
        if (selectedCompany) {
          const resourceResponse = await axios.get(
            `${baseURL}/resources/?user_id=${userId}&company_id=${selectedCompany}`
          );

          const matchedResource = resourceResponse.data?.data?.find(
            (resource) => resource.user === userId
          );

          if (matchedResource) {
            setResourceId(matchedResource.resource_id);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Small timeout to ensure localStorage is updated
    const timer = setTimeout(() => {
      fetchUserAndResource();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.state]);

  // Show loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-content">
          <h2>Dashboard</h2>
          <div className="loading-state">
            <p>Loading user details...</p>
            {/* You can add a spinner here */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2>Dashboard</h2>
        {userDetails ? (
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
            {resourceId && (
              <p><strong>Resource ID:</strong> {resourceId}</p>
            )}
          </div>
        ) : (
          <div className="error-state">
            <p>User not found or failed to load user details</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;