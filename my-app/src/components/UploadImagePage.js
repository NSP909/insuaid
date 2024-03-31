import UploadAndDisplayImage from "./ImageUpload";
import AudioRecorder from "./audioRecorder";
import React, { useEffect } from "react";


function UploadImagePage() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <UploadAndDisplayImage />
          
        </div>
      </header>
    </div>
  );
}

export default UploadImagePage;
