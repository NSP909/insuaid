import React from "react";
import { Link } from "react-router-dom";

const Button = ({ to, children }) => {
  return (
    <Link to={to}>
      <button></button>
    </Link>
  );
};

export default Button;
