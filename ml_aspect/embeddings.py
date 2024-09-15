import cohere
import json
import pandas as pd
import os 
from dotenv import load_dotenv
from pinecone import Pinecone
from pathlib import Path
from utils import play_songs_based_on_emotional_state, initialize_emotional_state, find_starting_point


# # Setting up Cohere (obj) + Pinecone (obj + index)
# load_dotenv("HackTheNorthProj/ml_aspect/cohere_api_key.env")
# load_dotenv("HackTheNorthProj/ml_aspect/pinecone_api_key.env")

cohere_api_key = os.getenv('COHERE_API_KEY')
pinecone_api_key = os.getenv('PINECONE_API_KEY')


# Get the absolute path to the directory containing embeddings.py
script_dir = Path(__file__).resolve().parent

# Construct absolute paths to the .env files
cohere_env_path = script_dir / 'cohere_api_key.env'
pinecone_env_path = script_dir / 'pinecone_api_key.env'

# Load the .env files
load_dotenv(dotenv_path=cohere_env_path)
load_dotenv(dotenv_path=pinecone_env_path)

co = cohere.Client(
    api_key=cohere_api_key
)

pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index("htn-vector-index")

# Loading in the modified_spotify_info.json file
json_file_path = script_dir / 'modified_spotify_info.json'

with open(json_file_path, 'r') as f:
    songs_data_py_dict = json.load(f)

# pprint(songs_data_py_dict)

# we've set the index of each row to be recognized by the song_id, and all the other columns are the different categories, so each row has information about that song's song_id + attributes
df = pd.DataFrame.from_dict(songs_data_py_dict, orient='index')

# displays a row of the table, 
# print(df.head())

# Now to create the textual input to be embedded, we exclude ones which are not as important, and increase the importance of ones
# which we think are important, by repeating it more than once

model_name = "embed-english-light-v3.0"

# Check if embeddings already exist in Pinecone
def check_existing_embeddings(index, namespace):
    try:
        # Perform a query to check if data exists in the specified namespace
        existing_count = index.describe_index_stats()["namespaces"].get(namespace, {}).get("vector_count", 0)
        return existing_count > 0
    except Exception as e:
        print(f"Error checking existing embeddings: {e}")
        return False

# Skip embedding generation if embeddings already exist
def generate_and_upsert_embeddings():
    if not check_existing_embeddings(index, "songs"):
        def create_embedding_text(row):
            emotions_text = f"Emotions: {', '.join(row['emotions'])}. Emotions: {', '.join(row['emotions'])}. "  # Repeating to emphasize
            valence_text = f"Valence: {row['valence']}."
            name_text = f"Song Name: {row['name']}."
            return emotions_text + valence_text + name_text

        # now to use this function for each row in the dataframe, axis -> 1, means going row by row, and adding this new column called
        # embedding_text for each of the rows
        df['embedding_text'] = df.apply(create_embedding_text, axis=1)

        # print(df.head())


        # Now we actually embed each of these emebdding_text 's that we have generated for each row (i.e song)
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
    else:
        print("Embeddings already exist in Pinecone. Skipping embedding generation and upsert.")


def process_results_from_api(results):
    if results and 'matches' in results:
        print("Complete List of Retrieved Songs:")
        for match in results['matches']:
            print(f"Song: {match['metadata']['name']} with score {match['score']}")  # Print each song in the list

        song_info = play_songs_based_on_emotional_state(results, 'start')
        print("Song info is", song_info)
        if song_info:
            print(f"Playing Song: {song_info['name']} with score {song_info['score']}")
        else:
            print("No more songs to play.")
    else:
        print("Results are empty or improperly formatted. Ensure the API endpoint is called correctly.")

if __name__ == "__main__":
    generate_and_upsert_embeddings()