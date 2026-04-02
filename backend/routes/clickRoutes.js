const express = require("express");
const router = express.Router();
const axios = require("axios");
const BlockedIP = require("../models/BlockedIP");
const Click = require("../models/Click");

// -----------------------------
// Device & OS Encoding Maps
// -----------------------------
const deviceMap = {
  Desktop: 0,
  Mobile: 1,
  Tablet: 2
};

const osMap = {
  Windows: 0,
  Android: 1,
  iOS: 2,
  MacOS: 3,
  Linux: 4
};

// -----------------------------
// Encode IP
// -----------------------------
function encodeIP(ip) {
  let hash = 0;

  for (let i = 0; i < ip.length; i++) {
    hash = ((hash << 5) - hash) + ip.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash % 100000);
}

// -----------------------------
// ROUTE: Ad Click
// -----------------------------
router.post("/ad-click", async (req, res) => {
  try {
    // -----------------------------
    // Capture IP
    // -----------------------------
    const ip = req.ip || req.connection.remoteAddress;

    const clickData = {
      ...req.body,
      ip
    };
    const BlockedIP = require("../models/BlockedIP");

    // -----------------------------
    // 🚨 CHECK BLOCKED IP
    // -----------------------------
    const blockedIP = await BlockedIP.findOne({ ip });

    if (blockedIP) {
  return res.status(403).json({
    blocked: true,
    fraud_prediction: 1,
    reason: ["IP blocked due to previous fraud activity"],
    status: "BLOCKED"
  });
}
    const clickTime = new Date(clickData.click_time);

    const day = clickTime.getDate();
    const hour = clickTime.getHours();
    const day_of_week = clickTime.getDay();

    // -----------------------------
    // Encode device & OS
    // -----------------------------
    const device_encoded = deviceMap[clickData.device] || 0;
    const os_encoded = osMap[clickData.os] || 0;

    const ip_encoded = encodeIP(ip);

    // -----------------------------
    // Fetch previous clicks
    // -----------------------------
    const previousClicks = await Click.find({ ip })
      .sort({ click_time: -1 })
      .limit(50);

    const ip_count = previousClicks.length;

    const ip_app_count = previousClicks.filter(
      c => c.app === clickData.app
    ).length;

    const ip_device_os_count = previousClicks.filter(
      c => c.device === clickData.device && c.os === clickData.os
    ).length;

    // -----------------------------
    // Time-based features
    // -----------------------------
    let ip_time_diff = 999999;

    if (previousClicks.length > 0) {
      const prevTime = new Date(previousClicks[0].click_time);
      ip_time_diff = (clickTime - prevTime) / 1000;
    }

    let ip_app_time_diff = 999999;

    const prevAppClick = previousClicks.find(
      c => c.app === clickData.app
    );

    if (prevAppClick) {
      const prevAppTime = new Date(prevAppClick.click_time);
      ip_app_time_diff = (clickTime - prevAppTime) / 1000;
    }

    // -----------------------------
    // 🚨 RULE-BASED DETECTION
    // -----------------------------

    // Fast click (<0.5 sec)
    if (ip_time_diff < 0.5) {
      const reason = ["Fast click detected"];

      const click = new Click({
        ...clickData,
        fraud_prediction: 1,
        reason
      });

      await click.save();

      return res.json({
        fraud_prediction: 1,
        reason
      });
    }

    // Burst attack (>10 clicks in 10 sec)
    const tenSecondsAgo = new Date(clickTime.getTime() - 10000);

    const recentClicks = await Click.countDocuments({
      ip,
      click_time: { $gte: tenSecondsAgo.toISOString() }
    });

    if (recentClicks > 10) {
      const reason = ["Burst attack detected"];

      const click = new Click({
        ...clickData,
        fraud_prediction: 1,
        reason
      });

      await click.save();

      return res.json({
        fraud_prediction: 1,
        reason
      });
    }

    // -----------------------------
    // Behavioral Features
    // -----------------------------
    const unique_app_per_ip =
      new Set(previousClicks.map(c => c.app)).size;

    const unique_channel_per_ip =
      new Set(previousClicks.map(c => c.channel)).size;

    const unique_device_per_ip =
      new Set(previousClicks.map(c => c.device)).size;

    const ip_hour_clicks = previousClicks.filter(c => {
      const t = new Date(c.click_time);
      return t.getHours() === hour;
    }).length;

    // -----------------------------
    // Target Encoding placeholders
    // -----------------------------
    const app_te = 0;
    const device_te = 0;
    const os_te = 0;
    const channel_te = 0;

    // -----------------------------
    // Feature Vector (21 features)
    // -----------------------------
    const features = [[
      ip_encoded,
      clickData.app,
      device_encoded,
      os_encoded,
      clickData.channel,
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
    ]];

    console.log("MODEL FEATURES:", features);

    // -----------------------------
    // Send to ML Service
    // -----------------------------
    const prediction = await axios.post(
      "http://localhost:5001/predict",
      { features }
    );

    const fraud = prediction.data.fraud_prediction;
    const reason = prediction.data.reason || ["No explanation available"];

    // -----------------------------
    // Store Click
    // -----------------------------
    const click = new Click({
      ...clickData,
      fraud_prediction: fraud,
      reason: reason,
    });

    await click.save();

    // -----------------------------
    // Final Response
    // -----------------------------
    res.json({
      fraud_prediction: fraud,
      reason
    });

  } catch (error) {
    console.error("Error processing click:", error);

    res.status(500).json({
      error: "Server error"
    });
  }

});

router.get("/sessions", async (req, res) => {
  try {

    const clicks = await Click.find()
      .sort({ createdAt: -1 })
      .limit(20);

    const sessions = clicks.map(c => ({

      time: new Date(c.click_time).toLocaleString(),
      ad: c.app,
      clicks: 1,

      status: c.status || (c.fraud_prediction ? "FRAUD" : "SERVING"),
      risk: c.fraud_prediction ? "High" : "Low",

      // ✅ THIS FIXES YOUR ISSUE
      reason: c.reason && c.reason.length > 0
        ? c.reason
        : ["No reason available"]

    }));

    res.json(sessions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

module.exports = router;