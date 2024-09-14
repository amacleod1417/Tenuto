import requests
import json
from datetime import datetime, timedelta
import time
import oauth2 as oauth2
from pprint import pprint

#api credentials
CLIENT_ID = '23PLZB'
CLIENT_SECRET = 'e7be18eaf7e9bc0d1919cbf2426b1ad1'
REDIRECT_URI = 'https://your-app.convex.cloud/api/auth/callback'  
AUTHORIZATION_URL = 'https://www.fitbit.com/oauth2/authorize'
TOKEN_URL = 'https://api.fitbit.com/oauth2/token'
CODE = '84018f3e258be03a0f132b0eb947d45c47bf7667'
STATE = '2u560r3f092l656m4e1j3g5n391y3s0j'

#aauthorization
def fitbit_oauth2_authenticate():
    auth_params = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'scope': 'heartrate',  
        'redirect_uri': REDIRECT_URI
    }

    auth_url = requests.Request('GET', AUTHORIZATION_URL, params=auth_params).prepare().url
    print(f"Go to this URL and authorize: {auth_url}")

    authorization_code = input("Enter the authorization code from the redirect URL: ")
    
    #exchange code for token
    token_data = {
        'client_id': CLIENT_ID,
        'grant_type': 'authorization_code',
        'code': authorization_code,
        'redirect_uri': REDIRECT_URI,
        'client_secret': CLIENT_SECRET
    }
    
    response = requests.post(TOKEN_URL, data=token_data)
    response_data = response.json()
    
    access_token = response_data.get('access_token')
    refresh_token = response_data.get('refresh_token')
    
    return access_token, refresh_token

# get data
def get_heart_rate_data(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    today = datetime.today().strftime('%Y-%m-%d')
    url = f'https://api.fitbit.com/1/user/-/activities/heart/date/{today}/1d/1sec.json'

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to get heart rate data:", response.content)
        return None

#calculate hrv
def calculate_hrv(heart_rate_data):
  
    heart_rates = [entry['value']['bpm'] for entry in heart_rate_data['activities-heart-intraday']['dataset']]
    
    #calculate successive differences
    diffs = [abs(heart_rates[i] - heart_rates[i-1]) for i in range(1, len(heart_rates))]
    
    hrv = sum(diffs) / len(diffs) if diffs else 0  #mean of hrv
    return hrv

#classify emotional state
def classify_emotional_state(hrv):
   
    if hrv < 10:
        return "Stressed or Anxious"
    elif 10 <= hrv < 20:
        return "Calm"
    else:
        return "Excited or Active"

# Main flow
if __name__ == '__main__':
    access_token, _ = fitbit_oauth2_authenticate()
    heart_rate_data = get_heart_rate_data(access_token)

    if heart_rate_data:
        hrv = calculate_hrv(heart_rate_data)
        emotional_state = classify_emotional_state(hrv)
        print(f"Your estimated emotional state is: {emotional_state}")
