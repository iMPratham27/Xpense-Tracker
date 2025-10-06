// SERVER FILE

import express from "express";
import { port } from "./config/config.js";
import { connectDB } from "./config/db.js";
import { router } from "./routes/transactionRoutes.js";

const app = express();

connectDB();

app.use(express.json());

app.use("/api/transaction", router);

app.listen(port, () => { console.log(`Server is running at: ${port}`) })