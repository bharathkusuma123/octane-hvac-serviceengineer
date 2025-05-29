import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Card, Container } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import "./RejectForm.css"; // custom CSS

const RejectFormScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rejected Service:", service);
    console.log("Reason:", reason);
    navigate("/service-table");
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
            Reject Service ID: <strong>{service.id}</strong>
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
