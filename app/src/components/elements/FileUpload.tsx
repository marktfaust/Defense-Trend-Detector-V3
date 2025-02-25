// FileUpload.tsx
import React, { useState, ChangeEvent } from "react";

interface UploadResponse {
  // Define your API response type if known, or use a catch-all
  [key: string]: any;
}

const API_URL = import.meta.env.VITE_API_URL;

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) {
      alert("Please select a PDF file first!");
      return;
    }

    // Reset states and set loading state
    setIsLoading(true);
    setResponse(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const apiUrl: string = `${API_URL}/upload/`;
      const result: Response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        throw new Error(`Upload failed with status: ${result.status}`);
      }

      const data: UploadResponse = await result.json();
      setResponse(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during file upload"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload PDF File</h1>
      {isLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button onClick={handleUpload} disabled={isLoading}>
            {response ? "Upload Another File" : "Upload"}
          </button>
        </div>
      )}

      {/* Display response when available */}
      {response && (
        <div>
          <h3>Upload Response:</h3>
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

export default FileUpload;
