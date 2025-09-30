const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: {
      type: String,
      enum: ["admin", "operator", "enabler"],
      required: true,
    },
    expertiseAreas: [{ type: String }], // for enablers
    approved: { type: Boolean, default: false }, // enabler approval by admin/operator
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
