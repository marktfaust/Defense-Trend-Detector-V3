import React from "react";

const DocsButton: React.FC = () => {
  // Read your project URL from an environment variable.
  const API_URL = import.meta.env.VITE_API_URL;

  // Handler that performs the redirect when the element is clicked.
  const handleRedirect = () => {
    window.location.href = `${API_URL}/docs`;
  };

  return <button onClick={handleRedirect}>Go to Documentation</button>;
};

export default DocsButton;
