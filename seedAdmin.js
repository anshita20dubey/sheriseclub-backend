const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("✅ Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = new User({
      name: "Super Admin",
      email: "admin@sherise.com",
      password: hashedPassword,
      role: "admin",
      approved: true,
    });

    await admin.save();
    console.log("🎉 Admin created:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();
