import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import baseURL from "../../ApiUrl/Apiurl";
import "./CustServDetails.css"; // CSS file

const CustomerDetailsPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  const location = useLocation();
  const { userId, selectedCompany } = location.state || {};

  useEffect(() => {
    axios
      .get(`${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`)
      .then((res) => {
        const data = res.data.data.find((c) => c.customer_id === customerId);
        setCustomer(data);
      });
  }, [customerId, userId, selectedCompany]);

  if (!customer) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="cust-serv-container">
        <div className="cust-serv-header">
          <button className="cust-serv-back-btn" onClick={() => navigate(-1)}>
            ←
          </button>
          <h3 className="cust-serv-title">Customer Details</h3>
        </div>

        <div className="cust-serv-details-box">
          <p><strong>Customer ID:</strong> {customer.customer_id}</p>
          <p><strong>Name:</strong> {customer.full_name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Mobile:</strong> {customer.mobile}</p>
          <p><strong>Telephone:</strong> {customer.telephone}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>City:</strong> {customer.city}</p>
          <p><strong>Country Code:</strong> {customer.country_code}</p>
          <p><strong>Customer Type:</strong> {customer.customer_type}</p>
          <p><strong>Status:</strong> {customer.status}</p>
          <p><strong>Company:</strong> {customer.company}</p>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailsPage;
