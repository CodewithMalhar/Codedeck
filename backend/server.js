require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const contestRoutes = require("./routes/contestRoutes");
const userRoutes = require("./routes/userRoutes");
const blogRouts = require("./routes/blogRoutes");
const authRoutes = require('./routes/authRoutes');
const firebaseAuthRoutes = require('./routes/firebaseAuthRoutes');
const portfolioRoutes = require("./routes/portfolioRoutes");
const bodyParser = require("body-parser");
const dbConnect = require("./config/database");
const { uploadOnCloudinary } = require("./controllers/cloudnary");
const FileUpload = require("./config/multer-config");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// passportConfig(app);
// app.use(express.urlencoded());
const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:3000",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(
    ...process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  );
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

dbConnect().then(() => console.log("Connected to MongoDB"));

app.use("/api/contests", contestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blog", blogRouts);
// app.use('/api/cloudnary', cloudnaryRouter)
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", firebaseAuthRoutes);

// Add a test route to verify server is working
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend server is working!" });
});

// Add debug route to check Firebase auth endpoint
app.get("/api/auth/test", (req, res) => {
  res.json({ message: "Firebase auth route is accessible!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
