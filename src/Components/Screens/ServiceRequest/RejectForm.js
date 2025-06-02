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
  const userId = localStorage.getItem("userId"); // Get the current user ID

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serviceId = service.request_id || service.id;
    const assignmentId = service.assignment_id;

    if (!assignmentId || !serviceId) {
      alert("Invalid assignment or service ID");
      return;
    }

    try {
      // Step 1: Update assignment-history (mark as Declined)
      await axios.put(`http://175.29.21.7:8006/assignment-history/${assignmentId}/`, {
        status: "Declined",
        decline_reason: reason,
      });

      console.log("Assignment updated:", assignmentId, "Reason:", reason);

      // Step 2: Update service-pools (mark as Unassigned)
      await axios.put(`http://175.29.21.7:8006/service-pools/${serviceId}/`, {
        status: "Unassigned",
      });

      console.log("Service status set to Unassigned:", serviceId);

      // Step 3: Create a service order with declined status
      const serviceOrderData = {
        dynamics_service_order_no: `SO-${Date.now()}`,
        source: "IoT Alert",
        request_details: "Service request declined by engineer",
        alert_details: "Service alert",
        status: "Assigned",
        resource_accepted: false,
        service_request_id: serviceId.toString(),
        resource: userId.toString(),
        created_by: "Service Manager",
        customer: service.customer || "Default Customer",
        service_item: service.service_item || "Default Service",
        updated_by: "Service Manager",
        decline_reason: reason,
      };

      console.log('Creating declined service order with data:', serviceOrderData);
      const serviceOrderResponse = await axios.post(
        "http://175.29.21.7:8006/service-orders/",
        serviceOrderData
      );
      console.log('Declined service order created:', serviceOrderResponse.data);

      // Step 4: Redirect
      navigate("/service-table");
    } catch (error) {
      console.error("Error updating or creating order:", {
        error: error.response ? error.response.data : error.message,
        config: error.config,
      });
      
      if (error.response) {
        console.error('Server responded with:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      }
      
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