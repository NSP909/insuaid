import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/UploadImagePage';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import LoginPage from './components/LoginPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-ftz5nmqob4imyhw6.us.auth0.com"
      clientId="Oakn4DPSLUUr5BQVvYBlPJN46wskRo05"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
    <LoginPage />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
