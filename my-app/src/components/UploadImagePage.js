import UploadAndDisplayImage from './ImageUpload';
import AudioRecorder from './audioRecorder';
import InsuranceInfoForm from './insuranceRequest';
import SplitScreen from './splitScreen';
import { FaMoneyBillAlt } from 'react-icons/fa';


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <SplitScreen
      right={<div>
        <h1> Medical Bill Errors </h1>
        </div>}
      left=
      {<div>
        <FaMoneyBillAlt size={150} /> 
        <h1 style={{marginTop: '20px'}}> CPTAid </h1> 
        <h2> Medical Bill Error Detector </h2> 

        <UploadAndDisplayImage> </UploadAndDisplayImage>
        <InsuranceInfoForm /> 
        <AudioRecorder/>  

      </div>}
    />
      </header>
    </div>
  );
}

export default App;
