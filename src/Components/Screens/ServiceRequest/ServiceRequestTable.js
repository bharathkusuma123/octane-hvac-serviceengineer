import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServiceTable.css";
import axios from "axios";
import baseURL from "../../ApiUrl/Apiurl"; 
import { useCompany } from "../../CompanyContext";

const ServiceTable = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [acceptedServices, setAcceptedServices] = useState([]);
  const [declinedServices, setDeclinedServices] = useState([]);
  const { selectedCompany, updateCompany } = useCompany();
  const [resourceId, setResourceId] = useState(null);
  const userId = localStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
    const fetchData = async () => {
      try {
        const resourceRes = await axios.get(`${baseURL}/resources/?company_id=${selectedCompany}&user_id=${userId}`);
        const resourceData = resourceRes.data?.data || [];

        const currentResource = resourceData.find(res => res.user === userId);
        const extractedResourceId = currentResource?.resource_id;
        setResourceId(extractedResourceId);

        if (!extractedResourceId) {
          console.warn("No resource_id found for the current user");
          setServices([]);
          return;
        }

        const [servicesRes, assignmentsRes] = await Promise.all([
          axios.get(`${baseURL}/service-pools/`),
          axios.get(`${baseURL}/assignment-history/`)
        ]);

        const allServices = Array.isArray(servicesRes.data)
          ? servicesRes.data
          : servicesRes.data.data || [];

        const assignments = Array.isArray(assignmentsRes.data)
          ? assignmentsRes.data
          : assignmentsRes.data.data || [];

        const userAssignmentMap = {};
        assignments.forEach(item => {
          const key = `${item.request}_${item.assigned_engineer}`;
          if (!userAssignmentMap[key] || new Date(item.assigned_at) > new Date(userAssignmentMap[key].assigned_at)) {
            userAssignmentMap[key] = item;
          }
        });

        const assignedToUser = allServices
          .filter(service =>
            service.assigned_engineer === extractedResourceId ||
            Object.values(userAssignmentMap).some(
              assignment =>
                assignment.request === service.request_id &&
                assignment.assigned_engineer === extractedResourceId
            )
          )
          .map(service => {
            const userAssignment = Object.values(userAssignmentMap).find(
              assignment =>
                assignment.request === service.request_id &&
                assignment.assigned_engineer === extractedResourceId
            );

            return {
              ...service,
              assignment_id: userAssignment?.assignment_id || null,
              assignment_status: userAssignment?.status || null,
              assigned_engineer: userAssignment?.assigned_engineer || service.assigned_engineer,
              is_current_user_assignment: userAssignment?.assigned_engineer === extractedResourceId
            };
          });

        setServices(assignedToUser);
        setFilteredServices(assignedToUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCompany, userId]);


  // Apply search filter
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        Object.values(service).some(
          val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredServices(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, services]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

const handleAcceptClick = async (serviceId, assignmentId) => {
  if (!serviceId) {
    console.error("Missing serviceId");
    return;
  }

  try {
    // 1. Update status in service-pools
    await axios.put(`${baseURL}/service-pools/${serviceId}/`, {
      status: "Accepted",
    });

    // 2. Update status in assignment-history
    if (assignmentId) {
      await axios.put(`${baseURL}/assignment-history/${assignmentId}/`, {
        status: "Accepted",
      });
    }

    // 3. Get the accepted service
    const acceptedService = services.find(service => service.request_id === serviceId);

    // 4. Construct payload for service-orders
    const serviceOrderPayload = {
      dynamics_service_order_no: "", // Provide if needed
      source: "IoT Alert", 
      request_details: acceptedService.request_details || "N/A",
      alert_details: acceptedService.alert_details || "",
      requested_by: acceptedService.requested_by || "",
      preferred_date: acceptedService.preferred_date,
      preferred_time: acceptedService.preferred_time,
      estimated_completion_time: acceptedService.estimated_completion_time,
      estimated_price: acceptedService.estimated_price || "0",
      resource_accepted: true,
      status: "Assigned",
      completion_notes: "",
      decline_reason: "",
      act_start_datetime: acceptedService.est_start_datetime || new Date().toISOString(),
      act_end_datetime: acceptedService.est_end_datetime || new Date().toISOString(),
      act_material_cost: "0",
      act_labour_hours: "0",
      act_labour_cost: "0",
      created_by: acceptedService.created_by || "system",
      updated_by: acceptedService.updated_by || "system",
      company: acceptedService.company || selectedCompany,
      service_item: acceptedService.service_item || "",
      customer: acceptedService.customer || "",
      preventive_task: "",
      service_request_id: acceptedService.request_id,
      resource: resourceId
    };

    // 5. Send POST request to service-orders
    await axios.post(`http://175.29.21.7:8006/service-orders/`, serviceOrderPayload);

    // 6. Update UI state
    setAcceptedServices((prev) => [...prev, serviceId]);
    setDeclinedServices((prev) => prev.filter(id => id !== serviceId));
    alert("Service accepted and order created successfully!");
  } catch (error) {
    console.error("Error accepting service or creating service order:", error);
    alert("Failed to complete the action. Please try again.");
  }
};


  const handleRejectClick = (service) => {
    navigate("/reject", { state: { service } });
  };

  const handleServiceIdClick = (service) => {
    navigate("/service-details", { state: { service } });
  };



  return (
    <>
      <Navbar />
      <div className="container-fluid px-4 pt-5 pb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold pt-5">Service Request Table</h2>
        </div>

        {/* Search Input */}
        <div className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-secondary"
            />
            <InputGroup.Text className="bg-light">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
          </InputGroup>
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
                <th className="py-3 px-3">S.No</th>
                <th className="py-3 px-3">Service ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    {searchTerm ? "No matching services found" : "No services assigned to you"}
                  </td>
                </tr>
              ) : (
                currentItems.map((service, index) => (
                  <tr
                    key={service.request_id || service.id}
                    className="service-row"
                  >
                    <td className="py-3 px-3">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td 
                      className="py-3 px-3 text-primary"
                      style={{cursor: 'pointer', textDecoration: 'underline'}}
                      onClick={() => handleServiceIdClick(service)}
                    >
                      {service.request_id || service.id}
                    </td>

                    <td 
                      className="py-3 px-3 text-primary"
                     
                    >
                     {service.customer || "N/A"}
                    </td>
                   <td className="py-3 px-3">
  {service.status === "Accepted" ? (
    <span className="text-success fw-bold">Accepted</span>
  ) : service.assignment_status === "Declined" && service.assigned_engineer === resourceId ? (
    <span className="text-danger fw-bold">Rejected</span>
  ) : service.assignment_status === "Pending" && service.assigned_engineer === resourceId ? (
    <div className="d-flex justify-content-center gap-2">
      <Button
        variant="success"
        size="sm"
        onClick={() => handleAcceptClick(service.request_id, service.assignment_id)}
        className="px-2"
      >
        Accept
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => handleRejectClick(service)}
        className="px-2"
      >
        Reject
      </Button>
    </div>
  ) : (
    <span className="text-secondary fw-bold">Pending</span>
  )}
</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredServices.length > itemsPerPage && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredServices.length)} of{" "}
              {filteredServices.length} entries
            </div>
            <div>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="me-2"
              >
                Previous
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceTable;