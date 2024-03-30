import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const UploadAndDisplayImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const uploadImage = async () => {
    // clicking this button will send image to server 

    // if no image, need to alert user to get one 
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage); // "file" for backend endpoint 

    // use HTTP response to send data 
    try {
      const response = await fetch("/image", { // replace with endpoint URL
        method: "POST",
        body: formData,
      });

      // if no correct status code, throw error 
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload successful", result);

      // todo: handle success response 
      // need to send something to user indicating such 

    } catch (error) {
      console.error("Uploading failed", error);
      // further error handling steps? 
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1>Upload a copy of your provisional bill below.</h1>
        <h3>This will allow us to scan for bill errors or discrepancies.</h3>

        {selectedImage && (
          <div className="mt-3">
            <img
              alt="Selected"
              width={"250px"}
              src={URL.createObjectURL(selectedImage)}
              className="img-thumbnail"
            />
            <br />
            <button className="btn btn-danger mt-2" onClick={() => setSelectedImage(null)}>Remove Image</button>
          </div>
        )}

        <div className="form-group mt-3">
          <input
            className="form-control-file"
            type="file"
            name="myImage"
            onChange={(event) => {
              console.log(event.target.files[0]);
              setSelectedImage(event.target.files[0]);
            }}
          />
          <button className="btn btn-primary mt-2" onClick={uploadImage}>Upload Image</button>
        </div>
      </div>
    </div>
  );
};

export default UploadAndDisplayImage;
