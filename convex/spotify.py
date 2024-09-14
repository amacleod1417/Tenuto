import requests
import json
#from textblob import TextBlob
from urllib.parse import urlencode

# Spotify Credentials
SPOTIFY_CLIENT_ID = 'c23f40c6d01e4b03855a68d27434e14b'
SPOTIFY_CLIENT_SECRET = '38234dc4660c445e9f3ed8f0637460d2'
TOP_50_PLAYLIST_ID = '37i9dQZEVXbMDoHDwVN2tF'

# Fetch Spotify Access Token
def get_spotify_access_token():
    url = 'https://accounts.spotify.com/api/token'
    payload = {
        'grant_type': 'client_credentials',
        'client_id': SPOTIFY_CLIENT_ID,
        'client_secret': SPOTIFY_CLIENT_SECRET
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(url, data=urlencode(payload), headers=headers)
    response_data = response.json()

    return response_data['access_token']

# Get User Liked Songs
def get_user_liked_songs(access_token):
    url = 'https://api.spotify.com/v1/me/tracks'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    params = {
        'limit': 50
    }

    response = requests.get(url, headers=headers, params=params)
    
    response_data = response.json()
    print('Response Data:', response_data)  # Debugging output

    # If no liked songs, get Top 50 Global playlist
    if 'items' not in response_data or len(response_data['items']) == 0:
        print("No liked songs found. Fetching top 50 global songs...")
        return get_top_50_global_songs(access_token)

    liked_songs = {
        item['track']['id']: {
            'name': item['track']['name'],
            'artists': ', '.join(artist['name'] for artist in item['track']['artists'])
        }
        for item in response_data['items']
    }

    return liked_songs

#get Top 50 Global Songs if no liked songs available
def get_top_50_global_songs(access_token):
    url = f'https://api.spotify.com/v1/playlists/{TOP_50_PLAYLIST_ID}/tracks'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    params = {
        'limit': 50
    }

    response = requests.get(url, headers=headers, params=params)
    response_data = response.json()


    top_songs = {
        item['track']['id']: {
            'name': item['track']['name'],
            'artists': ', '.join(artist['name'] for artist in item['track']['artists'])
        }
        for item in response_data['items']
    }

    return top_songs

# Get Song Attributes
def get_song_attributes(access_token, track_ids):
    audio_features_url = 'https://api.spotify.com/v1/audio-features'
    tracks_url = 'https://api.spotify.com/v1/tracks'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    audio_features_response = requests.get(audio_features_url, headers=headers, params={'ids': ','.join(track_ids)})
    audio_features_data = audio_features_response.json()

    #get track metadata
    tracks_response = requests.get(tracks_url, headers=headers, params={'ids': ','.join(track_ids)})
    tracks_data = tracks_response.json()

    song_attributes = {}
    for track, audio_features in zip(tracks_data['tracks'], audio_features_data['audio_features']):
 
        song_attributes[track['id']] = {
            'name': track['name'],                       
            'artists': ', '.join(artist['name'] for artist in track['artists']),                                     
            'danceability': audio_features['danceability'],   
            'energy': audio_features['energy'],                   
            'tempo': audio_features['tempo'],                 
            'valence': audio_features['valence']                  
        }

    return song_attributes

# # Analyze Sentiment for Songs using TextBlob
# def analyze_sentiment_for_songs(songs):
#     analyzed_songs = {}
#     for song_id, song_info in songs.items():
#         sentiment_result = TextBlob(song_info['name']).sentiment
#         analyzed_songs[song_id] = {
#             **song_info,
#             'sentimentScore': sentiment_result.polarity  # Using TextBlob polarity for sentiment score
#         }
#     return analyzed_songs

# Combine Sentiment and Song Attributes
def get_songs_with_sentiment_and_attributes(access_token):
    liked_songs = get_user_liked_songs(access_token)
   # print('Liked Songs:', liked_songs)

    track_ids = list(liked_songs.keys())
    #print('Track IDs:', track_ids)

    if not track_ids:
        raise ValueError('No track IDs found')

    song_attributes = get_song_attributes(access_token, track_ids)
   # songs_with_sentiment = analyze_sentiment_for_songs(liked_songs)

    combined_songs = {}
    for track_id in track_ids:
        combined_songs[track_id] = {
           # **songs_with_sentiment[track_id],
            **song_attributes.get(track_id, {})
        }

    return combined_songs

# Main function to run the process
if __name__ == '__main__':
    try:
        access_token = get_spotify_access_token()
        result = get_songs_with_sentiment_and_attributes(access_token)
        
        # Output result to a JSON file
        with open('songs_with_attributes.txt', 'w') as file:
            json.dump(result, file, indent=4)  # Write the JSON data to the file with indentation for readability
        
        print("Result has been written to 'songs_with_sentiment_and_attributes.txt'")
    except Exception as error:
        print('Error fetching songs with sentiment and attributes:', error)