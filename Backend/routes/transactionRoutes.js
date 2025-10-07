
import express from "express";
export const router = express.Router();
import { createTransaction, getTransaction, getDashboardData } from "../controller/transactionController.js";
import { verifyUser } from "../middleware/verifyUser.js";

router.post("/", verifyUser, createTransaction);
router.get("/", verifyUser, getTransaction);
router.get("/dashboardData", verifyUser, getDashboardData);