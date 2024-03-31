import React, { useEffect } from 'react'; // Import React and any hooks you are using
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      {/* ... your login page contents ... */}
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  );
};

export default LoginPage;