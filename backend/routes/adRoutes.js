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

      name: ad.title,
      totalClicks: total,
      fraudClicks: fraud,
      fraudRate: fraudRate + "%"

    });

  }

  res.json(result);

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