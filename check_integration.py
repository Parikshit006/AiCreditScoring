import urllib.request
import json
import sys

# Define the API Endpoint
URL = "http://localhost:8000/api/v1/predict"

# Sample Applicant Data (Low Risk Profile)
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

print(f"Testing Integration with Backend at: {URL}")
print("-" * 50)

try:
    # Prepare the request
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(URL, data=data, headers={'Content-Type': 'application/json'})

    # Send request
    with urllib.request.urlopen(req) as response:
        status = response.status
        body = response.read().decode('utf-8')
        result = json.loads(body)

    if status == 200:
        print("✅ SUCCESS: Backend is reachable.")
        print("✅ SUCCESS: Model returned a prediction.")
        print("-" * 50)
        print("Model Output:")
        print(f"  Decision: {result['decision']}")
        print(f"  Probability: {result['default_probability']:.2%}")
        print(f"  Risk Category: {result['risk_category']}")
        print(f"  Explanation: {result['explanation_text']}")
        print("-" * 50)
        print("The AI Model and Backend are working correctly!")
    else:
        print(f"❌ FAIL: HTTP Status {status}")
        print(body)

except Exception as e:
    print(f"❌ CONNECTION ERROR: Could not connect to backend.")
    print(f"Details: {e}")
    print("\nPlease make sure the backend is running in Terminal 1 with: 'uvicorn app.main:app --reload --port 8000'")
