const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const leadsController = require("../controllers/leadsController");

// Get all leads
router.get("/", auth, leadsController.getLeads);

// Get single lead
router.get("/:id", auth, leadsController.getLeadById);

// Create lead (public)
router.post("/", leadsController.createLead);

// Update lead
router.put("/:id", auth, leadsController.updateLead);

// Delete lead
router.delete("/:id", auth, leadsController.deleteLead);

module.exports = router;
