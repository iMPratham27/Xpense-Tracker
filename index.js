// SERVER FILE

import express from "express";
import { port } from "./src/config/config.js";
import { connectDB } from "./src/config/db.js";
import { router } from "./src/routes/transactionRoutes.js";

const app = express();

connectDB();

app.use(express.json());

app.use("/api/transaction", router);

app.listen(port, () => { console.log(`Server Started at: ${port}`) })