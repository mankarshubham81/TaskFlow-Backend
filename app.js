import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import connectDB from "./config/connectdb.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import "./config/passport-jwt-strategy.js";
import "./config/google-strategy.js";

const app = express();
app.set('trust proxy', 1);

// Environment variables
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
const FRONTEND_HOST = process.env.FRONTEND_HOST;

// Database connection
connectDB(DATABASE_URL);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_HOST,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(passport.initialize());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);

// Google OAuth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { 
    session: false, 
    scope: ["profile", "email"] 
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${FRONTEND_HOST}/account/login`,
  }),
  (req, res) => {
    const { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp } = req.user;
    setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp);
    res.redirect(`${FRONTEND_HOST}/user/task`);
  }
);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? null : err,
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});