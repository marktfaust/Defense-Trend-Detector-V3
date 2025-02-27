const RagAgentAPI = () => {
  const isProduction = import.meta.env.VITE_PRODUCTION_ENV === "true";
  const src = isProduction
    ? "https://defensetrenddetector.thebarrax.co/api/rag_agent/"
    : "http://127.0.0.1:7860/";

  return (
    <iframe
      src={src}
      title="Embedded Website"
      width="100%"
      height="600"
      style={{ border: "none" }}
      sandbox="allow-scripts allow-same-origin allow-forms" // adjust sandboxing as needed
    />
  );
};

export default RagAgentAPI;
