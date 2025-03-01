const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const formRoutes = require("./routes/formRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://sherise.club", "https://www.sherise.club"]
    : ["http://localhost:3000", "http://localhost:3001"]; // Development origins

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api", formRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
