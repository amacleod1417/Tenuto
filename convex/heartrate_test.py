import requests
import json
from datetime import datetime, timedelta
import time
import oauth2 as oauth2
from pprint import pprint

access_token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BMWkIiLCJzdWIiOiI5Rks5U0siLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyaHIiLCJleHAiOjE3MjYzODE0ODMsImlhdCI6MTcyNjM1MjY4M30.37a0K-7SOJK8y62GeCXx0JRLJ8oGH6lnm5_Dce_AdOU'
user_id = '23PLZB'

today = datetime.today().strftime('%Y-%m-%d')
activity_request = requests.get('https://api.fitbit.com/1/user/-/activities/heart/date/{today}/1d/1sec.json')
print(activity_request.status_code)
pprint(activity_request.json())



