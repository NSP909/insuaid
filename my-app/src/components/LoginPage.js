import React, { useEffect } from 'react'; // Correctly imported useEffect
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; 
import logo from '../assets/logo.png'; 

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => { 
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <img src = {logo} alt="Company Logo" className="logo" />
      <h1>Welcome to Fair Charge!</h1>
      <p>Click below to sign in to your account securely.</p>
      <button onClick={() => loginWithRedirect()} className="login-button">Log In</button>
      <p className="help-link">Need help?</p>
    </div>
  );
};

export default LoginPage;
