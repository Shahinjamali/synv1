const express = require("express");
const router = express.Router();
const Newsletter = require("../models/newsletterModel");

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    const newSubscriber = await Newsletter.create({ email });
    return res
      .status(201)
      .json({ message: "Subscribed successfully", data: newSubscriber });
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
