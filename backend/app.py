from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
CURRENT_RATE_PER_KWH = 11.4295

# --- LOAD MODEL ---
if not os.path.exists('energy_model.pkl'):
    print("❌ ERROR: Model file not found! Run 'python model.py' first.")
else:
    model = joblib.load('energy_model.pkl')
    model_columns = joblib.load('model_columns.pkl')
    print("✅ Model loaded successfully.")

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        input_df = pd.DataFrame([data])
        
        # 1. One-Hot Encode
        input_processed = pd.get_dummies(input_df, columns=['Machine_Status'])
        
        # 2. Align Columns
        for col in model_columns:
            if col not in input_processed.columns:
                input_processed[col] = 0
        input_processed = input_processed[model_columns]
        
        # 3. Predict Energy (Physics)
        predicted_kwh = model.predict(input_processed)[0]
        
        # 4. Calculate Bill (Business Logic)
        estimated_bill = predicted_kwh * CURRENT_RATE_PER_KWH
        
        return jsonify({
            'status': 'success',
            'predicted_energy_kwh': round(predicted_kwh, 2),
            'estimated_bill': round(estimated_bill, 2),
            'rate_used': CURRENT_RATE_PER_KWH
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'Server is running', 'rate': CURRENT_RATE_PER_KWH})

if __name__ == '__main__':
    app.run(debug=True, port=5000)