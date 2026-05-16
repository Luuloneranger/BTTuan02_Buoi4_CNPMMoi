import React from "react";

const Button = ({ children, onClick, type = "button", className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm ${className}`}
  >
    {children}
  </button>
);

export default Button;
