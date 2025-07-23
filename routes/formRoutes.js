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

// ✅ Get all Quick Help entries
router.get('/quick-help', async (req, res) => {
    try {
        const quickHelpData = await QuickHelp.find();
        res.json(quickHelpData);
    } catch (err) {
        res.status(500).json({ message: err.message });
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

// ✅ Get all Membership entries
router.get('/membership', async (req, res) => {
    try {
        const members = await Membership.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch memberships" });
    }
});

router.post("/inquiry", async (req, res) => {
    try {
        const { name, email, question, enabler } = req.body;

        if (!name || !email || !question || !enabler) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newInquiry = new Inquiry({ name, email, question, enabler });
        await newInquiry.save();

        res.status(201).json({ message: "Inquiry submitted successfully" });
    } catch (error) {
        console.error("Error saving inquiry:", error);
        res.status(500).json({ error: "Server error, try again later" });
    }
});

// ✅ Get all Inquiry entries
router.get('/inquiry', async (req, res) => {
    try {
        const inquiries = await Inquiry.find();
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch inquiries" });
    }
});

module.exports = router;
