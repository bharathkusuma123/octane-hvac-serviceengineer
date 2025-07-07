import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Card, Container } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import "./RejectForm.css";
import axios from "axios";
import baseURL from "../../ApiUrl/Apiurl";
import Swal from "sweetalert2"; // ✅ Added SweetAlert2

const RejectFormScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;
  const [reason, setReason] = useState("");
  const userId = localStorage.getItem("userId"); // Get the current user ID


  const handleSubmit = async (e) => {
    e.preventDefault();

    const serviceId = service.request_id || service.id;
    const assignmentId = service.assignment_id;

    if (!assignmentId || !serviceId) {
      Swal.fire({
        icon: "error",
        title: "Invalid IDs",
        text: "Invalid assignment or service ID.",
      });
      return;
    }

    try {
      await axios.put(`${baseURL}/assignment-history/${assignmentId}/`, {
        status: "Declined",
        decline_reason: reason,
      });

      await axios.put(`${baseURL}/service-pools/${serviceId}/`, {
        status: "Open",
      });

      Swal.fire({
        icon: "success",
        title: "Service Rejected",
        text: `Service ID ${serviceId} has been successfully rejected.`,
      }).then(() => {
        navigate("/service-table");
      });
    } catch (error) {
      console.error("Error updating service or assignment:", {
        error: error.response ? error.response.data : error.message,
        config: error.config,
      });

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to reject the service. Please try again.",
      });
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