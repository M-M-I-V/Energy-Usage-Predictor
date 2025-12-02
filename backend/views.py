from flask import jsonify
import joblib
import pandas as pd
from pathlib import Path

models_dir = Path(__file__).resolve().parent / "models"
model_path = models_dir / "energy_model.pkl"
model_columns_path = models_dir / "model_columns.pkl"

if not model_path.exists() or not model_columns_path.exists():
    raise FileNotFoundError(f"Model files not found in {models_dir!s}. Ensure 'energy_model.pkl' and 'model_columns.pkl' are present.")

model = joblib.load(str(model_path))
model_columns = joblib.load(str(model_columns_path))

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

    predicted = float(model.predict(X_new)[0])
    current_rate = 13.0127

    cost = current_rate * predicted

    return jsonify({"predicted": predicted, "cost": cost, "message": "Predicted Successful!"})