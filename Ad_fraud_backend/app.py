from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import numpy as np
from datetime import datetime
import joblib


model = joblib.load("xgboost_hybrid_model.pkl")

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Ad Fraud Detection Server Running"

@app.route("/register", methods=["POST"])
def register():

    data = request.json
    name = data["name"]
    email = data["email"]
    password = data["password"]

    conn = sqlite3.connect("adfraud.db", timeout=10)
    cursor = conn.cursor()

    existing = cursor.execute(
        "SELECT * FROM users WHERE email=?",
        (email,)
    ).fetchone()

    if existing:
        conn.close()
        return {"message":"Email already exists"}

    cursor.execute(
        "INSERT INTO users(name,email,password) VALUES(?,?,?)",
        (name,email,password)
    )

    conn.commit()
    conn.close()

    return {"message":"User registered"}


@app.route("/login",methods=["POST"])
def login():

    data = request.json
    email = data["email"]
    password = data["password"]

    conn = sqlite3.connect("adfraud.db")
    cursor = conn.cursor()

    user = cursor.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (email,password)
    ).fetchone()

    conn.close()

    if user:
        return jsonify({"success":True})
    else:
        return jsonify({"success":False})
    
device_map = {
    "Desktop": 0,
    "Mobile": 1,
    "Tablet": 2
}

os_map = {
    "Windows": 0,
    "Android": 1,
    "iOS": 2,
    "MacOS": 3,
    "Linux": 4
}

@app.route("/ad-click", methods=["POST"])
def ad_click():

    data = request.json

    ip = request.remote_addr
    ip_encoded = hash(ip) % 100000
    app_id = data["app"]
    device = data["device"]
    os = data["os"]
    channel = data["channel"]
    click_time = data["click_time"]

    dt = datetime.fromisoformat(click_time.replace("Z",""))

    day = dt.day
    hour = dt.hour
    day_of_week = dt.weekday()

    device_encoded = device_map.get(device,0)
    os_encoded = os_map.get(os,0)

    conn = sqlite3.connect("adfraud.db", timeout=10)
    cursor = conn.cursor()

    # -------------------------
    # TIME GAP FEATURES
    # -------------------------

    cursor.execute("""
        SELECT click_time
        FROM click_logs
        WHERE ip=?
        ORDER BY click_time DESC
        LIMIT 1
    """,(ip,))
    prev = cursor.fetchone()

    if prev:
        prev_time = datetime.fromisoformat(prev[0].replace("Z",""))
        ip_time_diff = (dt - prev_time).total_seconds()
    else:
        ip_time_diff = 999999


    cursor.execute("""
        SELECT click_time
        FROM click_logs
        WHERE ip=? AND app=?
        ORDER BY click_time DESC
        LIMIT 1
    """,(ip,app_id))
    prev_app = cursor.fetchone()

    if prev_app:
        rev_time = datetime.fromisoformat(prev_app[0].replace("Z",""))
        ip_app_time_diff = (dt - prev_time).total_seconds()
    else:
        ip_app_time_diff = 999999

    # -------------------------
    # COUNT FEATURES
    # -------------------------

    cursor.execute("SELECT COUNT(*) FROM click_logs WHERE ip=?",(ip,))
    ip_count = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM click_logs WHERE ip=? AND app=?",
        (ip,app_id)
    )
    ip_app_count = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM click_logs WHERE ip=? AND device=? AND os=?",
        (ip,device,os)
    )
    ip_device_os_count = cursor.fetchone()[0]

    # -------------------------
    # UNIQUE BEHAVIOR FEATURES
    # -------------------------

    cursor.execute("SELECT COUNT(DISTINCT app) FROM click_logs WHERE ip=?",(ip,))
    unique_app_per_ip = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT channel) FROM click_logs WHERE ip=?",(ip,))
    unique_channel_per_ip = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT device) FROM click_logs WHERE ip=?",(ip,))
    unique_device_per_ip = cursor.fetchone()[0]

    # -------------------------
    # HOURLY BURST FEATURE
    # -------------------------

    cursor.execute("""
        SELECT COUNT(*)
        FROM click_logs
        WHERE ip=? AND strftime('%H',click_time)=?
    """,(ip,f"{hour:02d}"))
    ip_hour_clicks = cursor.fetchone()[0]

    # -------------------------
    # TARGET ENCODING (Dummy)
    # -------------------------

    app_te = app_id
    device_te = device_encoded
    os_te = os_encoded
    channel_te = channel

    # -------------------------
    # STORE CLICK
    # -------------------------

    cursor.execute("""
        INSERT INTO click_logs(ip,app,device,os,channel,click_time)
        VALUES(?,?,?,?,?,?)
    """,(ip,app_id,device,os,channel,click_time))

    conn.commit()
    conn.close()

    # -------------------------
    # MODEL FEATURES
    # -------------------------

    features = [[
        ip_encoded,
        app_id,
        device_encoded,
        os_encoded,
        channel,
        day,
        hour,
        day_of_week,
        ip_time_diff,
        ip_app_time_diff,
        ip_count,
        ip_app_count,
        ip_device_os_count,
        unique_app_per_ip,
        unique_channel_per_ip,
        unique_device_per_ip,
        ip_hour_clicks,
        app_te,
        device_te,
        os_te,
        channel_te
    ]]
    fraud_result=0

    # fast click detection
    if ip_time_diff < 0.5:
        fraud_result = 1
        print("if")

    elif ip_count > 15:
        fraud_result = 1
        print("rlsr if")

    else:
        prediction = model.predict(features)
        fraud_result = int(prediction[0])

    return jsonify({
        "fraud_prediction": fraud_result
    })

if __name__ == "__main__":
    app.run(debug=True)