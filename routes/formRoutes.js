const express = require('express');
const router = express.Router();
const QuickHelp = require('../models/QuickHelp');
const Membership = require('../models/Membership');
const Inquiry = require('../models/Inquiry');

// Route to submit Quick Help Form
router.post('/quick-help', async (req, res) => {
    try {
        const newQuickHelp = new QuickHelp(req.body);
        const savedQuickHelp = await newQuickHelp.save();
        res.status(201).json(savedQuickHelp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to submit Join SheRise Club Form
router.post('/membership', async (req, res) => {
    try {
        const newMember = new Membership(req.body);
        await newMember.save();
        res.status(201).json({ success: true, message: "Membership created successfully!" });
    } catch (error) {
        console.error("Error saving membership:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/inquiry", async (req, res) => {
    try {
        const { name, email, question, enabler } = req.body; // Add enabler here

        if (!name || !email || !question || !enabler) { // Add enabler to validation
            return res.status(400).json({ error: "All fields are required" });
        }

        const newInquiry = new Inquiry({ name, email, question, enabler }); // Add enabler here
        await newInquiry.save();

        res.status(201).json({ message: "Inquiry submitted successfully" });
    } catch (error) {
        console.error("Error saving inquiry:", error);
        res.status(500).json({ error: "Server error, try again later" });
    }
});

module.exports = router;
