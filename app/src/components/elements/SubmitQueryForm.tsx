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
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-left">Submit a Query</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          className="p-2 border rounded-md"
          rows={4}
          placeholder="Enter your query..."
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Query"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-3 text-left">{error}</p>}

      {responseData && (
        <div className="mt-4 p-2 bg-white border rounded-md text-left">
          <h2 className="font-medium">Response Details:</h2>
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

          <h3 className="mt-2 font-medium">Sources:</h3>
          <ul className="list-disc pl-4">
            {responseData.sources.map((source, index) => (
              <li key={index} className="text-sm">
                {source}
              </li>
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
