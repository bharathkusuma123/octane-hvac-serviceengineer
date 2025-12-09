import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Card, Alert, Tabs, Tab } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import baseURL from '../../ApiUrl/Apiurl';
import Swal from 'sweetalert2';
import './ServiceDetails.css'; // Import CSS file

const taskTypeOptions = [
  'Replace',
  'Clean',
  'Top-up',
  'Repair',
  'Inspect',
  'Other'
];

const statusOptions = [
  'Under Process',
  'Waiting for Spares',
  'Waiting for Quote',
  'Waiting for Client Approval',
  'Closed',
  'Reopened',
];

const ServiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, userId, selectedCompany, extractedResourceId, resourceData } = location.state || {};
  console.log("resourceData in service details:", resourceData);
  console.log("service",service);
  const [activeTab, setActiveTab] = useState('details');
  const [problemTypes, setProblemTypes] = useState([]);

  
  const [status, setStatus] = useState(service?.status || '');
  const [updating, setUpdating] = useState(false);
  const [items, setItems] = useState([{
    component: '',
    pm_schedule: '',
    old_comp_serial_no: '',
    new_comp_serial_no: '',
    task_type: '',
    warranty_start_date: '',
    warranty_end_date: '',
    action_taken: '',
    remarks: ''
  }]);
  const [submitting, setSubmitting] = useState(false);
  const [componentsList, setComponentsList] = useState([]);
  const [pmSchedulesList, setPmSchedulesList] = useState([]);
  
  // New state for completion form fields
  const [completionData, setCompletionData] = useState({
    act_start_datetime: '',
    act_end_datetime: '',
    act_material_cost: '',
    act_labour_hours: '',
    act_labour_cost: '',
    completion_notes: ''
  });

  // Fetch components and PM schedules
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [componentsRes, pmSchedulesRes] = await Promise.all([
          axios.get(`${baseURL}/components/`),
          axios.get(`${baseURL}/service-item-pm-schedules/?user_id=${userId}&company_id=${selectedCompany}`)
        ]);
        
        setComponentsList(componentsRes.data.data || []);
        setPmSchedulesList(pmSchedulesRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
  axios
    .get(`${baseURL}/problem-types/`)
    .then((res) => {
      const types =
        Array.isArray(res.data) 
          ? res.data 
          : Array.isArray(res.data.data) 
            ? res.data.data 
            : [];

      setProblemTypes(types);
    })
    .catch((err) => console.log("Error loading problem types", err));
}, []);

