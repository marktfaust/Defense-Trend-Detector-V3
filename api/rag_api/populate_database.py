import argparse
import os
import sys
import shutil
import glob
from langchain_community.document_loaders import PyPDFDirectoryLoader, TextLoader  # type: ignore
from langchain_text_splitters import RecursiveCharacterTextSplitter  # type: ignore
from langchain.schema.document import Document  # type: ignore
from langchain_community.vectorstores import Chroma  # type: ignore
from rag_app.get_embedding_function import get_embedding_function
from dotenv import load_dotenv  # type: ignore

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_PATH")
DATA_SOURCE_PATH = os.getenv("DATA_SOURCE_PATH")

def populate_database():
    if "--reset" in sys.argv:
        print("✨ Clearing Database")
        clear_database()
    
    documents = load_documents()
    chunks = split_documents(documents)
    add_to_chroma(chunks)

def reset_database():
    print("✨ Clearing Database")
    clear_database()
    documents = load_documents()
    chunks = split_documents(documents)
    add_to_chroma(chunks)

def load_documents():
    documents = []
    
    # Load PDFs
    pdf_loader = PyPDFDirectoryLoader(DATA_SOURCE_PATH)
    documents.extend(pdf_loader.load())
    
    # Load Markdown files
    md_files = glob.glob(os.path.join(DATA_SOURCE_PATH, "*.md"))
    for md_file in md_files:
        md_loader = TextLoader(md_file, encoding="utf-8")
        documents.extend(md_loader.load())
    
    return documents

def split_documents(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=120,
        length_function=len,
        is_separator_regex=False,
    )
    return text_splitter.split_documents(documents)

def add_to_chroma(chunks: list[Document]):
    if not os.path.exists(CHROMA_PATH):
        print("🆕 Chroma database not found. Creating a new one...")
        os.makedirs(CHROMA_PATH, exist_ok=True)
    
    db = Chroma(
        persist_directory=CHROMA_PATH, embedding_function=get_embedding_function()
    )
    
    chunks_with_ids = calculate_chunk_ids(chunks)
    for chunk in chunks:
        print(f"Chunk Page Sample: {chunk.metadata['id']}\n{chunk.page_content}\n\n")
    
    existing_items = db.get(include=[])  # IDs are always included by default
    existing_ids = set(existing_items["ids"])
    print(f"Number of existing documents in DB: {len(existing_ids)}")
    
    new_chunks = [chunk for chunk in chunks_with_ids if chunk.metadata["id"] not in existing_ids]
    
    if new_chunks:
        print(f"👉 Adding new documents: {len(new_chunks)}")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, ids=new_chunk_ids)
    else:
        print("✅ No new documents to add")

def calculate_chunk_ids(chunks):
    last_page_id = None
    current_chunk_index = 0
    
    for chunk in chunks:
        source = chunk.metadata.get("source", "unknown")
        page = chunk.metadata.get("page", "0")
        current_page_id = f"{source}:{page}"
        
        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0
        
        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id
        chunk.metadata["id"] = chunk_id
    
    return chunks

def clear_database():
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

if __name__ == "__main__":
    populate_database()
