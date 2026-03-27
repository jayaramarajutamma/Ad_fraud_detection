from flask import Flask, request, jsonify
import joblib
import numpy as np
import shap

app = Flask(__name__)

# -----------------------------
# Load trained model
# -----------------------------
model = joblib.load("xgboost_hybrid_model.pkl")

# -----------------------------
# Load target encoding maps
# -----------------------------
app_te_map = joblib.load("app_te.pkl")
device_te_map = joblib.load("device_te.pkl")
os_te_map = joblib.load("os_te.pkl")
channel_te_map = joblib.load("channel_te.pkl")

# global mean fallback
global_mean = joblib.load("global_mean.pkl")

# -----------------------------
# ✅ SHAP Tree Explainer (INIT ONCE)
# -----------------------------
explainer = shap.TreeExplainer(model)

# Feature names (MUST match training order)
feature_names = [
    "click_time", "app", "device", "os", "channel",
    "feature_5", "feature_6", "feature_7",
    "ip_time_diff", "feature_9", "feature_10",
    "feature_11", "feature_12", "feature_13",
    "feature_14", "feature_15", "feature_16",
    "app_te", "device_te", "os_te", "channel_te"
]


@app.route("/")
def home():
    return "Fraud Detection ML Service Running"


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    # -----------------------------
    # ✅ INPUT VALIDATION
    # -----------------------------
    if not data or "features" not in data:
        return jsonify({"error": "Invalid input"}), 400

    # Node sends [[21 features]]
    features = data["features"][0]

    # -----------------------------
    # Extract categorical values
    # -----------------------------
    app_id = int(features[1])
    device_id = int(features[2])
    os_id = int(features[3])
    channel_id = int(features[4])

    # -----------------------------
    # Compute target encodings
    # -----------------------------
    app_te = app_te_map.get(app_id, global_mean)
    device_te = device_te_map.get(device_id, global_mean)
    os_te = os_te_map.get(os_id, global_mean)
    channel_te = channel_te_map.get(channel_id, global_mean)

    # -----------------------------
    # Inject encodings
    # -----------------------------
    print("FEATURES BEFORE TE:", features)

    features[17] = app_te
    features[18] = device_te
    features[19] = os_te
    features[20] = channel_te

    print("FEATURES AFTER TE:", features)

    # convert to numpy
    features = np.array([features])

    # -----------------------------
    # Run prediction
    # -----------------------------
    prob = model.predict_proba(features)[0][1]

    print("Fraud probability:", prob)

    THRESHOLD = 0.5
    fraud = 1 if prob > THRESHOLD else 0

    # -----------------------------
    # ✅ AI EXPLAINABILITY (SHAP)
    # -----------------------------
    try:
        shap_values = explainer.shap_values(features)

        contributions = shap_values[0]

        # Pair feature names with contribution values
        feature_impact = list(zip(feature_names, contributions))

        # Sort by importance (absolute value)
        feature_impact = sorted(feature_impact, key=lambda x: abs(x[1]), reverse=True)

        reason = []

        # Top 3 contributing features
        for name, value in feature_impact[:3]:
            if value > 0:
                reason.append(f"{name} increases fraud risk")
            else:
                reason.append(f"{name} reduces fraud risk")

        if len(reason) == 0:
            reason.append("No strong indicators detected")

    except Exception as e:
        print("SHAP Error:", e)
        reason = ["Explainability unavailable"]

    # -----------------------------
    # Response
    # -----------------------------
    return jsonify({
        "fraud_prediction": fraud,
        "reason": reason
    })

from pymongo import MongoClient

# -----------------------------
# MongoDB Connection
# -----------------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["adfraud"]   # ⚠️ change this
collection = db["clicks"]           # your collection name


   
if __name__ == "__main__":
    app.run(port=5001)