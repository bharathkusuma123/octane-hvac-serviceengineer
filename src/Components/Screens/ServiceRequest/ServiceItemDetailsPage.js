import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import baseURL from "../../ApiUrl/Apiurl";
import "./CustServDetails.css";

const ServiceItemDetailsPage = () => {
  const { serviceItemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  const location = useLocation();
  const { userId, selectedCompany } = location.state || {};

  useEffect(() => {
    axios
      .get(`${baseURL}/service-items/?user_id=${userId}&company_id=${selectedCompany}`)
      .then((res) => {
        const data = res.data.data.find((s) => s.service_item_id === serviceItemId);
        setItem(data);
      });
  }, [serviceItemId, userId, selectedCompany]);

  if (!item) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="cust-serv-container">
        
        {/* Header with Back Button */}
        <div className="cust-serv-header">
          <button className="cust-serv-back-btn" onClick={() => navigate(-1)}>
            ←
          </button>
          <h3 className="cust-serv-title">Service Item Details</h3>
        </div>

        {/* Main Info */}
        <div className="cust-serv-details-box">
          <p><strong>Service Item ID:</strong> {item.service_item_id}</p>
          <p><strong>Name:</strong> {item.service_item_name}</p>
          <p><strong>Serial No:</strong> {item.serial_number}</p>
          <p><strong>PCB Serial No:</strong> {item.pcb_serial_number}</p>
          <p><strong>Status:</strong> {item.status}</p>
          <p><strong>IOT Status:</strong> {item.iot_status}</p>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Latitude:</strong> {item.location_latitude}</p>
          <p><strong>Longitude:</strong> {item.location_longitude}</p>

          <p><strong>Installation Date:</strong> {item.installation_date}</p>
          <p><strong>Warranty Start:</strong> {item.warranty_start_date}</p>
          <p><strong>Warranty End:</strong> {item.warranty_end_date}</p>
          <p><strong>Contract End:</strong> {item.contract_end_date}</p>

          <p><strong>Last Checked:</strong> {item.last_checked}</p>
          <p><strong>Last Service:</strong> {item.last_service}</p>

          <p><strong>Product Description:</strong> {item.product_description}</p>
          <p><strong>BC Number:</strong> {item.bc_number || "N/A"}</p>
          <p><strong>Ship To Code:</strong> {item.ship_to_code || "N/A"}</p>

          <p><strong>Product ID:</strong> {item.product}</p>
          <p><strong>Customer ID:</strong> {item.customer}</p>
          <p><strong>PM Group:</strong> {item.pm_group}</p>
          <p><strong>Company:</strong> {item.company}</p>

          <p><strong>Created At:</strong> {item.created_at}</p>
          <p><strong>Updated At:</strong> {item.updated_at}</p>
          <p><strong>Created By:</strong> {item.created_by}</p>
          <p><strong>Updated By:</strong> {item.updated_by}</p>
        </div>

        {/* COMPONENTS SECTION */}
        {item.service_item_components && item.service_item_components.length > 0 && (
          <div className="cust-serv-details-box" style={{ marginTop: "20px" }}>
            <h4 style={{ marginBottom: "12px" }}>Components</h4>

            {item.service_item_components.map((comp, index) => (
              <div key={index} className="cust-serv-component-box">
                <p><strong>Component ID:</strong> {comp.service_component_id}</p>
                <p><strong>Component Type:</strong> {comp.component_type}</p>
                <p><strong>Component Serial No:</strong> {comp.component_serial_number}</p>

                <p><strong>Warranty Start:</strong> {comp.warranty_start_date}</p>
                <p><strong>Warranty End:</strong> {comp.warranty_end_date}</p>

                <p><strong>Vendor ID:</strong> {comp.vendor_id}</p>
                <p><strong>Created By:</strong> {comp.created_by}</p>
                <p><strong>Updated By:</strong> {comp.updated_by}</p>

                <p><strong>Created At:</strong> {comp.created_at}</p>
                <p><strong>Updated At:</strong> {comp.updated_at}</p>
                <p><strong>Component Code:</strong> {comp.component}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceItemDetailsPage;
