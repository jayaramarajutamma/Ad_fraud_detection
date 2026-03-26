const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });

  if (existing) {
  return res.json({
    success: false,
    message: "Email already exists"
  });
}

  const user = new User({
    name,
    email,
    password
  });

  await user.save();

  res.json({
  success: true,
  message: "User registered"
});
});



router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({
    email,
    password
  });

  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }

});

module.exports = router;