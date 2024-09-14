"""
Alright this is how it's gonna work, ally is gonna have all the respective labels and list of songs already co-existing from spotify what I want need to do is, ask her to put it in a structured json file 

then we make an cohere api call, and then ask it to get us the meaning of the song, and then we could use 
structed json tool at cohere and then make it generate the emotional labels

and we add this to the already existing json
"""

import cohere
import os 
from dotenv import load_dotenv
import json
from pprint import pprint

load_dotenv("HackTheNorthProj/ml_aspect/cohere_api_key.env")
cohere_api_key = os.getenv('COHERE_API_KEY')

co = cohere.Client(
    api_key=cohere_api_key
)

with open('HackTheNorthProj/ml_aspect/spotify_info.json', 'r') as f:
    songs = json.load(f)


# pprint(songs)

for song_id, song_details in songs.items():
    song_name = song_details.get('name', "Unable to retrieve song name")

    response = co.generate(
        prompt=f"Given the song name '{song_name}', state the overall meaning or message of the song in a brief sentence. Then, list the genres that the song is associated with. No explanation is needed—just a concise statement of the song's meaning and its relevant genres."
    )

    raw_song_json_output = co.chat(
        model="command-r-plus",
        message="Generate a JSON object with the fields 'meaning', 'genres', and 'emotions'. The 'meaning' should be a brief description of the song's message as a string, 'genres' should be an array of strings listing the song's associated genres, and 'emotions' should be an array of strings representing emotions extracted from the song's meaning.",
        response_format={ "type": "json_object" },
    )

    raw_song_text_json_output = raw_song_json_output.text
    cleaned_song_text_json_output = json.loads(raw_song_text_json_output)
    pprint(cleaned_song_text_json_output)
    
    songs[song_id].update(cleaned_song_text_json_output)

with open('HackTheNorthProj/ml_aspect/modified_spotify_info.json', 'w') as f:
    json.dump(songs, f, indent=4)

# pprint(songs)

"""
Potentially add later, the web search part, could give more context, latency could be an issue
"""