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
const allowedOrigins = [
    "https://budget-box-theta.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS not allowed'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type", 
        "Authorization",
        "X-Requested-With",
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Origin"
    ],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400 // CORS preflight cache for 24 hours
}));

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(arcjetMiddleware);

// Health check route
app.get("/", (req, res) => {
    res.json({ 
        status: "ok", 
        message: "Server is running",
        environment: process.env.NODE_ENV
    });
});

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: "error",
        message: "Route not found"
    });
});

// Error handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Database connection
const startServer = async () => {
    try {
        await connectToDatabase();
        console.log("📦 Connected to database");
    } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
};

// Start server based on environment
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, async () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        await startServer();
    });
} else {
    startServer();
}

export default app;