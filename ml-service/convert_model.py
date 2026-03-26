import joblib

# Load old model
model = joblib.load("xgboost_hybrid_model.pkl")

# Convert to new format
model.get_booster().save_model("xgboost_hybrid_model.ubj")

print("✅ Model converted successfully!")