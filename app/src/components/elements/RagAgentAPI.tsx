const RagAgentAPI = () => {
  return (
    <iframe
      src="http://127.0.0.1:7860/"
      title="Embedded Website"
      width="100%"
      height="600"
      style={{ border: "none" }}
      sandbox="allow-scripts allow-same-origin allow-forms" // adjust sandboxing as needed
    />
  );
};

export default RagAgentAPI;
