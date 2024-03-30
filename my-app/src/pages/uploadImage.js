import UploadAndDisplayImage from '../components/ImageUpload';
import AudioRecorder from '../components/audioRecorder';
import InsuranceInfoForm from '../components/insuranceRequest';
import SplitScreen from '../components/splitScreen';
import { FaMoneyBillAlt } from 'react-icons/fa';

function UploadImage() {
  return (
    <div className="UploadImage">
      <header className="imageHeader">
      <SplitScreen
      left={<div style={{padding: '60px'}}>
        <FaMoneyBillAlt size={150} /> 
        <h1 style={{marginTop: '20px'}}> CPTAid </h1> 
        <h2 style={{marginTop: '20px'}}> Medical Bill Error Detector </h2> 

        <p style={{marginTop: '20px'}}> Over 80% of medical bills contain errors. Let us help you detect them. </p>

        <p style={{marginTop: '20px'}}> 1. Upload a picture of your bill.</p> 
        <p style={{marginTop: '10px'}}> 2. Let us detect errors. </p> 
        <p style={{marginTop: '10px'}}> 3. Discuss next steps with our chatbot. </p> 
        </div>}
      right=
      {<div>
        <UploadAndDisplayImage> </UploadAndDisplayImage>
        <InsuranceInfoForm /> 
        <AudioRecorder/>  

      </div>}
    />
      </header>
    </div>
  );
}

export default UploadImage;
