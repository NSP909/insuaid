import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './components/LoginPage';
import UploadImagePage from './components/UploadImagePage';

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/upload" 
          element={isAuthenticated ? <UploadImagePage /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;