import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Card, Container } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import "./RejectForm.css";
import axios from "axios";

const RejectFormScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use the same identifier as in ServiceTable (request_id or id)
    const serviceId = service.request_id || service.id;
    
    if (!serviceId) {
      alert("Invalid service ID");
      return;
    }

    try {
      await axios.put(`http://175.29.21.7:8006/service-pools/${serviceId}/`, {
        status: "Declined",
        // rejection_reason: reason, // Make sure this matches your backend field name
      });

      console.log("Service rejected:", serviceId, "Reason:", reason);
      navigate("/service-table");
    } catch (error) {
      console.error("Error rejecting service:", error);
      alert("Failed to reject the service. Please try again.");
    }
  };

  if (!service) {
    return <div className="text-center mt-5">No service selected.</div>;
  }

  return (
    <>
      <Navbar />
      <Container className="reject-form-container">
        <Card className="shadow-sm p-4">
          <h4 className="text-center mb-4 text-dark">
            Reject Service ID: <strong>{service.request_id || service.id}</strong>
          </h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                Reason for Rejection
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason here..."
                className="reason-box"
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-3 px-4"
                onClick={() => navigate("/service-table")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="danger" className="px-4">
                Submit
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default RejectFormScreen;