import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Image Upload</Link>
        </li>
        <li>
          <Link to="/ViewResults">About</Link>
        </li>
        <li>
          <Link to="/ChatAdvisor">Chat with my Advisor</Link>
        </li>
        <li>
          <Link to="/CheckPrice">Check Price</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
