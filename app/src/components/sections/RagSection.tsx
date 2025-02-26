import React, { useState } from "react";
import RefreshDatabaseButton from "../buttons/RefreshDatabaseButton";
import ResetDatabaseButton from "../buttons/ResetDatabaseButton";
import FileUpload from "../elements/FileUpload";
import DocsButton from "../buttons/DocsButton";
import ResponseDetails from "../elements/ResponseDetails";

interface ApiResponse {
  query_id: string;
  create_time: number;
  query_text: string;
  answer_text: string;
  sources: string[];
  is_complete: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

const RagSection: React.FC = () => {
  const [queryText, setQueryText] = useState<string>("");
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      if (!API_URL) {
        setError("API URL is not defined");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/submit_query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query_text: queryText }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setResponseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">
        RAG Query System
      </h1>

      <div className="flex flex-row gap-8">
        {/* Left Column - Query Form */}
        <div className="w-1/2 bg-slate-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">
            Query Section
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              placeholder="Enter your query..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Query"}
            </button>
          </form>

          {error && <p className="text-red-500 mt-3 text-left">{error}</p>}
        </div>

        {/* Right Column - Database Controls */}
        <div className="w-1/2 bg-slate-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">
            Database Controls
          </h2>
          <div className="space-y-4">
            <RefreshDatabaseButton />
            <ResetDatabaseButton />
            <FileUpload />
            <DocsButton />
          </div>
        </div>
      </div>

      {/* Response Details Section */}
      {responseData && <ResponseDetails responseData={responseData} />}
    </div>
  );
};

export default RagSection;
