import joblib
import xgboost as xgb
import shap
import pandas as pd
import numpy as np
import os

MODEL_PATH = r"c:/Users/parik/OneDrive/Desktop/barclays/backend/app/model/model.pkl"

class CreditModel:
    def __init__(self):
        self.model = None
        self.explainer = None
        self.load_model()

    def load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                print(f"Model loaded from {MODEL_PATH}")
                # Initialize SHAP explainer
                # For TreeExplainer with XGBoost, we might need the booster or the model itself
                # If model is sklearn wrapper, use model.get_booster() or just model
                self.explainer = shap.TreeExplainer(self.model)
            except Exception as e:
                print(f"Error loading model: {e}")
        else:
            print(f"Model not found at {MODEL_PATH}. Prediction endpoints will fail until model is trained.")

    def predict(self, features: pd.DataFrame):
        if not self.model:
            self.load_model()
            if not self.model:
                raise Exception("Model not loaded")
        
        # Ensure features are in correct order (same as training)
        # We might need to enforce column order here based on training time
        # For now, assuming input DF has correct columns
        
        prob = self.model.predict_proba(features)[:, 1]
        return prob

    def explain(self, features: pd.DataFrame):
        if not self.explainer:
            if not self.model:
                self.load_model()
            if self.model:
                self.explainer = shap.TreeExplainer(self.model)
        
        if not self.explainer:
            raise Exception("Explainer not initialized")

        shap_values = self.explainer.shap_values(features)
        return shap_values

credit_model = CreditModel()
