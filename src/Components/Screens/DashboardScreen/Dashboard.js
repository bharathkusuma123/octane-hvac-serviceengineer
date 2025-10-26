import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import Navbar from "../../Screens/Navbar/Navbar";
import axios from "axios";
import baseURL from '../../ApiUrl/Apiurl';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCompany } from '../../CompanyContext';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [resourceId, setResourceId] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const navigate = useNavigate();
  // Get userId and companyId from storage or location
  const getUserId = () => {
    return localStorage.getItem("userId") || (location.state && location.state.userId);
  };

 const { selectedCompany, updateCompany } = useCompany();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userId = getUserId();

      if (!userId || !selectedCompany) {
        console.error("Missing user ID or company ID");
        setError("Please select a company to view dashboard");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user details (if not already available)
        if (location.state && location.state.userData) {
          setUserDetails(location.state.userData);
        } else {
          const userResponse = await axios.get(`${baseURL}/users/`);
          const matchedUser = userResponse.data.find(user => user.user_id === userId);
          if (matchedUser) {
            setUserDetails(matchedUser);
          }
        }

        // Fetch resource ID (optional)
        const resourceResponse = await axios.get(
          `${baseURL}/resources/?user_id=${userId}&company_id=${selectedCompany}`
        );
        const matchedResource = resourceResponse.data?.data?.find(
          (resource) => resource.user === userId
        );
        if (matchedResource) {
          setResourceId(matchedResource.resource_id);
        }

        // Fetch dashboard data (Assigned, Completed, Pending)
        const dashboardResponse = await axios.get(
          `${baseURL}/service-engineer/dashboard/?user_id=${userId}&company_id=${selectedCompany}`
        );

        if (dashboardResponse.data.status === "success") {
          setDashboardData(dashboardResponse.data.data);
        } else {
          console.error("Failed to fetch dashboard stats");
          setError("No dashboard data available for selected company");
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("No dashboard data available for selected company");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDashboardData, 100);
    return () => clearTimeout(timer);
  }, [location.state, selectedCompany]); // Added getSelectedCompany() to dependency array

    // Handle click on stat cards
  const handleStatCardClick = () => {
    navigate('/service-table');
  };

  // Handle click on error state
  const handleErrorStateClick = () => {
    navigate('/service-table');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-content">
          <h2>Dashboard</h2>
          <div className="loading-state">
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        {/* <h2>Service Engineer Dashboard</h2> */}

        {/* {userDetails && (
          <div className="user-summary">
            <p><strong>Engineer:</strong> {userDetails.full_name || userDetails.username}</p>
            <p><strong>User ID:</strong> {userDetails.user_id}</p>
            <p><strong>Company ID:</strong> {getSelectedCompany()}</p>
          </div>
        )} */}

        {dashboardData ? (
          <div className="stats-container">
            <div 
              className="stat-card assigned clickable" 
              onClick={handleStatCardClick}
            >
              <h3>Total Assigned</h3>
              <p>{dashboardData.total_assigned}</p>
              <div className="click-hint">Click to view details</div>
            </div>
            <div 
              className="stat-card completed clickable" 
              onClick={handleStatCardClick}
            >
              <h3>Completed</h3>
              <p>{dashboardData.completed}</p>
              <div className="click-hint">Click to view details</div>
            </div>
            <div 
              className="stat-card pending clickable" 
              onClick={handleStatCardClick}
            >
              <h3>Pending</h3>
              <p>{dashboardData.pending}</p>
              <div className="click-hint">Click to view details</div>
            </div>
          </div>
        ) : (
          <div 
            className="error-state clickable" 
            onClick={handleErrorStateClick}
          >
            <p>{error || "No dashboard data available for selected company"}</p>
            {!selectedCompany && (
              <p className="text-muted">Please select a company from the navigation menu</p>
            )}
            <div className="click-hint">Click to go home</div>
          </div>
        )}

        {/* {resourceId && (
          <div className="resource-info">
            <p><strong>Resource ID:</strong> {resourceId}</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Dashboard;