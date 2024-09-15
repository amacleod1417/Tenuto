# app.py
from flask import Flask, jsonify, request
from embeddings import play_songs_based_on_emotional_state, results

app = Flask(__name__)

# Route to handle input from frontend
@app.route('/process_input', methods=['POST'])
def process_input():
    try:
        input_text = request.json.get('inputText')
        if not input_text:
            return jsonify({"error": "Input text is required."}), 400

        # Call the function with the input text
        song_info = play_songs_based_on_emotional_state(results, 'start', input_text)
        if song_info:
            return jsonify(song_info), 200
        else:
            return jsonify({"message": "No songs available based on input."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Existing route to handle skips and ends
@app.route('/next_song', methods=['POST'])
def next_song():
    try:
        action = request.json.get('action')  # 'skip' or 'end'
        song_info = play_songs_based_on_emotional_state(results, action)
        if song_info:
            return jsonify(song_info), 200
        else:
            return jsonify({"message": "No more songs to play."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
