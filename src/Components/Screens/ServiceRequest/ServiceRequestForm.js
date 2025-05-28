import React, { useState } from 'react';
import NavScreen from '../../Screens/Navbar/Navbar';
import './ServiceRequestForm.css'; // Importing external CSS

const ServiceRequestForm = () => {
  const [action, setAction] = useState('accept');
  const [formData, setFormData] = useState({
    serviceId: '',
    estimatedCompletionTime: '',
    startDateTime: '',
    endDateTime: '',
    rejectionReason: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleActionChange = (e) => {
    const value = e.target.value;
    setAction(value);
    if (value === 'accept') {
      setFormData(prev => ({ ...prev, rejectionReason: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", { ...formData, action });
  };

  return (
    <div className="machine-screen">
      <NavScreen />
      <h2 className="machine-title">Machine Screen</h2>

      <form className="machine-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Service Id</label>
          <input type="text" name="serviceId" value={formData.serviceId} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Estimated Completion Time</label>
<input type="datetime-local" name="estimatedCompletionTime" value={formData.estimatedCompletionTime} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Estimated Start Date & Time</label>
          <input type="datetime-local" name="startDateTime" value={formData.startDateTime} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Estimated End Date & Time</label>
          <input type="datetime-local" name="endDateTime" value={formData.endDateTime} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Action</label>
          <select name="action" value={action} onChange={handleActionChange} required>
            <option value="accept">Accept</option>
            <option value="reject">Reject</option>
          </select>
        </div>

        {action === 'reject' && (
          <div className="form-group">
            <label>Reason for Rejection</label>
            <textarea name="rejectionReason" value={formData.rejectionReason} onChange={handleChange} required></textarea>
          </div>
        )}

        <button className="submit-btn" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ServiceRequestForm;
