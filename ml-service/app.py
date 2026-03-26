from flask import Flask, request, jsonify
import joblib
import numpy as np

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


@app.route("/")
def home():
    return "Fraud Detection ML Service Running"


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    # ✅ INPUT VALIDATION (ADD HERE)
    if not data or "features" not in data:
        return jsonify({"error": "Invalid input"}), 400

    # Node sends [[21 features]]
    features = data["features"][0]

    # -----------------------------
    # Extract raw categorical values
    # -----------------------------
    app_id = int(features[1])
    device_id = int(features[2])
    os_id = int(features[3])
    channel_id = int(features[4])

    # -----------------------------
    # Compute correct target encodings
    # -----------------------------
    app_te = app_te_map.get(app_id, global_mean)
    device_te = device_te_map.get(device_id, global_mean)
    os_te = os_te_map.get(os_id, global_mean)
    channel_te = channel_te_map.get(channel_id, global_mean)

    # -----------------------------
    # Inject encodings into feature vector
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

    # ✅ EXPLAINABILITY (ADD HERE)
    reason = []

    if prob > 0.8:
        reason.append("High fraud probability")

    # features[8] = ip_time_diff (based on your feature order)
    if features[0][8] < 1:
        reason.append("Very fast click behavior")

    if len(reason) == 0:
        reason.append("Normal click pattern")

    return jsonify({
    "fraud_prediction": fraud,
    "fraud_probability": float(prob),
    "reason": reason
})


if __name__ == "__main__":
    app.run(port=5001)