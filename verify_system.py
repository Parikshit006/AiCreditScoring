import requests
import json

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

try:
    print(f"Sending POST request to {URL}...")
    response = requests.post(URL, json=payload)
    
    if response.status_code == 200:
        print("Success!")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Failed with status {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"Error connecting: {e}")
