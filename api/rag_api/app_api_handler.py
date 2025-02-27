import os
import uvicorn # type: ignore
import boto3 # type: ignore
import json

import shutil
from fastapi import FastAPI, UploadFile, File # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from mangum import Mangum # type: ignore
from pydantic import BaseModel # type: ignore
from query_model import QueryModel
from rag_app.query_rag import query_rag

from populate_database import populate_database, reset_database
from dotenv import load_dotenv  # type: ignore
from crawl import crawl

from dotenv import load_dotenv # type: ignore
load_dotenv()

WORKER_LAMBDA_NAME = os.environ.get("WORKER_LAMBDA_NAME", None)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace '*' with your frontend URL for security (e.g., ["http://localhost:5173"])
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],  # Allows all headers
)

handler = Mangum(app)  # Entry point for AWS Lambda.


class SubmitQueryRequest(BaseModel):
    query_text: str

class CrawlRequest(BaseModel):
    url: str


# Define the directory to save uploaded files
# UPLOAD_DIR = "data/source"
UPLOAD_DIR = os.getenv("DATA_SOURCE_PATH")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    # Optional: validate file type if needed, e.g.:
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files are allowed."}
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    populate_database()

    return {"info": f"File '{file.filename}' saved at '{file_path}'"}


@app.get("/")
def index():
    return {"Hello": "World"}


@app.get("/get_query")
def get_query_endpoint(query_id: str) -> QueryModel:
    query = QueryModel.get_item(query_id)
    return query


@app.post("/populate_database")
def populate_database_endpoint():
    # Create the query item, and put it into the data-base.
    response = populate_database()
    return response


@app.post("/reset_database")
def reset_database_endpoint():
    # Create the query item, and put it into the data-base.
    response = reset_database()
    return response


@app.post("/submit_query")
def submit_query_endpoint(request: SubmitQueryRequest) -> QueryModel:
    # Create the query item, and put it into the data-base.
    new_query = QueryModel(query_text=request.query_text)

    if WORKER_LAMBDA_NAME:
        # Make an async call to the worker (the RAG/AI app).
        new_query.put_item()
        invoke_worker(new_query)
    else:
        # Make a synchronous call to the worker (the RAG/AI app).
        query_response = query_rag(request.query_text)
        new_query.answer_text = query_response.response_text
        new_query.sources = query_response.sources
        new_query.is_complete = True
        new_query.put_item()

    return new_query


def invoke_worker(query: QueryModel):
    # Initialize the Lambda client
    lambda_client = boto3.client("lambda")

    # Get the QueryModel as a dictionary.
    payload = query.model_dump()

    # Invoke another Lambda function asynchronously
    response = lambda_client.invoke(
        FunctionName=WORKER_LAMBDA_NAME,
        InvocationType="Event",
        Payload=json.dumps(payload),
    )

    print(f"✅ Worker Lambda invoked: {response}")


@app.post("/crawl")
async def crawl_endpoint(request: CrawlRequest):
    # Use request.url to crawl
    print(request.url)
    markdown_content = await crawl(request.url)
    return {"markdown": markdown_content}


if __name__ == "__main__":
    # Run this as a server directly.
    port = 8000
    print(f"Running the FastAPI server on port {port}.")
    uvicorn.run("app_api_handler:app", host="0.0.0.0", port=port)
