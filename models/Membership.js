const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    jobFunction: { type: String, required: true },
    vertical: { type: String, required: true },
    interests: { type: [String], required: true },
    hearAbout: { type: String, required: true },
    emailPermission: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Membership", membershipSchema);
