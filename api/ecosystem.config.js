module.exports = {
  apps: [
    {
      name: "ollama",
      script: "ollama",
      args: "serve",
      autorestart: true,
    },
    {
      name: "rag-agent-api",
      script:
        "/var/www/Defense-Trend-Detector-V3/api/rag_agent_api/r1_smolagent_rag.py",
      interpreter: "/var/www/Defense-Trend-Detector-V3/api/venv/bin/python3.13",
      cwd: "/var/www/Defense-Trend-Detector-V3/api/rag_agent_api/",
      watch: false,
      autorestart: true,
    },
    {
      name: "rag-api",
      script: "/var/www/Defense-Trend-Detector-V3/api/venv/bin/uvicorn",
      args: "app_api_handler:app --reload",
      cwd: "/var/www/Defense-Trend-Detector-V3/api/rag_api/",
      interpreter: "none",
      watch: false,
      autorestart: true,
    },
  ],
};
