import requests
from datetime import datetime

# Hardcoded access token for your specific Fitbit account
ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BMWkIiLCJzdWIiOiI5Rks5U0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyaHIiLCJleHAiOjE3MjYzODE0ODMsImlhdCI6MTcyNjM1MjY4M30.37a0K-7SOJK8y62GeCXx0JRLJ8oGH6lnm5_Dce_AdOU'  # Replace with your valid access token

def fitbit_oauth2_authenticate():
    return ACCESS_TOKEN

def get_heart_rate_data():
    headers = {
        'Authorization': f'Bearer {ACCESS_TOKEN}'
    }

    today = datetime.today().strftime('%Y-%m-%d')
    url = f'https://api.fitbit.com/1/user/-/activities/heart/date/{today}/1d/1sec.json'

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get heart rate data: {response.content}")
        return None

def calculate_hrv(heart_rate_data):
    heart_rates = [entry['value'] for entry in heart_rate_data['activities-heart-intraday']['dataset']]

    # Calculate successive differences between heart rate values
    diffs = [abs(heart_rates[i] - heart_rates[i-1]) for i in range(1, len(heart_rates))]
    
    hrv = sum(diffs) / len(diffs) if diffs else 0  # Mean of HRV
    return hrv

# Classify emotional state based on HRV
def classify_emotional_state(hrv):
    if hrv < 10:
        return "Stressed or Anxious"
    elif 10 <= hrv < 20:
        return "Calm"
    else:
        return "Excited or Active"

# Main flow
if __name__ == '__main__':
    try:
        # Fetch heart rate data using the hardcoded access token
        heart_rate_data = get_heart_rate_data()

        if heart_rate_data:
            # Calculate HRV from heart rate data
            hrv = calculate_hrv(heart_rate_data)
            print(hrv)

            # Classify emotional state based on HRV
            emotional_state = classify_emotional_state(hrv)
            print(f"Your estimated emotional state is: {emotional_state}")
        else:
            print("No heart rate data available.")

    except Exception as error:
        print(f"Error occurred: {error}")
