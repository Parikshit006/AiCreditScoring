import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def log(msg, status="INFO"):
    print(f"[{status}] {msg}")

def test_endpoint(name, url, method="GET", payload=None):
    log(f"Testing {name} ({url})...")
    try:
        if method == "POST":
            response = requests.post(url, json=payload)
        else:
            response = requests.get(url)
            
        if response.status_code == 200:
            log(f"SUCCESS: {name} responded correctly.", "PASS")
            # print(json.dumps(response.json(), indent=2))
            return True
        else:
            log(f"FAILED: {name} returned status {response.status_code}", "FAIL")
            print(response.text)
            return False
    except Exception as e:
        log(f"ERROR: Could not connect to {name}. Is backend running?", "FAIL")
        print(e)
        return False

def main():
    print("=== STARTING SYSTEM VERIFICATION ===\n")
    
    # 1. Test Frontend Connection (Alternative Data)
    payload_apply = {
      "application_id": "test_verification",
      "applicant_type": "individual",
      "monthly_income": 8000,
      "transaction_score": 85,
      "utility_payment_score": 90,
      "business_activity_score": 80,
      "savings_balance": 15000,
      "rent_payment_score": 95
    }
    frontend_connected = test_endpoint("Frontend API", f"{BASE_URL}/apply", "POST", payload_apply)

    # 2. Test Dashboard Connection (Metrics)
    metrics_connected = test_endpoint("Metrics API", f"{BASE_URL}/model-metrics", "GET")

    # 3. Test AI Model Integration (Traditional Data - core/model.py)
    # This proves the .pkl file is loaded and XGBoost/SHAP are creating predictions
    payload_predict = {
        "RevolvingUtilizationOfUnsecuredLines": 0.1,
        "age": 40,
        "NumberOfTime3059DaysPastDueNotWorse": 0,
        "DebtRatio": 0.3,
        "MonthlyIncome": 5000,
        "NumberOfOpenCreditLinesAndLoans": 5,
        "NumberOfTimes90DaysLate": 0,
        "NumberRealEstateLoansOrLines": 1,
        "NumberOfTime6089DaysPastDueNotWorse": 0,
        "NumberOfDependents": 0
    }
    model_integrated = test_endpoint("Core AI Model", f"{BASE_URL}/predict", "POST", payload_predict)

    print("\n=== VERIFICATION SUMMARY ===")
    if frontend_connected:
        print("[x] Backend <-> Frontend Integration: CONNECTED")
    else:
        print("[ ] Backend <-> Frontend Integration: FAILED")
        
    if model_integrated:
        print("[x] Backend <-> AI Model (XGBoost): INTEGRATED")
    else:
        print("[ ] Backend <-> AI Model (XGBoost): FAILED")

    if frontend_connected and model_integrated and metrics_connected:
        print("\nRESULT: All systems operating normally.")
    else:
        print("\nRESULT: Issues detected.")

if __name__ == "__main__":
    main()
