import React, { useState } from "react";

interface ApiResponse {
  query_id: string;
  create_time: number;
  query_text: string;
  answer_text: string;
  sources: string[];
  is_complete: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

const SubmitQueryForm: React.FC = () => {
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

      {responseData && (
        <div className="mt-4 p-4 bg-white border border-slate-300 rounded-md text-slate-700">
          <h3 className="text-xl font-semibold mb-2">Response Details:</h3>
          <p>
            <strong>Query ID:</strong> {responseData.query_id}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(responseData.create_time * 1000).toLocaleString()}
          </p>
          <p className="whitespace-pre-line">
            <strong>Your Query:</strong> {responseData.query_text}
          </p>
          <p className="whitespace-pre-line">
            <strong>Answer:</strong> {responseData.answer_text}
          </p>

          <h4 className="mt-2 font-semibold">Sources:</h4>
          <ul className="list-disc pl-4 text-sm">
            {responseData.sources.map((source, index) => (
              <li key={index}>{source}</li>
            ))}
          </ul>

          <p className="mt-2">
            <strong>Completion Status:</strong>{" "}
            {responseData.is_complete ? "✅ Complete" : "❌ Incomplete"}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubmitQueryForm;
