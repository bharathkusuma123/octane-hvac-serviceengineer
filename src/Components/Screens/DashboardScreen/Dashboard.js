import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import Navbar from "../../Screens/Navbar/Navbar";
import axios from "axios";
import baseURL from '../../ApiUrl/Apiurl';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [resourceId, setResourceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Static status data for the cards
  const [statusData, setStatusData] = useState({
    pending: 12,
    completed: 28,
    inProgress: 8,
    onHold: 5
  });

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

  // Status card data configuration
  const statusCards = [
    {
      title: "Pending",
      count: statusData.pending,
      color: "#FF6B6B",
      icon: "⏳",
      bgColor: "#FFF5F5"
    },
    {
      title: "Completed",
      count: statusData.completed,
      color: "#51CF66",
      icon: "✅",
      bgColor: "#F8FFF9"
    },
    {
      title: "In Progress",
      count: statusData.inProgress,
      color: "#339AF0",
      icon: "🚀",
      bgColor: "#F3F8FF"
    },
    {
      title: "On Hold",
      count: statusData.onHold,
      color: "#FF922B",
      icon: "⏸️",
      bgColor: "#FFF9F2"
    }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-content">
          <h2>Dashboard</h2>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          {userDetails && (
            <div className="user-welcome">
              <p>Welcome back, <strong>{userDetails.name || userDetails.username}</strong>!</p>
            </div>
          )}
        </div>

        {/* Status Cards Grid */}
        <div className="status-cards-grid">
          {statusCards.map((card, index) => (
            <div 
              key={index} 
              className="status-card"
              style={{ backgroundColor: card.bgColor }}
            >
              <div className="card-content">
                <div className="card-icon" style={{ color: card.color }}>
                  {card.icon}
                </div>
                <div className="card-info">
                  <h3 className="card-count" style={{ color: card.color }}>
                    {card.count}
                  </h3>
                  <p className="card-title">{card.title}</p>
                </div>
              </div>
              <div 
                className="card-footer" 
                style={{ backgroundColor: card.color }}
              ></div>
            </div>
          ))}
        </div>

        {/* Additional Dashboard Content */}
        <div className="dashboard-main-content">
          <div className="content-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-bullet" style={{backgroundColor: '#339AF0'}}></span>
                <p>Project "Website Redesign" updated to In Progress</p>
                <span className="activity-time">2 hours ago</span>
              </div>
              <div className="activity-item">
                <span className="activity-bullet" style={{backgroundColor: '#51CF66'}}></span>
                <p>Task "Homepage Layout" marked as Completed</p>
                <span className="activity-time">5 hours ago</span>
              </div>
              <div className="activity-item">
                <span className="activity-bullet" style={{backgroundColor: '#FF6B6B'}}></span>
                <p>New task "Mobile Optimization" assigned to you</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>

          {resourceId && (
            <div className="content-section">
              <h2>Resource Information</h2>
              <div className="resource-info">
                <p><strong>Resource ID:</strong> {resourceId}</p>
                <p><strong>Company:</strong> {getSelectedCompany()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;