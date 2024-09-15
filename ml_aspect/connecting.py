# app.py
from flask import Flask, jsonify, request
from embeddings import play_songs_based_on_emotional_state
from pinecone import Pinecone
import cohere
import os
from embeddings import process_results_from_api
from utils import generate_query_text

app = Flask(__name__)

# Load API keys from environment
cohere_api_key = os.getenv('COHERE_API_KEY')
pinecone_api_key = os.getenv('PINECONE_API_KEY')

# Initialize Cohere and Pinecone clients
co = cohere.Client(api_key=cohere_api_key)
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index("htn-vector-index")

model_name = "embed-english-light-v3.0"

# Global variable to store the results
global_results = None

# Route to handle input from frontend
@app.route('/process_input', methods=['POST'])
def process_input():
    global global_results 

    try:
        input_text = request.json.get('inputText')
        if not input_text:
            return jsonify({"error": "Input text is required."}), 400
        
        # Generate the query text using Cohere
        query_text = generate_query_text(input_text)
        
        # Generate the query embedding using Cohere
        query_embedding = co.embed(
            texts=[query_text],
            model=model_name,
            input_type="search_query"
        ).embeddings[0]

        # Query Pinecone to get results
        global_results = index.query(
            namespace="songs",
            vector=query_embedding,
            top_k=100,
            include_values=True,
            include_metadata=True
        )

        # Log the complete list of results
        print("Received Results from Pinecone:")
        for match in global_results['matches']:
            print(f"Song: {match['metadata']['name']} with score {match['score']}")

       # Process the results from the API using embeddings.py functionality
        process_results_from_api(global_results)

        return jsonify({"message": "Processed input and started recommendations."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Existing route to handle skips and ends
@app.route('/next_song', methods=['POST'])
def next_song():
    global global_results  # Use the global results variable

    try:
        action = request.json.get('action')  # 'skip' or 'end'
        if not global_results:
            return jsonify({"error": "No results available. Start by providing input first."}), 400

        song_info = play_songs_based_on_emotional_state(global_results, action)
        if song_info:
            return jsonify(song_info), 200
        else:
            return jsonify({"message": "No more songs to play."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
