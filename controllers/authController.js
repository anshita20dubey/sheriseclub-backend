const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// register (general) - for enablers/operator/admin signups
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, expertiseAreas } = req.body;

    // Required fields check
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ❌ Block admin registration
    if (role === "admin") {
      return res
        .status(400)
        .json({ message: "Admin registration is not allowed" });
    }

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Enabler needs approval, operator auto-approved
    const approved = role === "enabler" ? false : true;

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      expertiseAreas: expertiseAreas || [],
      approved,
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (user.role === "enabler" && !user.approved) {
      return res.status(403).json({ message: "Enabler awaiting approval" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
