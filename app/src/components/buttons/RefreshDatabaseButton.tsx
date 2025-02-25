import React, { useState } from "react";

interface RefreshDatabaseResponse {
  // Define your API response type here
  // For example:
  // id: number;
  // name: string;
  [key: string]: any; // This is a fallback if you don't know the exact structure
}

const API_URL = import.meta.env.VITE_API_URL;

const RefreshDatabaseButton: React.FC = () => {
  // State to track loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State to store API response
  const [response, setResponse] = useState<RefreshDatabaseResponse | null>(
    null
  );
  // State to track errors
  const [error, setError] = useState<string | null>(null);

  // Function to handle API call
  const handleApiCall = async (): Promise<void> => {
    // Reset states
    setIsLoading(true);
    setResponse(null);
    setError(null);

    try {
      // Replace with your actual API endpoint
      const apiUrl: string = `${API_URL}/populate_database`;

      // Make the API call
      const result: Response = await fetch(apiUrl, {
        method: "POST", // Replace with POST, PUT, etc. if needed
        headers: {
          "Content-Type": "application/json",
          // Add any other headers you need (auth tokens, etc.)
        },
        // If sending data, uncomment and modify:
        // body: JSON.stringify({ key: 'value' }),
      });

      // Check if the request was successful
      if (!result.ok) {
        throw new Error(`API call failed with status: ${result.status}`);
      }

      // Parse and store the response
      const data: RefreshDatabaseResponse = await result.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isLoading ? (
        <button onClick={handleApiCall} disabled={isLoading}>
          {response ? "Call API Again" : "Update Database"}
        </button>
      ) : (
        <div>
          <div></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Display response when available */}
      {response && (
        <div>
          <h3>API Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {/* Display error if any */}
      {error && (
        <div>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default RefreshDatabaseButton;
