import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE

# Configuration
DATA_PATH = r"c:/Users/parik/OneDrive/Desktop/barclays/ml/credit.xls"
MODEL_PATH = r"c:/Users/parik/OneDrive/Desktop/barclays/backend/app/model/model.pkl"

# Load Data
print(f"Loading data from {DATA_PATH}...")
try:
    df = pd.read_csv(DATA_PATH)
except Exception as e:
    print(f"Error loading CSV: {e}")
    # Try with different encoding or delimiter if needed, but assuming standard CSV based on inspection
    exit(1)

# Basic Preprocessing
print("Preprocessing data...")
# Drop Unnamed column if exists
if 'Unnamed: 0' in df.columns:
    df = df.drop(columns=['Unnamed: 0'])

# Handle Missing Values
# Fill MonthlyIncome with median
df['MonthlyIncome'] = df['MonthlyIncome'].fillna(df['MonthlyIncome'].median())
# Fill NumberOfDependents with mode (0)
df['NumberOfDependents'] = df['NumberOfDependents'].fillna(0)

# Feature Selection
target = 'SeriousDlqin2yrs'
features = [
    'RevolvingUtilizationOfUnsecuredLines',
    'age',
    'NumberOfTime30-59DaysPastDueNotWorse',
    'DebtRatio',
    'MonthlyIncome',
    'NumberOfOpenCreditLinesAndLoans',
    'NumberOfTimes90DaysLate',
    'NumberRealEstateLoansOrLines',
    'NumberOfTime60-89DaysPastDueNotWorse',
    'NumberOfDependents'
]

X = df[features]
y = df[target]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Handle Imbalance with SMOTE
print("Applying SMOTE...")
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# Train XGBoost Model
print("Training XGBoost model...")
model = xgb.XGBClassifier(
    objective='binary:logistic',
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    random_state=42,
    eval_metric='auc',
    early_stopping_rounds=10
)

model.fit(
    X_train_resampled, 
    y_train_resampled, 
    eval_set=[(X_test, y_test)], 
    verbose=True
)

# Save Model
print(f"Saving model to {MODEL_PATH}...")
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
joblib.dump(model, MODEL_PATH)

print("Model training complete!")
