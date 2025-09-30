const User = require("../models/User");

const getPendingEnablers = async (req, res) => {
  try {
    const enablers = await User.find({ role: "enabler", approved: false });
    res.json(enablers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve enabler
const approveEnabler = async (req, res) => {
  try {
    const enabler = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!enabler) return res.status(404).json({ message: "Enabler not found" });
    res.json(enabler);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// admin/operator: get approved enablers list
exports.getApprovedEnablers = async (req, res) => {
  try {
    const enablers = await User.find({
      role: "enabler",
      approved: true,
    }).select("name email expertiseAreas");
    return res.json(enablers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const getApprovedEnablers = async (req, res) => {
  try {
    const enablers = await User.find({ role: "enabler", approved: true });
    res.json(enablers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getPendingEnablers, approveEnabler, getApprovedEnablers };

// admin: create operator or admin user
exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, expertiseAreas } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash(password, 10);
    const approved = role === "enabler" ? false : true;

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      expertiseAreas: expertiseAreas || [],
      approved,
    });
    return res.status(201).json({
      message: "User created",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
