import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/navBar';
import UploadImage from './pages/uploadImage'; 
import ViewResults from './pages/viewResults.js'; 
import AdvisorChat from './pages/advisorChat'; 
import CheckPrice from './pages/CheckPrice'; 

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<UploadImage />} />
          <Route path="/ViewResults" element={<ViewResults />} />
          <Route path="/ChatAdvisor" element={<AdvisorChat />} />
          <Route path="/CheckPrice" element={<CheckPrice />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;