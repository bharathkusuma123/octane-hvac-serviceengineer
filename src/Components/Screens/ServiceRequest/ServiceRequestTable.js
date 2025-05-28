import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const dummyData = [
  {
    id: "SVC001",
    completionTime: "2025-06-01 14:00",
    startTime: "2025-05-28 10:00",
    endTime: "2025-05-30 18:00",
  },
  {
    id: "SVC002",
    completionTime: "2025-06-03 15:00",
    startTime: "2025-05-29 09:00",
    endTime: "2025-05-31 17:30",
  },
];

const ServiceTable = () => {
  const navigate = useNavigate();
  const [acceptedServices, setAcceptedServices] = useState([]);

  const handleAcceptClick = (serviceId) => {
    setAcceptedServices((prev) => [...prev, serviceId]);
  };

  const handleRejectClick = (service) => {
    navigate("/reject", { state: { service } });
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "70px", paddingBottom: "80px" }} className="container-fluid px-3">
        <div className="text-center my-4">
          <h2 className="fw-bold">Service Table</h2>
        </div>

        <div className="table-responsive rounded shadow-sm">
          <Table bordered hover responsive="md" className="text-center align-middle">
            <thead className="bg-light text-secondary">
              <tr>
                <th>Service ID</th>
                <th>Estimated Completion</th>
                <th>Start Date & Time</th>
                <th>End Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.completionTime}</td>
                  <td>{service.startTime}</td>
                  <td>{service.endTime}</td>
                  <td>
                    {acceptedServices.includes(service.id) ? (
                      <span className="text-success fw-bold">Accepted</span>
                    ) : (
                      <>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleAcceptClick(service.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRejectClick(service)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default ServiceTable;
