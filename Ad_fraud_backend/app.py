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
@app.route("/ads", methods=["GET"])
def get_ads():

    conn = sqlite3.connect("adfraud.db")
    cursor = conn.cursor()

    ads = cursor.execute("SELECT * FROM ads").fetchall()

    conn.close()

    ads_list = []

    for ad in ads:
        ads_list.append({
            "id": ad[0],
            "title": ad[1],
            "desc": ad[2],
            "img": ad[3],
            "app": ad[4],
            "channel": ad[5]
        })

    return jsonify(ads_list)

@app.route("/create-ad", methods=["POST"])
def create_ad():

    data = request.json

    title = data["title"]
    description = data["desc"]
    image = data["img"]

    conn = sqlite3.connect("adfraud.db")
    cursor = conn.cursor()

    # get last ad
    cursor.execute("""
        SELECT app, channel
        FROM ads
        ORDER BY id DESC
        LIMIT 1
    """)
    last = cursor.fetchone()

    if last:
        app_id = last[0] + 10
        channel = last[1] + 1
    else:
        app_id = 10
        channel = 1

    cursor.execute("""
        INSERT INTO ads(title,description,image,app,channel)
        VALUES(?,?,?,?,?)
    """,(title,description,image,app_id,channel))

    conn.commit()
    conn.close()

    return jsonify({
        "message":"Ad created",
        "app": app_id,
        "channel": channel
    })

@app.route("/stats/<int:app_id>")
def stats(app_id):

    conn = sqlite3.connect("adfraud.db")
    cursor = conn.cursor()

    total = cursor.execute("""
        SELECT COUNT(*)
        FROM click_logs
        WHERE app=?
    """,(app_id,)).fetchone()[0]

    fraud = cursor.execute("""
        SELECT COUNT(*)
        FROM click_logs
        WHERE app=? AND fraud_prediction=1
    """,(app_id,)).fetchone()[0]

    genuine = total - fraud

    fraud_rate = (fraud/total)*100 if total else 0

    conn.close()

    return jsonify({
        "total": total,
        "fraud": fraud,
        "genuine": genuine,
        "fraud_rate": round(fraud_rate,2)
    })

@app.route("/sessions", methods=["GET"])
def sessions():

    conn = sqlite3.connect("adfraud.db")
    cursor = conn.cursor()

    rows = cursor.execute("""
    SELECT click_time, app, ip, fraud_prediction
    FROM click_logs
    ORDER BY click_time DESC
    LIMIT 10
    """).fetchall()

    conn.close()

    result = []

    for r in rows:

        fraud = r[3]

        status = "FRAUD" if fraud == 1 else "SERVING"
        risk = "High" if fraud == 1 else "Low"

        result.append({
            "time": r[0],
            "ad": f"Ad {r[1]}",
            "sessionId": r[2][:10],
            "clicks": 1,
            "minGap": "N/A",
            "maxGap": "N/A",
            "status": status,
            "risk": risk
        })

    return jsonify(result)

@app.route("/ad-performance")
def ad_performance():

    conn = sqlite3.connect("adfraud.db")
    cursor = conn.cursor()

    rows = cursor.execute("""
        SELECT ads.title,
            click_logs.app,
            COUNT(*) as total,
            SUM(CASE WHEN fraud_prediction=1 THEN 1 ELSE 0 END) as fraud
        FROM click_logs
        JOIN ads ON ads.app = click_logs.app
        GROUP BY click_logs.app
        """).fetchall()

    conn.close()

    result = []

    for r in rows:

        title = r[0]
        total = r[2]
        fraud = r[3] or 0

        fraud_rate = (fraud/total)*100 if total else 0

        result.append({
            "name": title,
            "totalClicks": total,
            "fraudClicks": fraud,
            "fraudRate": f"{fraud_rate:.1f}%"
        })

    return jsonify(result)



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
        ip_app_time_diff = (dt - rev_time).total_seconds()
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
    fraud_result = 0

    # fast click detection
    if ip_time_diff < 0.5:
        fraud_result = 1
        print("Fast click detected")

    # burst detection in last 10 seconds
    else:
        cursor.execute("""
            SELECT COUNT(*)
            FROM click_logs
            WHERE ip=? AND datetime(click_time) >= datetime(?,'-10 seconds')
        """,(ip, click_time))

        recent_clicks = cursor.fetchone()[0]

        if recent_clicks > 10:
            fraud_result = 1
            print("Burst attack detected")

        else:
            prediction = model.predict(features)
            fraud_result = int(prediction[0])


    # store click
    cursor.execute("""
    INSERT INTO click_logs
    (ip,app,device,os,channel,click_time,fraud_prediction)
    VALUES(?,?,?,?,?,?,?)
    """,(ip,app_id,device,os,channel,click_time,fraud_result))

    conn.commit()
    conn.close()

    return jsonify({
        "fraud_prediction": fraud_result
    })

if __name__ == "__main__":
    app.run(debug=True)