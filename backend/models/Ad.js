const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({

  title: String,
  desc: String,
  img: String,

  app: Number,
  channel: Number

});

module.exports = mongoose.model("Ad", AdSchema);