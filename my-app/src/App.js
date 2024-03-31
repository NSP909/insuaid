import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./components/LoginPage";

import InsuranceForm from "./components/InsuranceForm";
import TalkbotPage from "./components/talkbot";
import TalkBot02 from "./components/TalkBot02";

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <InsuranceForm/> : <Navigate to="/" />}
        />
        <Route path="/talkbot" element={<TalkbotPage />} />
        <Route path="/talkbot02" element={<TalkBot02 />} />
      </Routes>
    </Router>
  );
};

export default App;
