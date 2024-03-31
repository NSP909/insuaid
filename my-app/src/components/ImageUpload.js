import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth0 } from "@auth0/auth0-react";
import { FaMoneyBillAlt } from "react-icons/fa";
import "../styles/ImageUpload.css";

const UploadAndDisplayImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // 1. ADD: STATE TO STORE RESPONSE TEXT DATA
  const [textData, setTextData] = useState(null);

  const { user } = useAuth0();
  const uploadImage = async () => {
    // clicking this button will send image to server

    // if no image, need to alert user to get one
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage); // "file" for backend endpoint
    formData.append("insurance", "UNITED HEALTHCARE");

    formData.append("userName", user.name);
    formData.append("userEmail", user.email);

    console.log(user.name);
    console.log(user.email);
    console.log(formData);

    // use HTTP response to send data
    try {
      const response = await fetch("http://127.0.0.1:5000/image", {
        // replace with endpoint URL
        method: "POST",
        body: formData,
      });

      console.log("Response from backend:", response);
      // if no correct status code, throw error
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      const textData = await response.json();

      // 2. UPDATE STATE
      setTextData(textData);

      console.log("Received JSON from backend:", textData);

      // todo: handle success response
      // need to send something to user indicating such
    } catch (error) {
      console.error("Uploading failed", error);
      // further error handling steps?
    }
  };

  return (
    <div className="upload-container">
      {/* Left half (Lighter background) */}
      <div className="upload-section left-section">
        <FaMoneyBillAlt size={150} className="money-icon" />
        <h1 className="title">CPTAid</h1>
        <h2 className="subtitle">Medical Bill Analysis Tool</h2>
        <div className="results-container">
          {/* Results output */}
          {/* ...existing map function for textData... */}
        </div>
      </div>

      {/* Right half (Soothing blue background) */}
      <div className="upload-section right-section">
        <div className="upload-instructions">
          <h2>Get Started with Your Bill Analysis</h2>
          <p>
            Upload your medical bill to check for discrepancies and potential
            overcharges. Our analysis is quick, secure, and confidential.
          </p>

          {/* ...existing image preview... */}

          <div className="file-upload-container">
            <input
              className="form-control-file"
              type="file"
              name="myImage"
              onChange={(event) => setSelectedImage(event.target.files[0])}
            />
            <button className="btn btn-action mt-2" onClick={uploadImage}>
              Analyze Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAndDisplayImage;
