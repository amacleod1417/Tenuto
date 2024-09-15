import requests
import json
import base64
from urllib.parse import urlencode, urlparse, parse_qs
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer
import os
from dotenv import load_dotenv

load_dotenv('HackTheNorthProj/backend-py/spotify_api_key.env')

# Spotify Credentials
spotify_client_id = os.getenv('SPOTIFY_CLIENT_ID')
spotify_client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
REDIRECT_URI = 'http://localhost:8888/callback'
TOP_50_PLAYLIST_ID = '37i9dQZEVXbMDoHDwVN2tF'
SCOPE = 'user-library-read'

# Spotify Authorization URLs
AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'

# Step 1: Start a local server to capture the authorization code
class SpotifyAuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'You can close this window now.')
        query = urlparse(self.path).query
        params = parse_qs(query)
        self.server.auth_code = params.get('code')[0]

def get_spotify_auth_code():
    params = {
        'client_id': spotify_client_id,
        'response_type': 'code',
        'redirect_uri': REDIRECT_URI,
        'scope': SCOPE
    }
    auth_url = f'{AUTH_URL}?{urlencode(params)}'
    webbrowser.open(auth_url)
    
    server = HTTPServer(('localhost', 8888), SpotifyAuthHandler)
    server.handle_request()
    
    return server.auth_code

#exchange authorization code for access token
def get_access_token(auth_code):
    auth_header = base64.b64encode(f"{spotify_client_id}:{spotify_client_secret}".encode()).decode()
    
    payload = {
        'grant_type': 'authorization_code',
        'code': auth_code,
        'redirect_uri': REDIRECT_URI
    }
    
    headers = {
        'Authorization': f'Basic {auth_header}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    response = requests.post(TOKEN_URL, data=urlencode(payload), headers=headers)
    response_data = response.json()
    
    return response_data['access_token'], response_data['refresh_token']

#get User's Liked Songs
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

#get top 50 if no liked songs are available
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

#get attributes
def get_song_attributes(access_token, track_ids):
    audio_features_url = 'https://api.spotify.com/v1/audio-features'
    tracks_url = 'https://api.spotify.com/v1/tracks'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    audio_features_response = requests.get(audio_features_url, headers=headers, params={'ids': ','.join(track_ids)})
    audio_features_data = audio_features_response.json()

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

def get_songs_with_sentiment_and_attributes(access_token):
    liked_songs = get_user_liked_songs(access_token)

    track_ids = list(liked_songs.keys())
    if not track_ids:
        raise ValueError('No track IDs found')

    song_attributes = get_song_attributes(access_token, track_ids)

    combined_songs = {}
    for track_id in track_ids:
        combined_songs[track_id] = {
            **liked_songs[track_id],
            **song_attributes.get(track_id, {})
        }

    return combined_songs

if __name__ == '__main__':
    try:
        auth_code = get_spotify_auth_code()

        access_token, refresh_token = get_access_token(auth_code)

        result = get_songs_with_sentiment_and_attributes(access_token)

        with open('songs_with_attributes.txt', 'w') as file:
            json.dump(result, file, indent=4)
        
        print("Result has been written to 'songs_with_attributes.txt'")
    except Exception as error:
        print('Error fetching songs with sentiment and attributes:', error)
