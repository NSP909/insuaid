import React, { useState } from "react";

const InsuranceInfoForm = () => {
  const [insuranceInfo, setInsuranceInfo] = useState("");

  // const handleSubmit = (event) => {
  //     event.preventDefault();
  //     // blank for now, really when you hit submit should send to backend
  // };

  return (
    // <form onSubmit={handleSubmit}>
    <form>
      <div className="form-group">
        <label htmlFor="insuranceInfo">
          Enter the name of your insurance plan.
        </label>
        <input
          type="text"
          className="form-control"
          id="insuranceInfo"
          value={insuranceInfo}
          onChange={(e) => setInsuranceInfo(e.target.value)}
          placeholder="Insurance Provider"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default InsuranceInfoForm;
