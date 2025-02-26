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
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-slate-700">File Upload</h3>
      <div className="flex flex-col space-y-3">
        <input
          type="file"
          id="fileUpload"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isLoading
            ? "Uploading..."
            : response
            ? "Upload Another File"
            : "Upload"}
        </button>
      </div>

      {isLoading && (
        <div className="mt-4">
          <p>Loading...</p>
        </div>
      )}

      {/* Display response when available */}
      {response && (
        <div className="mt-4 p-4 bg-white border border-slate-300 rounded-md">
          <h3 className="text-xl font-semibold mb-2 text-slate-700">
            Upload Response:
          </h3>
          <pre className="text-sm text-slate-700 whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {/* Display error if any */}
      {error && (
        <div className="mt-4 text-red-600">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
