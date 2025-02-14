import express from "express";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middelware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import arcjetMiddleware from "./middlewares/arcject.middleware.js";

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        "https://budget-box-theta.vercel.app",
        "http://localhost:5173", // Add local frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS
    allowedHeaders: [
        "Content-Type", 
        "Authorization",
        "Access-Control-Allow-Credentials", // Added important CORS headers
        "Access-Control-Allow-Origin"
    ],
    exposedHeaders: ["set-cookie"] // Important for cookies
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(arcjetMiddleware);

// Health check route (important for Vercel)
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

// Error handling should be last
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Database connection (wrapped in a function)
const startServer = async () => {
    try {
        await connectToDatabase();
        console.log("📦 Connected to database");
    } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
};

// Start server
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, async () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        await startServer();
    });
} else {
    // In production, just connect to database
    startServer();
}

export default app;