const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({

  ip: String,
  app: Number,
  device: String,
  os: String,
  channel: Number,
  click_time: String,
  fraud_prediction: Number

});

module.exports = mongoose.model("Click", ClickSchema);