/* eslint-disable no-undef */
import express from "express";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middelware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import arcjetMiddleware from "./middlewares/arcject.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

// CORS configuration
const allowedOrigins = ['https://budget-box-theta.vercel.app', 'http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
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

app.options('*', cors());
// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);


app.use(errorMiddleware);

app.get('/', (req,res) => {
    res.send("Hello world")
})


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