const getProblemTypeName = (id) => {
  if (!id || !Array.isArray(problemTypes)) return "N/A";

  const match = problemTypes.find(
    (p) => p.problem_type_id === id
  );

  return match ? match.name : "N/A";
};

  // Calculate labour hours and cost when dates change
  useEffect(() => {
    if (completionData.act_start_datetime && completionData.act_end_datetime) {
      const start = new Date(completionData.act_start_datetime);
      const end = new Date(completionData.act_end_datetime);
      
      if (end > start) {
        const diffMs = end - start;
        const diffHours = (diffMs / (1000 * 60 * 60)).toFixed(2); // Convert ms to hours
        const hourlyRate = parseFloat(resourceData?.hourly_rate) || 0;
        const labourCost = (parseFloat(diffHours) * hourlyRate).toFixed(2);
        
        setCompletionData(prev => ({
          ...prev,
          act_labour_hours: diffHours,
          act_labour_cost: labourCost
        }));
      }
    }
  }, [completionData.act_start_datetime, completionData.act_end_datetime, resourceData?.hourly_rate]);

  // Handle completion form field changes
  const handleCompletionDataChange = (field, value) => {
    setCompletionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate labour cost when labour hours change manually
  useEffect(() => {
    if (completionData.act_labour_hours && !completionData.act_start_datetime && !completionData.act_end_datetime) {
      const hourlyRate = parseFloat(resourceData?.hourly_rate) || 0;
      const labourCost = (parseFloat(completionData.act_labour_hours) * hourlyRate).toFixed(2);
      
      setCompletionData(prev => ({
        ...prev,
        act_labour_cost: labourCost
      }));
    }
  }, [completionData.act_labour_hours, resourceData?.hourly_rate]);

  if (!service) {
    return (
      <>
        <Navbar />
        <div className="service-details__container service-details__error-container">
          <div className="alert alert-danger">No service data found</div>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </>
    );
  }

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    // If status is being set to Closed, we'll update when form is submitted
    if (newStatus !== 'Closed') {
      await updateServiceStatus(newStatus);
    }
  };

  const updateServiceStatus = async (statusToUpdate, completionDataToUpdate = null) => {
    setUpdating(true);

    const requestId = service.request_id;

    if (!requestId) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Request ID',
        text: 'Service request ID is missing.',
      });
      setUpdating(false);
      return;
    }

    try {
      const updatePayload = {
        ...service,
        status: statusToUpdate,
        user_id: userId,
        company_id: selectedCompany
      };

      // Add completion data if status is Closed and completion data is provided
      if (statusToUpdate === 'Closed' && completionDataToUpdate) {
        Object.assign(updatePayload, completionDataToUpdate);
      }
      console.log("Updating service with payload:", JSON.stringify(updatePayload, null, 2));

      await axios.put(`${baseURL}/service-pools/${requestId}/`, updatePayload);
      

      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Service status changed to "${statusToUpdate}" successfully.`,
      });
      navigate(-1); // Go back to previous page
    } catch (err) {
      console.error('Error updating status in service-pools:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || err.message || 'Something went wrong.',
      });
    } finally {
      setUpdating(false);
    }
  };

  // Handle completion form submission
  const handleCompletionSubmit = async () => {
    // Validate completion form when status is Closed
    if (status === 'Closed') {
      if (!completionData.act_start_datetime || !completionData.act_end_datetime) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please fill in both Actual Start Date Time and Actual End Date Time when closing the service.',
        });
        return;
      }

      const start = new Date(completionData.act_start_datetime);
      const end = new Date(completionData.act_end_datetime);
      
      if (end <= start) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Actual End Date Time must be after Actual Start Date Time.',
        });
        return;
      }
    }

    await updateServiceStatus(status, status === 'Closed' ? completionData : null);
  };

  // Service Items History Form Functions
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addNewItem = () => {
    setItems([...items, {
      component: '',
      pm_schedule: '',
      old_comp_serial_no: '',
      new_comp_serial_no: '',
      task_type: '',
      warranty_start_date: '',
      warranty_end_date: '',
      action_taken: '',
      remarks: ''
    }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    }
  };

  const handleSubmitItems = async () => {
    // Validation
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.component || !item.task_type || !item.action_taken) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: `Please fill in all required fields for item ${i + 1} (Component, Task Type, and Action Taken are required)`,
        });
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        user_id: userId,
        company_id: selectedCompany,
        items: items.map(item => ({
          service_request: service.request_id || service.id,
          component: item.component,
          pm_schedule: item.pm_schedule || null,
          old_comp_serial_no: item.old_comp_serial_no || '',
          new_comp_serial_no: item.new_comp_serial_no || '',
          task_type: item.task_type,
          warranty_start_date: item.warranty_start_date || null,
          warranty_end_date: item.warranty_end_date || null,
          action_taken: item.action_taken,
          remarks: item.remarks || '',
          serviced_by: extractedResourceId,
          created_by: userId,
          updated_by: userId,
          company: selectedCompany
        }))
      };
      console.log("Submitting service items history with payload:", JSON.stringify(payload, null, 2));

      await axios.post(`${baseURL}/service-req-items-history/`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Service items history has been submitted successfully.',
      });

      // Reset form
      setItems([{
        component: '',
        pm_schedule: '',
        old_comp_serial_no: '',
        new_comp_serial_no: '',
        task_type: '',
        warranty_start_date: '',
        warranty_end_date: '',
        action_taken: '',
        remarks: ''
      }]);
      navigate(-1); // Go back to previous page

    } catch (error) {
      console.error('Error submitting service items history:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || error.message || 'Failed to submit service items history',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (date, time) => {
    if (!date && !time) return 'N/A';
    
    try {
      const dt = new Date(time ? `${date}T${time}` : date);
      return dt.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <>
      <Navbar />
      <div className="service-details__container">
        <div className="service-details__header">
          <h2 className="service-details__title">
            Service ID: {service.request_id || service.id}
          </h2>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(-1)}
            className="service-details__back-btn"
          >
            Back to Services
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(tab) => setActiveTab(tab)}
          className="service-details__tabs mb-4"
        >
          <Tab eventKey="details" title="Service Details" className="service-details__tab">
            <div className="service-details__content">
              <div className="service-details__info-section">
                <h4 className="service-details__section-title">Service Information</h4>
                <Row className="service-details__info-grid">
                  <Col xs={12} md={6} className="service-details__info-col">
                    <div className="service-details__info-item">
                      <label>Request/Problem Type:</label>
                     <span>{getProblemTypeName(service.problem_type)}</span>

                    </div>
                    <div className="service-details__info-item">
                      <label>Request Details:</label>
                      <span>{service.request_details || 'N/A'}</span>
                    </div>
                    <div className="service-details__info-item">
                      <label>Estimated Completion:</label>
                      <span>{service.estimated_completion_time || 'N/A'}</span>
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="service-details__info-col">
                    <div className="service-details__info-item">
                      <label>Preferred Date & Time:</label>
                      <span>{formatDateTime(service.preferred_date, service.preferred_time)}</span>
                    </div>
                    <div className="service-details__info-item">
                      <label>Start Date & Time:</label>
                      <span>{formatDateTime(service.est_start_datetime)}</span>
                    </div>
                    <div className="service-details__info-item">
                      <label>End Date & Time:</label>
                      <span>{formatDateTime(service.est_end_datetime)}</span>
                    </div>
                  <div className="service-details__info-item-link">
  <label>Customer:</label>

  <span
    className="link-text"
    onClick={() =>
      navigate(`/serviceengineer/customer/${service.customer}`, {
        state: { userId, selectedCompany }
      })
    }
  >
    {service.customer || "N/A"}
  </span>
</div>


      <div className="service-details__info-item-link">
        <label>Service Item:</label>
        <span
          className="link-text"
          onClick={() =>
      navigate(`/serviceengineer/service-item/${service.service_item}`, {
        state: { userId, selectedCompany }
      })
          }
        >
          {service.service_item || "N/A"}
        </span>
      </div>
                  </Col>
                </Row>
              </div>

              <div className="service-details__status-section">
                <h4 className="service-details__section-title">Update Status</h4>
                <Form.Group className="service-details__status-form">
                  <Form.Label><strong>Current Status</strong></Form.Label>
                  <Form.Select 
                    value={status} 
                    onChange={handleStatusChange} 
                    disabled={updating}
                    className="service-details__status-select"
                  >
                    <option value="">-- Select Status --</option>
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Completion Form - Only shown when status is Closed */}
                {status === 'Closed' && (
                  <div className="service-details__completion-form mt-4">
                    <h5 className="service-details__completion-title">Service Completion Details</h5>
                    <Row className="service-details__completion-grid">
                      <Col xs={12} md={6} className="service-details__completion-col">
                        <Form.Group className="service-details__form-group">
                          <Form.Label>Actual Start Date Time *</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            value={completionData.act_start_datetime}
                            onChange={(e) => handleCompletionDataChange('act_start_datetime', e.target.value)}
                            className="service-details__form-control"
                          />
                        </Form.Group>

                        <Form.Group className="service-details__form-group">
                          <Form.Label>Actual End Date Time *</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            value={completionData.act_end_datetime}
                            onChange={(e) => handleCompletionDataChange('act_end_datetime', e.target.value)}
                            className="service-details__form-control"
                          />
                        </Form.Group>

                        <Form.Group className="service-details__form-group">
                          <Form.Label>Material Cost (₹)</Form.Label>
                          <Form.Control
                            type="number"
                            step="0.01"
                            value={completionData.act_material_cost}
                            onChange={(e) => handleCompletionDataChange('act_material_cost', e.target.value)}
                            placeholder="Enter material cost"
                            className="service-details__form-control"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6} className="service-details__completion-col">
                        <Form.Group className="service-details__form-group">
                          <Form.Label>Labour Hours</Form.Label>
                          <Form.Control
                            type="number"
                            step="0.01"
                            value={completionData.act_labour_hours}
                            onChange={(e) => handleCompletionDataChange('act_labour_hours', e.target.value)}
                            placeholder="Auto-calculated"
                            readOnly={!!completionData.act_start_datetime && !!completionData.act_end_datetime}
                            className="service-details__form-control"
                          />
                          <Form.Text className="text-muted">
                            {completionData.act_start_datetime && completionData.act_end_datetime 
                              ? 'Auto-calculated from dates' 
                              : 'Manual entry allowed if dates not set'}
                          </Form.Text>
                        </Form.Group>

                        <Form.Group className="service-details__form-group">
                          <Form.Label>Labour Cost (₹)</Form.Label>
                          <Form.Control
                            type="number"
                            step="0.01"
                            value={completionData.act_labour_cost}
                            onChange={(e) => handleCompletionDataChange('act_labour_cost', e.target.value)}
                            placeholder="Auto-calculated"
                            readOnly
                            className="service-details__form-control"
                          />
                          <Form.Text className="text-muted">
                            Hourly Rate: ₹{resourceData?.hourly_rate || '0.00'} × {completionData.act_labour_hours || '0'} hours
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      <Col xs={12} className="service-details__completion-full-col">
                        <Form.Group className="service-details__form-group">
                          <Form.Label>Completion Notes</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={completionData.completion_notes}
                            onChange={(e) => handleCompletionDataChange('completion_notes', e.target.value)}
                            placeholder="Enter completion notes and remarks"
                            className="service-details__form-control service-details__textarea"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="service-details__completion-actions mt-3">
                      <Button 
                        variant="primary" 
                        onClick={handleCompletionSubmit}
                        disabled={updating}
                        className="service-details__update-btn"
                      >
                        {updating ? 'Updating...' : 'Update Status with Completion Details'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tab>

          <Tab eventKey="items" title="Replaced Service Item Components" className="service-details__tab">
            <div className="service-details__items-content">
              <div className="service-details__items-header">
                <h4 className="service-details__section-title">Service Items History</h4>
                <p className="service-details__section-subtitle">
                  Add service items and their details below
                </p>
              </div>

              {items.map((item, index) => (
                <div key={index} className="service-details__item-card">
                  <div className="service-details__item-header">
                    <h5 className="service-details__item-title">Item {index + 1}</h5>
                    {items.length > 1 && (
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => removeItem(index)}
                        className="service-details__remove-btn"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <Row className="service-details__item-form">
                    <Col xs={12} md={6} className="service-details__form-col">
                      <Form.Group className="service-details__form-group">
                        <Form.Label>Component *</Form.Label>
                        <Form.Select 
                          value={item.component}
                          onChange={(e) => handleItemChange(index, 'component', e.target.value)}
                          className="service-details__form-control"
                        >
                          <option value="">Select Component</option>
   {Array.isArray(componentsList) && componentsList.map(comp => (
                                <option key={comp.id || comp.component_id} value={comp.id || comp.component_id}>
                                  {comp.component_id} - {comp.component_name}
                                </option>
                              ))}
</Form.Select>
                      </Form.Group>

                      <Form.Group className="service-details__form-group">
                        <Form.Label>PM Schedule</Form.Label>
                        <Form.Select 
                          value={item.pm_schedule}
                          onChange={(e) => handleItemChange(index, 'pm_schedule', e.target.value)}
                          className="service-details__form-control"
                        >
                          <option value="">Select PM Schedule</option>
                          {Array.isArray(pmSchedulesList) && pmSchedulesList.map(schedule => (
    <option key={schedule.id} value={schedule.id}>
      {schedule.pm_schedule_id}
    </option>
  ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="service-details__form-group">
                        <Form.Label>Old Component Serial No</Form.Label>
                        <Form.Control
                          type="text"
                          value={item.old_comp_serial_no}
                          onChange={(e) => handleItemChange(index, 'old_comp_serial_no', e.target.value)}
                          placeholder="Enter old serial number"
                          className="service-details__form-control"
                        />
                      </Form.Group>

                      <Form.Group className="service-details__form-group">
                        <Form.Label>New Component Serial No</Form.Label>
                        <Form.Control
                          type="text"
                          value={item.new_comp_serial_no}
                          onChange={(e) => handleItemChange(index, 'new_comp_serial_no', e.target.value)}
                          placeholder="Enter new serial number"
                          className="service-details__form-control"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6} className="service-details__form-col">
                      <Form.Group className="service-details__form-group">
                        <Form.Label>Task Type *</Form.Label>
                        <Form.Select 
                          value={item.task_type}
                          onChange={(e) => handleItemChange(index, 'task_type', e.target.value)}
                          className="service-details__form-control"
                        >
                          <option value="">Select Task Type</option>
                          {taskTypeOptions.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="service-details__form-group">
                        <Form.Label>Warranty Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={item.warranty_start_date}
                          onChange={(e) => handleItemChange(index, 'warranty_start_date', e.target.value)}
                          className="service-details__form-control"
                        />
                      </Form.Group>

                      <Form.Group className="service-details__form-group">
                        <Form.Label>Warranty End Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={item.warranty_end_date}
                          onChange={(e) => handleItemChange(index, 'warranty_end_date', e.target.value)}
                          className="service-details__form-control"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} className="service-details__full-width-col">
                      <Form.Group className="service-details__form-group">
                        <Form.Label>Action Taken *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={item.action_taken}
                          onChange={(e) => handleItemChange(index, 'action_taken', e.target.value)}
                          placeholder="Describe the action taken"
                          className="service-details__form-control service-details__textarea"
                        />
                      </Form.Group>

                      <Form.Group className="service-details__form-group">
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={item.remarks}
                          onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                          placeholder="Enter any additional remarks"
                          className="service-details__form-control service-details__textarea"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              ))}

              <div className="service-details__actions">
                <Button 
                  variant="outline-primary" 
                  onClick={addNewItem}
                  className="service-details__add-btn"
                >
                  Add Another Item
                </Button>
                
                <Button 
                  variant="success" 
                  onClick={handleSubmitItems}
                  disabled={submitting}
                  className="service-details__submit-btn"
                >
                  {submitting ? 'Submitting...' : 'Submit Service Items'}
                </Button>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default ServiceDetails;


