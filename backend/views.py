import joblib
import pandas as pd

model = joblib.load(r"Energy-Usage-Predictor\backend\energy_model.pkl")
model_columns = joblib.load(r"Energy-Usage-Predictor\backend\model_columns.pkl")

def predict_new(data):
    """
    data should be a dict like:
    {
        "Hour": 12,
        "Temperature": 23.5,
        "Machine_Status": "Idle"
    }
    """

    X_new = pd.DataFrame([data])

    X_new = pd.get_dummies(X_new, columns=['Machine_Status'], drop_first=False)

    for col in model_columns:
        if col not in X_new.columns:
            X_new[col] = 0

    X_new = X_new[model_columns]

    return float(model.predict(X_new)[0])