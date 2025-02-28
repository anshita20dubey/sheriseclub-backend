const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  question: { type: String, required: true },
  enabler: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;
