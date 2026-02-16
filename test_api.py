import urllib.request
import json
import traceback

URL = "http://localhost:8000/api/v1/predict"

payload = {
  "RevolvingUtilizationOfUnsecuredLines": 0.05,
  "age": 35,
  "NumberOfTime3059DaysPastDueNotWorse": 0,
  "DebtRatio": 0.2,
  "MonthlyIncome": 5000,
  "NumberOfOpenCreditLinesAndLoans": 5,
  "NumberOfTimes90DaysLate": 0,
  "NumberRealEstateLoansOrLines": 1,
  "NumberOfTime6089DaysPastDueNotWorse": 0,
  "NumberOfDependents": 1
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(URL, data=data, headers={'Content-Type': 'application/json'})

try:
    print(f"Sending POST request to {URL}...")
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.status}")
        print("Response Body:")
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error connecting: {e}")
    traceback.print_exc()
