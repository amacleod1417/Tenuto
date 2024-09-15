import requests
from datetime import datetime

# Hardcoded access token for your specific Fitbit account
ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BMWkIiLCJzdWIiOiI5Rks5U0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyaHIiLCJleHAiOjE3MjYzODE0ODMsImlhdCI6MTcyNjM1MjY4M30.37a0K-7SOJK8y62GeCXx0JRLJ8oGH6lnm5_Dce_AdOU'  # Replace with your valid access token

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
    heart_rates = []
    for entry in heart_rate_data['activities-heart-intraday']['dataset']:
        heart_rates.append(entry['value'])

    
    #calculate successive differences
    diffs = [abs(heart_rates[i] - heart_rates[i-1]) for i in range(1, len(heart_rates))]
    
    hrv = sum(diffs) / len(diffs) if diffs else 0  #mean of hrv
    return hrv

# Example usage:
heart_rate_data = get_heart_rate_data()
if heart_rate_data:
    print("Heart Rate Data:", heart_rate_data)
hrv = calculate_hrv(heart_rate_data)
if hrv: 
    print("hrv:", hrv)
