from langchain_aws import BedrockEmbeddings # type: ignore


def get_embedding_function():
    embeddings = BedrockEmbeddings()
    return embeddings
