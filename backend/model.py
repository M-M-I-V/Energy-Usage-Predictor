import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from data_generator import get_data # Reusing your generator

print("⚙️ Generatng data and training model...")

# 1. Get Data
df = get_data(n_samples=2000) # More data for better results

# 2. Preprocess
df_processed = pd.get_dummies(df, columns=['Machine_Status'], drop_first=False)
X = df_processed.drop('Energy_kWh', axis=1)
y = df_processed['Energy_kWh']

# 3. Save Columns (CRITICAL STEP)
# We need the exact list of columns to ensure the API inputs match the model later
model_columns = list(X.columns)
joblib.dump(model_columns, 'model_columns.pkl')

# 4. Train Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# 5. Save Model
joblib.dump(model, 'energy_model.pkl')

print("✅ Success! Model saved to 'energy_model.pkl'")
print("✅ Columns saved to 'model_columns.pkl'")