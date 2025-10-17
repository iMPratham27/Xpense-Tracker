// SERVER FILE

import express from "express";
import { port } from "./config/config.js";
import { connectDB } from "./config/db.js";
import { router } from "./routes/transactionRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { limitRouter } from "./routes/limitRoutes.js"

const app = express();

// Use trust proxy so secure cookies work behind Render/Proxies
app.set("trust proxy", 1);

connectDB();

app.use(express.json());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL , 
        "http://localhost:5173"
    ],
    credentials: true
}));
app.use(cookieParser());

app.use("/api/transaction", router);
app.use("/api/auth", authRouter);
app.use("/api/limit", limitRouter);

app.listen(port, () => { console.log(`Server is running at: ${port}`) })