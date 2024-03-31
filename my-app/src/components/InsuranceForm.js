import React, { useState } from 'react';
import UploadImagePage from './UploadImagePage';
import '../InsuranceForm.css'; // Make sure to import the CSS

const InsuranceForm = () => {
  const [insuranceName, setInsuranceName] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      insuranceName,
      address, // include the address in the formData object
      // Add other data as needed
    };

    // Make the POST request with the form data
    try {
      const response = await fetch('http://127.0.0.1:5000/update_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the authorization header if needed
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If submission is successful, set submitted to true
      setSubmitted(true);

    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  };

  // If the form has been submitted, render the UploadImagePage
  if (submitted) {
    return <UploadImagePage />;
  }

  // Form rendering with an input for the address
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="centered-form">
      <div className="form-group">
      <label htmlFor="insuranceName">Insurance Name:</label>
      <input
        type="text"
        id="insuranceName"
        value={insuranceName}
        onChange={(e) => setInsuranceName(e.target.value)}
        required
        className="form-control"
      />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="form-control"
        />
      </div>
        {/* Submit button */}
        <div className="button-container">
          <button type="submit" className="submit-button">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceForm;
