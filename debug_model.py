import joblib
import pandas as pd
import os
import traceback
import sys

MODEL_PATH = r"c:/Users/parik/OneDrive/Desktop/barclays/backend/app/model/model.pkl"

print(f"Python executable: {sys.executable}")
print(f"Checking model at: {MODEL_PATH}")

if not os.path.exists(MODEL_PATH):
    print("Model file does not exist!")
    exit(1)

try:
    print("Attempting to load model with joblib...")
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully!")
    print(f"Model type: {type(model)}")
except Exception as e:
    print(f"Failed to load model: {e}")
    traceback.print_exc()
    exit(1)

try:
    import shap
    print(f"SHAP version: {shap.__version__}")
    print("Initializing SHAP explainer...")
    explainer = shap.TreeExplainer(model)
    print("Explainer initialized!")
except Exception as e:
    print(f"Failed to initialize SHAP: {e}")
    traceback.print_exc()

# Test Prediction
try:
    print("Testing prediction...")
    data = {
      "RevolvingUtilizationOfUnsecuredLines": [0.05],
      "age": [35],
      "NumberOfTime30-59DaysPastDueNotWorse": [0],
      "DebtRatio": [0.2],
      "MonthlyIncome": [5000.0],
      "NumberOfOpenCreditLinesAndLoans": [5],
      "NumberOfTimes90DaysLate": [0],
      "NumberRealEstateLoansOrLines": [1],
      "NumberOfTime60-89DaysPastDueNotWorse": [0],
      "NumberOfDependents": [1]
    }
    df = pd.DataFrame(data)
    
    # Check if model supports predict_proba
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(df)[:, 1]
        print(f"Prediction (proba): {prob}")
    else:
        pred = model.predict(df)
        print(f"Prediction (class): {pred}")

    # Test SHAP
    if 'explainer' in locals():
        print("Testing SHAP values...")
        shap_values = explainer.shap_values(df)
        print("SHAP values generated.")

except Exception as e:
    print(f"Prediction failed: {e}")
    traceback.print_exc()
