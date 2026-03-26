const express = require("express");
const router = express.Router();

const Ad = require("../models/Ad");
const Click = require("../models/Click");


// ----------------------------------
// GET ADS
// ----------------------------------

router.get("/ads", async (req,res)=>{

  const ads = await Ad.find();

  res.json(ads);

});


// ----------------------------------
// CREATE AD
// ----------------------------------

router.post("/create-ad", async (req,res)=>{

  const {title,desc,img} = req.body;

  const lastAd = await Ad.findOne().sort({app:-1});

  let app = 10;
  let channel = 1;

  if(lastAd){
    app = lastAd.app + 10;
    channel = lastAd.channel + 1;
  }

  const ad = new Ad({
    title,
    desc,
    img,
    app,
    channel
  });

  await ad.save();

  res.json({
    message:"Ad created",
    app,
    channel
  });

});


// ----------------------------------
// AD PERFORMANCE
// ----------------------------------

router.get("/ad-performance", async (req,res)=>{

  const ads = await Ad.find();

  const result = [];

  for(const ad of ads){

    const total = await Click.countDocuments({app: ad.app});

    const fraud = await Click.countDocuments({
      app: ad.app,
      fraud_prediction:1
    });

    const fraudRate = total ? ((fraud/total)*100).toFixed(1) : 0;

    result.push({
      id: ad.app, 
      name: ad.title,
      totalClicks: total,
      fraudClicks: fraud,
      fraudRate: fraudRate + "%"

    });

  }

  res.json(result);

});


// ----------------------------------
// AD REPORT (REAL DATA)
// ----------------------------------

router.get("/ad-report/:app", async (req, res) => {

  const app = parseInt(req.params.app);

  const clicks = await Click.find({ app });

  const total = clicks.length;

  const fraud = clicks.filter(c => c.fraud_prediction === 1).length;

  const genuine = total - fraud;

  const rate = total ? ((fraud / total) * 100).toFixed(2) : 0;

  // -----------------------------
  // TREND (group by minute)
  // -----------------------------
  const trendMap = {};

  clicks.forEach(c => {
    const time = new Date(c.click_time);
    const key = time.getHours() + ":" + time.getMinutes();

    trendMap[key] = (trendMap[key] || 0) + 1;
  });

  const trend = Object.keys(trendMap).map(k => ({
    time: k,
    clicks: trendMap[k]
  }));

  // -----------------------------
  // CONFUSION MATRIX (approx)
  // -----------------------------
  let tp = 0, tn = 0, fp = 0, fn = 0;

  clicks.forEach(c => {
    const predictedFraud = c.fraud_prediction === 1;
    const riskHigh = c.fraud_prediction === 1; // simple assumption

    if (predictedFraud && riskHigh) tp++;
    else if (predictedFraud && !riskHigh) fn++;
    else if (!predictedFraud && riskHigh) fp++;
    else tn++;
  });

  // -----------------------------
  // METRICS
  // -----------------------------
  const accuracy = total ? ((tp + tn) / total).toFixed(2) : 0;
  const precision = (tp + fp) ? (tp / (tp + fp)).toFixed(2) : 0;
  const recall = (tp + fn) ? (tp / (tp + fn)).toFixed(2) : 0;
  const f1 = (precision && recall)
    ? ((2 * precision * recall) / (parseFloat(precision) + parseFloat(recall))).toFixed(2)
    : 0;

  res.json({
    total,
    fraud,
    genuine,
    rate,
    trend,
    cm: { tp, tn, fp, fn },
    metrics: { accuracy, precision, recall, f1 }
  });

});

// ----------------------------------
// RECENT SESSIONS
// ----------------------------------

router.get("/sessions", async (req,res)=>{

  const clicks = await Click.find()
  .sort({click_time:-1})
  .limit(10);

  const sessions = clicks.map(c => ({

    time: c.click_time,
    ad: "Ad " + c.app,
    sessionId: c.ip.slice(0,10),
    clicks: 1,
    minGap: "N/A",
    maxGap: "N/A",
    status: c.fraud_prediction ? "FRAUD" : "SERVING",
    risk: c.fraud_prediction ? "High" : "Low"

  }));

  res.json(sessions);

});

router.get("/stats/:app", async (req, res) => {

  const app = parseInt(req.params.app);

  const total = await Click.countDocuments({ app });

  const fraud = await Click.countDocuments({
    app,
    fraud_prediction: 1
  });

  const genuine = total - fraud;

  const fraud_rate = total
    ? ((fraud / total) * 100).toFixed(2)
    : 0;

  res.json({
    total,
    fraud,
    genuine,
    fraud_rate
  });

});

module.exports = router;