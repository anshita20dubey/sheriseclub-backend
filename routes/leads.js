const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
});

module.exports = router;
