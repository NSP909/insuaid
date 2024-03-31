import UploadAndDisplayImage from './ImageUpload';
import AudioRecorder from './audioRecorder';
import InsuranceInfoForm from './insuranceRequest';
import SplitScreen from './splitScreen';
import { FaMoneyBillAlt } from 'react-icons/fa';
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';


function UploadImagePage() {

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  console.log(user.email)
  useEffect(() => {

    const sendEmail = async () => {
      const accessToken = await getAccessTokenSilently();

      await fetch('http://127.0.0.1:5000/updateemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email: user.email }),
      });
    };


    if (isAuthenticated && user) {
      sendEmail().catch(console.error);
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return (
    <div className="App">
      <header className="App-header">
      
      <div>
        <FaMoneyBillAlt size={150} /> 
        <h1 style={{marginTop: '20px'}}> CPTAid </h1> 
        <h2> Medical Bill Error Detector </h2> 

        <UploadAndDisplayImage> </UploadAndDisplayImage>
        <InsuranceInfoForm /> 
        <AudioRecorder/>  

      </div>
    
      </header>
    </div>
  );
}

export default UploadImagePage;
