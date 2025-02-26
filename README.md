# Defense-Trend-Detector-V3

# FOR API/RAG_APP:

# Deploy RAG/AI App To AWS

## Getting Started

### Configure AWS

You need to have an AWS account, and AWS CLI set up on your machine. You'll also need to have Bedrock enabled on AWS (and granted model access to Claude or whatever you want to use).

### Update .env File with AWS Credentials

Create a file named `.env` in `image/`. Do NOT commit the file to `.git`. The file should have content like this:

```
AWS_ACCESS_KEY_ID=XXXXX
AWS_SECRET_ACCESS_KEY=XXXXX
AWS_DEFAULT_REGION=us-east-1
TABLE_NAME=YourTableName
```

This will be used by Docker for when we want to test the image locally. The AWS keys are just your normal AWS credentials and region you want to run this in (even when running locally you will still need access to Bedrock LLM and to the DynamoDB table to write/read the data).

You'll also need a TABLE_NAME for the DynamoDB table for this to work (so you'll have to create that first).

### Installing Requirements

```sh
pip install -r image/requirements.txt
```

### Building the Vector DB

Put all the PDF source files you want into `image/src/data/source/`. Then go `image` and run:

```sh
# Use "--reset" if you want to overwrite an existing DB.
python populate_database.py --reset
```

### Running the App

```sh
# Execute from image/src directory
cd image/src
python rag_app/query_rag.py "how much does a landing page cost?"
```

Example output:

```text
Answer the question based on the above context: How much does a landing page cost to develop?

Response:  Based on the context provided, the cost for a landing page service offered by Galaxy Design Agency is $4,820. Specifically, under the "Our Services" section, it states "Landing Page for Small Businesses ($4,820)" when describing the landing page service. So the cost listed for a landing page is $4,820.
Sources: ['src/data/source/galaxy-design-client-guide.pdf:1:0', 'src/data/source/galaxy-design-client-guide.pdf:7:0', 'src/data/source/galaxy-design-client-guide.pdf:7:1']
```

### Starting FastAPI Server

```sh
# From image/src directory.
python app_api_handler.py
```

Then go to `http://0.0.0.0:8000/docs` to try it out.

## Using Docker Image

### Build and Test the Image Locally

These commands can be run from `image/` directory to build, test, and serve the app locally.

```sh
docker build --platform linux/amd64 -t aws_rag_app .
```

This will build the image (using linux amd64 as the platform — we need this for `pysqlite3` for Chroma).

```sh
# Run the container using command `python app_work_handler.main`
docker run --rm -it \
    --entrypoint python \
    --env-file .env \
    aws_rag_app app_work_handler.py
```

This will test the image, seeing if it can run the RAG/AI component with a hard-coded question (see ` app_work_handler.py`). But since it uses Bedrock as the embeddings and LLM platform, you will need an AWS account and have all the environment variables for your access set (`AWS_ACCESS_KEY_ID`, etc).

You will also need to have Bedrock's models enabled and granted for the region you are running this in.

## Running Locally as a Server

Assuming you've build the image from the previous step.

```sh
docker run --rm -p 8000:8000 \
    --entrypoint python \
    --env-file .env \
    aws_rag_app app_api_handler.py
```

## Testing Locally

After running the Docker container on localhost, you can access an interactive API page locally to test it: `http://0.0.0.0:8000/docs`.

```sh
curl -X 'POST' \
  'http://0.0.0.0:8000/submit_query' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "query_text": "How much does a landing page for a small business cost?"
}'
```

## Deploy to AWS

I have put all the AWS CDK files into `rag-cdk-infra/`. Go into the folder and install the Node dependencies.

```sh
npm install
```

Then run this command to deploy it (assuming you have AWS CLI already set up, and AWS CDK already bootstrapped). I recommend deploying to `us-east-1` to start with (since all the AI models are there).

```sh
cdk deploy
```

## Run Vite app on localhost

From within the `app` directory, run: 

```sh
npm run dev
```

## Run FastAPI server

From within the `image/src/` directory, run:

