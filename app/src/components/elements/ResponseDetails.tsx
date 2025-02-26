import React, { useState, useEffect } from "react";

interface ApiResponse {
  query_id: string;
  create_time: number;
  query_text: string;
  answer_text: string;
  sources: string[];
  is_complete: boolean;
}

const ResponseDetails: React.FC<{ responseData: ApiResponse | null }> = ({
  responseData,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [visibleSources, setVisibleSources] = useState<number>(3);

  // Reset expansion state when new response data comes in
  useEffect(() => {
    setIsExpanded(false);
    setVisibleSources(3);
  }, [responseData]);

  if (!responseData) {
    return null;
  }

  const formattedDate = new Date(
    responseData.create_time * 1000
  ).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "medium",
  });

  const toggleSourcesExpansion = () => {
    if (isExpanded) {
      setVisibleSources(3);
    } else {
      setVisibleSources(responseData.sources.length);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-8 bg-slate-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-slate-700">
        Response Details
      </h2>

      <div className="space-y-2">
        <p className="text-slate-700">
          <span className="font-semibold">Query ID:</span>{" "}
          {responseData.query_id}
        </p>
        <p className="text-slate-700">
          <span className="font-semibold">Created At:</span> {formattedDate}
        </p>
        <p className="text-slate-700">
          <span className="font-semibold">Query:</span> "
          {responseData.query_text}"
        </p>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold text-slate-700">Answer:</h3>
        <p className="mt-2 text-slate-700 whitespace-pre-line">
          {responseData.answer_text}
        </p>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-slate-700">
            Files attached:
          </h3>
          {responseData.sources.length > 3 && (
            <button
              onClick={toggleSourcesExpansion}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isExpanded ? "Show less" : "Show all"}
            </button>
          )}
        </div>
        <ul className="list-disc list-inside text-slate-700 mt-2">
          {responseData.sources
            .slice(0, visibleSources)
            .map((source, index) => (
              <li
                key={index}
                className="truncate hover:text-clip hover:whitespace-normal"
              >
                {source}
              </li>
            ))}
        </ul>
        {responseData.sources.length > visibleSources && (
          <p className="text-slate-500 text-sm mt-1">
            +{responseData.sources.length - visibleSources} more files
          </p>
        )}
      </div>

      <div className="mt-4">
        <p className="text-slate-700">
          <span className="font-semibold">Completion Status:</span>{" "}
          <span
            className={
              responseData.is_complete ? "text-green-600" : "text-amber-600"
            }
          >
            {responseData.is_complete ? "✅ Complete" : "⏳ Processing"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResponseDetails;
