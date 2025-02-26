const express = require('express');
const router = express.Router();
const QuickHelp = require('../models/QuickHelp');
const JoinClub = require('../models/JoinClub');

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
router.post('/join-club', async (req, res) => {
    try {
        const newJoinClub = new JoinClub(req.body);
        const savedJoinClub = await newJoinClub.save();
        res.status(201).json(savedJoinClub);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
