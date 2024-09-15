query_embedding = co.embed(
    texts=[query_text],
    model=model_name,
    input_type="search_query"  # Specify embeddings for search queries
).embeddings[0]