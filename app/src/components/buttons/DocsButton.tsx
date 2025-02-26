import React from "react";

const DocsButton: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const handleRedirect = () => {
    window.location.href = `${API_URL}/docs`;
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleRedirect}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        See API Documentation
      </button>
    </div>
  );
};

export default DocsButton;
