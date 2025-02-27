import React, { useState, ChangeEvent } from "react";

interface CrawlResponse {
  markdown?: string;
}

const CrawlSection: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCrawl = async () => {
    setError("");
    setMarkdown("");

    if (!url) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      const response = await fetch("http://0.0.0.0:8000/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data: CrawlResponse = await response.json();
      setMarkdown(data.markdown || "");
    } catch (err) {
      console.error("Error crawling URL:", err);
      setError("Failed to crawl the URL. Check the console for details.");
    }
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  return (
    <div className="card p-4 my-4 shadow-md w-full">
      <h2 className="text-xl font-bold mb-2">URL Crawler</h2>
      <div className="mb-4">
        <label htmlFor="crawlUrl" className="block mb-1 font-medium">
          Enter a URL to crawl:
        </label>
        <input
          id="crawlUrl"
          type="text"
          className="border rounded px-2 py-1 w-full"
          placeholder="https://example.com"
          value={url}
          onChange={handleUrlChange}
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        onClick={handleCrawl}
      >
        Crawl
      </button>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      {markdown && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Crawl Result:</h3>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {markdown}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CrawlSection;
