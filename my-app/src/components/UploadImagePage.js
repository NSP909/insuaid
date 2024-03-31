import UploadAndDisplayImage from './ImageUpload';
import AudioRecorder from './audioRecorder';
import React, { useEffect } from 'react';
import Button from './Button';

function UploadImagePage() {
  return (
    <div className="App">
      <header className="App-header">
      <div>
        <UploadAndDisplayImage /> 
        <Button to="/talkbot">Go to Talkbot</Button>

      </div>
    
      </header>
    </div>
  );
}

export default UploadImagePage;
