import cohere
import json
import pandas as pd
from pprint import pprint
import os 
from dotenv import load_dotenv
from pinecone import Pinecone

# Setting up Cohere (obj) + Pinecone (obj + index)
load_dotenv("HackTheNorthProj/ml_aspect/cohere_api_key.env")
load_dotenv("HackTheNorthProj/ml_aspect/pinecone_api_key.env")

cohere_api_key = os.getenv('COHERE_API_KEY')
pinecone_api_key = os.getenv('PINECONE_API_KEY')

co = cohere.Client(
    api_key=cohere_api_key
)

pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index("htn-vector-index")

# Loading in the modified_spotify_info.json file

with open('HackTheNorthProj/ml_aspect/modified_spotify_info.json', 'r') as f:
    songs_data_py_dict = json.load(f)

# pprint(songs_data_py_dict)

# we've set the index of each row to be recognized by the song_id, and all the other columns are the different categories, so each row has information about that song's song_id + attributes
df = pd.DataFrame.from_dict(songs_data_py_dict, orient='index')

# displays a row of the table, 
print(df.head())

# Now to create the textual input to be embedded, we exclude ones which are not as important, and increase the importance of ones
# which we think are important, by repeating it more than once

def create_embedding_text(row):
    emotions_text = f"Emotions: {', '.join(row['emotions'])}. Emotions: {', '.join(row['emotions'])}. "  # Repeating to emphasize
    valence_text = f"Valence: {row['valence']}."
    name_text = f"Song Name: {row['name']}."
    return emotions_text + valence_text + name_text

# now to use this function for each row in the dataframe, axis -> 1, means going row by row, and adding this new column called
# embedding_text for each of the rows
df['embedding_text'] = df.apply(create_embedding_text, axis=1)

print(df.head())


# Now we actually embed each of these emebdding_text 's that we have generated for each row (i.e song)
model_name = "embed-english-light-v3.0"
input_type_embed = "search_document"

embeds = co.embed(texts=list(df['embedding_text']),
                  model=model_name,
                  input_type=input_type_embed).embeddings


# now we upsert the vector embeddings into pinecone
vectors = [
    {
        "id": str(song_id),  # Use song_id as the unique identifier
        "values": embedding,  # The embedding vector
        "metadata": {"name": df.loc[song_id, 'name']}  # Metadata with the song name
    }
    for song_id, embedding in zip(df.index, embeds)
]

index.upsert(
    vectors=vectors,
    namespace="songs" 
)

print("Embeddings successfully upserted to Pinecone.")

# Taking an example query just to see how good the retrival is currently
query_text = "Emotions: Joy, Hopelessness, Anxiety. Emotions: Joy, Hopelessness, Anxiety"

# embedding the query, so similarity between query can take place with the vector emeddings in the pinecone vector store

query_embedding = co.embed(
    texts=[query_text],
    model=model_name,
    input_type="search_query"  # Specify embeddings for search queries
).embeddings[0]

print(query_embedding)

# querying finally taking place using pinecone

results = index.query(
    namespace="songs",
    vector=query_embedding,
    top_k=5,
    include_values=True,
    include_metadata=True,
)

print(results)
# the obj it returns is in this format
# Returns:
# {'matches': [{'id': 'B',
#               'metadata': {'genre': 'documentary'},
#               'score': 0.0800000429,
#               'values': []}],
#  'namespace': 'example-namespace'}

# Displaying the retrieved results
for match in results['matches']:
    print(f"Matched Song: {match['metadata']['name']} with score {match['score']}")