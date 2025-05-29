import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServiceTable.css";
import axios from "axios";

const ServiceTable = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [acceptedServices, setAcceptedServices] = useState([]);
  const userId = localStorage.getItem("userId"); // 👈 Get logged-in user ID

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://175.29.21.7:8006/service-pools/");
        const allServices = Array.isArray(res.data) ? res.data : res.data.data || [];

        // ✅ Filter services assigned to the logged-in engineer
        const assignedToUser = allServices.filter(
          (service) => String(service.assigned_engineer) === userId
        );

        setServices(assignedToUser);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [userId]);

 const handleAcceptClick = async (serviceId) => {
  try {
    // Send a PATCH or PUT request to update status to "Accepted"
    await axios.put(`http://175.29.21.7:8006/service-pools/${serviceId}/`, {
      status: "Accepted",
    });

    // Update UI state
    setAcceptedServices((prev) => [...prev, serviceId]);
  } catch (error) {
    console.error("Error updating service status:", error);
    alert("Failed to accept the service. Please try again.");
  }
};


  const handleRejectClick = (service) => {
    navigate("/reject", { state: { service } });
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid px-4 pt-5 pb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold pt-5">Service Request Table</h2>
        </div>

        <div className="table-responsive rounded shadow-sm">
          <Table
            bordered
            hover
            responsive="md"
            className="text-center align-middle service-table"
          >
            <thead className="table-light text-dark">
              <tr>
                <th className="py-3 px-4">Service ID</th>
                <th className="py-3 px-4">Estimated Completion</th>
                <th className="py-3 px-4">Start Date & Time</th>
                <th className="py-3 px-4">End Date & Time</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No services assigned to you.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.request_id || service.id} className="service-row">
                    <td className="py-3 px-4">{service.request_id || service.id}</td>
                    <td className="py-3 px-4">{service.estimated_completion_time}</td>
                    <td className="py-3 px-4">{service.est_start_datetime}</td>
                    <td className="py-3 px-4">{service.est_end_datetime}</td>
                    <td className="py-3 px-4">
                      {acceptedServices.includes(service.request_id || service.id) ? (
                        <span className="text-success fw-bold">Accepted</span>
                      ) : (
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleAcceptClick(service.request_id || service.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRejectClick(service)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default ServiceTable;
