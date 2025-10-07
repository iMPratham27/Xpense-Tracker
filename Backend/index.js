// SERVER FILE

import express from "express";
import { port } from "./config/config.js";
import { connectDB } from "./config/db.js";
import { router } from "./routes/transactionRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

connectDB();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

app.use("/api/transaction", router);
app.use("/api/auth", authRouter);

app.listen(port, () => { console.log(`Server is running at: ${port}`) })