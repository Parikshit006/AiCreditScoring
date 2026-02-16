from pydantic import BaseModel
import pandas as pd
import traceback

class CreditApplication(BaseModel):
    RevolvingUtilizationOfUnsecuredLines: float
    age: int
    NumberOfTime3059DaysPastDueNotWorse: int
    DebtRatio: float
    MonthlyIncome: float
    NumberOfOpenCreditLinesAndLoans: int
    NumberOfTimes90DaysLate: int
    NumberRealEstateLoansOrLines: int
    NumberOfTime6089DaysPastDueNotWorse: int
    NumberOfDependents: int

    def to_df(self):
        data = self.dict()
        feature_map = {
            'NumberOfTime3059DaysPastDueNotWorse': 'NumberOfTime30-59DaysPastDueNotWorse',
            'NumberOfTime6089DaysPastDueNotWorse': 'NumberOfTime60-89DaysPastDueNotWorse'
        }
        
        mapped_data = {}
        for k, v in data.items():
            new_key = feature_map.get(k, k)
            mapped_data[new_key] = [v]
            
        return pd.DataFrame(mapped_data)

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
    app = CreditApplication(**payload)
    df = app.to_df()
    print("DataFrame created successfully.")
    print("Columns:", df.columns.tolist())
    
    expected_features = [
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
    
    # Check strict ordering
    try:
        df_ordered = df[expected_features]
        print("Column reordering successful.")
    except KeyError as e:
        print(f"KeyError during reordering: {e}")
        # Find missing
        missing = set(expected_features) - set(df.columns)
        print(f"Missing columns: {missing}")

except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()
