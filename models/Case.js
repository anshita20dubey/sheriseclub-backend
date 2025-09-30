const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  updateText: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now },
});

const caseSchema = new mongoose.Schema(
  {
    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    question: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },

    assignedEnabler: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // operator/admin who assigned

    status: {
      type: String,
      enum: [
        "Open",
        "Pending",
        "Accepted",
        "In Progress",
        "Completed",
        "Closed",
      ],
      default: "Open",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    deadline: { type: Date },

    progressUpdates: [progressSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);
