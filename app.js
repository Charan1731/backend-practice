import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middelware.js";
import cookieParser from "cookie-parser";
import cors from "cors"; 
import arcjetMiddleware from "./middlewares/arcject.middleware.js";
import { VITE_API_URL } from "./config/env.js";

const app = express();
app.use(cors({
    origin: VITE_API_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(arcjetMiddleware)

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send("Hello world");
});
app.listen(PORT, async () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    await connectToDatabase();
});

export default app;
