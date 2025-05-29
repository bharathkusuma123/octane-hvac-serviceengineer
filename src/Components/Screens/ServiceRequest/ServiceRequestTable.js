import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServiceTable.css"; // Include custom styles

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
      <div className="container-fluid px-4 pt-5 pb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold pt-5">Service Request Table</h2>
        </div>

        <div className="table-responsive rounded shadow-sm">
          <Table bordered hover responsive="md" className="text-center align-middle service-table">
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
              {dummyData.map((service) => (
                <tr key={service.id} className="service-row">
                  <td className="py-3 px-4">{service.id}</td>
                  <td className="py-3 px-4">{service.completionTime}</td>
                  <td className="py-3 px-4">{service.startTime}</td>
                  <td className="py-3 px-4">{service.endTime}</td>
                  <td className="py-3 px-4">
                    {acceptedServices.includes(service.id) ? (
                      <span className="text-success fw-bold">Accepted</span>
                    ) : (
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleAcceptClick(service.id)}
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
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default ServiceTable;