```sh
uvicorn app_api_handler:app --reload
```

# FOR API/RAG_AGENT_API

# R1 Distill RAG System

This project showcases the power of DeepSeek's R1 model in an agentic RAG (Retrieval-Augmented Generation) system - built using Smolagents from HuggingFace. R1, known for its exceptional reasoning capabilities and instruction-following abilities, serves as the core reasoning engine. The system combines R1's strengths with efficient document retrieval and a separate conversation model to create a powerful, context-aware question-answering system.

## Setup

1. Clone the repository

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix/MacOS
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables by copying `.env.example` to `.env`:
```bash
cp .env.example .env
```

5. Configure your `.env` file:

### Using HuggingFace (Cloud API)
```env
USE_HUGGINGFACE=yes
HUGGINGFACE_API_TOKEN=your_token_here
REASONING_MODEL_ID=deepseek-ai/DeepSeek-R1-Distill-Qwen-32B
TOOL_MODEL_ID=meta-llama/Llama-3.3-70B-Instruct
```

### Using Ollama (Local Inference)
```env
USE_HUGGINGFACE=no
HUGGINGFACE_API_TOKEN=
REASONING_MODEL_ID=deepseek-r1:7b-8k
TOOL_MODEL_ID=qwen2.5:14b-instruct-8k
```

## Setting Up Ollama Models

The following models are recommended examples that provide a good balance of performance and resource usage, but you can use any compatible Ollama models:

1. First, install Ollama from [ollama.ai](https://ollama.ai)

2. Pull the base models:
```bash
ollama pull deepseek-r1:7b
ollama pull qwen2.5:14b-instruct-q4_K_M
```

3. Create custom models with extended context windows:
```bash
# Create Deepseek model with 8k context - recommended for reasoning
ollama create deepseek-r1:7b-8k -f ollama_models/Deepseek-r1-7b-8k

# Create Qwen model with 8k context - recommended for conversation
ollama create qwen2.5:14b-instruct-8k -f ollama_models/Qwen-14b-Instruct-8k

# On MacOS you might need to use -from instead of -f

# Create Deepseek model with 8k context - recommended for reasoning
ollama create deepseek-r1:7b-8k -from ollama_models/Deepseek-r1-7b-8k

# Create Qwen model with 8k context - recommended for conversation
ollama create qwen2.5:14b-instruct-8k -from ollama_models/Qwen-14b-Instruct-8k
```

Feel free to experiment with other models or context window sizes by modifying the model files in the `ollama_models` directory.

## Usage

1. Place your PDF documents in the `data` directory:
```bash
mkdir data
# Copy your PDFs into the data directory
```

2. Ingest the PDFs to create the vector database:
```bash
python ingest_pdfs.py
```

3. Run the RAG application:
```bash
python r1_smolagent_rag.py
```

This will launch a Gradio web interface where you can ask questions about your documents.

## How It Works

1. **Document Ingestion** (`ingest_pdfs.py`):
   - Loads PDFs from the `data` directory
   - Splits documents into chunks of 1000 characters with 200 character overlap
   - Creates embeddings using `sentence-transformers/all-mpnet-base-v2`
   - Stores vectors in a Chroma database

2. **RAG System** (`r1_smolagent_rag.py`):
   - Uses two LLMs: one for reasoning and one for tool calling
   - Retrieves relevant document chunks based on user queries
   - Generates responses using the retrieved context
   - Provides a Gradio web interface for interaction

## Model Selection

### HuggingFace Models
- Recommended for cloud-based inference
- Requires API token for better rate limits
- Supports a wide range of models
- Better for production use with stable API

### Ollama Models
- Recommended for local inference
- No API token required
- Runs entirely on your machine
- Better for development and testing
- Supports custom model configurations
- Lower latency but requires more system resources

## Notes
- The vector store is persisted in the `chroma_db` directory
- Default chunk size is 1000 characters with 200 character overlap
- Embeddings are generated using the `all-mpnet-base-v2` model
- The system uses a maximum of 3 relevant chunks for context