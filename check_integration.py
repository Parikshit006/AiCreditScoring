import requests
import json
import time

URL = "http://localhost:8000/api/v1/apply"

def test_alternative_apply():
    print(f"Testing {URL}...")
    
    # Test Case 1: High potential (should be APPROVED)
    payload_good = {
      "application_id": f"test_{int(time.time()*1000)}",
      "applicant_type": "individual",
      "monthly_income": 8000,
      "transaction_score": 85,
      "utility_payment_score": 90,
      "business_activity_score": 80
    }
    
    try:
        print("\n--- Test Case 1: Good Applicant ---")
        response = requests.post(URL, json=payload_good)
        if response.status_code == 200:
            result = response.json()
            print("Success!")
            print(json.dumps(result, indent=2))
            
            assert result['decision'] == 'APPROVED'
            assert result['risk_level'] == 'LOW'
            print("ASSERTION PASSED: Correctly APPROVED")
        else:
            print(f"FAILED: {response.status_code}")
            print(response.text)

    except Exception as e:
        print(f"Error: {e}")

    # Test Case 2: Low potential (should be REJECTED or MANUAL_REVIEW)
    payload_bad = {
      "application_id": f"test_{int(time.time()*1000)}_bad",
      "applicant_type": "individual",
      "monthly_income": 1500,
      "transaction_score": 30,
      "utility_payment_score": 20,
      "business_activity_score": 10
    }

    try:
        print("\n--- Test Case 2: Risky Applicant ---")
        response = requests.post(URL, json=payload_bad)
        if response.status_code == 200:
            result = response.json()
            print("Success!")
            print(json.dumps(result, indent=2))
            
            assert result['decision'] in ['REJECTED', 'MANUAL_REVIEW']
            print("ASSERTION PASSED: Correctly identified as Risk")
        else:
            print(f"FAILED: {response.status_code}")
            print(response.text)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_alternative_apply()
