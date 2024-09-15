# utils.py
import cohere
import os
from heartrate_test import classify_emotional_state, get_heart_rate_data, calculate_hrv
from pathlib import Path
from dotenv import load_dotenv


# Load API keys from environment
cohere_api_key = os.getenv("COHERE_API_KEY")

# Get the absolute path to the directory containing embeddings.py
script_dir = Path(__file__).resolve().parent

# Construct absolute paths to the .env files
cohere_env_path = script_dir / "cohere_api_key.env"

load_dotenv(dotenv_path=cohere_env_path)

# Initialize Cohere client
co = cohere.Client(api_key=cohere_api_key)
model_name = "embed-english-light-v3.0"

# Global state variables for tracking song playback
current_index = 0
played_indices = set()


# Function to generate formatted query text using Cohere's generate
def generate_query_text(input_text):
    response = co.generate(
        prompt=f"Generate a query in the format 'Emotions: emotion1, emotion2, emotion3. Emotions: emotion1, emotion2, emotion3' based on the following input:\n\n{input_text}",
    )
    # Extract the generated text
    generated_text = response.generations[0].text.strip()
    print(f"Generated Query Text: {generated_text}")
    return generated_text


# Function to initialize emotional state
def initialize_emotional_state():
    heart_rate_data = get_heart_rate_data()
    if heart_rate_data:
        hrv = calculate_hrv(heart_rate_data)
        emotional_state = classify_emotional_state(hrv)
        print(f"Initial estimated emotional state is: {emotional_state}")
        return emotional_state
    else:
        print("No heart rate data available. Cannot initialize emotional state.")
        return None


def find_starting_point(global_results, emotional_state):
    if not global_results:
        raise Exception
    mid_index = len(global_results) // 2  # Assume calm songs are around the midpoint
    if emotional_state == "Stressed or Anxious":
        start_index = (
            mid_index  # Start in the middle to avoid sad/stressful songs at the start
        )
    else:  # If already positive or happy, start from the top
        start_index = 0
    return start_index


# Main function to play songs based on emotional state and action
def play_songs_based_on_emotional_state(results, action, input_text=None):
    global current_index, played_indices

    print(
        f"Action: {action}, Current Index: {current_index}, Played Indices: {played_indices}"
    )

    if action == "start":  # Initial call to start the playlist
        initial_emotional_state = initialize_emotional_state()
        print(f"Initial estimated emotional state is: {initial_emotional_state}")
        if not initial_emotional_state:
            print("Emotional state not determined, exiting.")
            return None
        current_index = find_starting_point(results["matches"], initial_emotional_state)
        print(f"Starting index based on emotional state: {current_index}")

    if 0 <= current_index < len(results["matches"]):
        # Skip played songs
        while (
            current_index in played_indices
            and current_index < len(results["matches"]) - 1
        ):
            print(f"Skipping already played index: {current_index}")
            current_index += 1

        # Check if the index is valid after skipping
        if current_index >= len(results["matches"]):
            print(
                f"No more songs available after skipping, current index: {current_index}"
            )
            return None

        # Mark the song as played
        played_indices.add(current_index)
        print(f"Marked index {current_index} as played.")

        current_song = results["matches"][current_index]

        current_song_info = {
            "name": current_song["metadata"]["name"],
            "score": current_song["score"],
        }

        # Re-evaluate emotional state after each song
        heart_rate_data = get_heart_rate_data()
        if heart_rate_data:
            hrv = calculate_hrv(heart_rate_data)
            current_emotional_state = classify_emotional_state(hrv)
            print(f"Updated emotional state is: {current_emotional_state}")

            # Adjust index based on current emotional state
            if current_emotional_state == "Stressed or Anxious":
                if current_index > len(results["matches"]) // 2:
                    current_index = len(results["matches"]) // 2
                else:
                    current_index = min(current_index + 1, len(results["matches"]) - 1)

            elif current_emotional_state == "Calm":
                current_index += 1

            elif current_emotional_state == "Excited or Active":
                current_index += 5

            else:
                current_index += 1

        # Ensure index stays within bounds
        current_index = min(current_index, len(results["matches"]) - 1)

        print(
            f"Playing Song: {current_song_info['name']} with score {current_song_info['score']}"
        )
        return current_song_info

    print("No song recommendation found or all songs are played.")
    return None  # symbolizes the playlist getting over
