import UploadAndDisplayImage from './ImageUpload';
import AudioRecorder from './audioRecorder';
import InsuranceInfoForm from './insuranceRequest';
import SplitScreen from './splitScreen';
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from './Button';

function UploadImagePage() {


  return (
    <div className="App">
      <header className="App-header">
      
      <div>
        <UploadAndDisplayImage> </UploadAndDisplayImage>
        <Button to="/talkbot">Go to Talkbot</Button>

      </div>
    
      </header>
    </div>
  );
}

export default UploadImagePage;
