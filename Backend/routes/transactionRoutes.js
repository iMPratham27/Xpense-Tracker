
import express from "express";
export const router = express.Router();
import { createTransaction, getTransaction, getDashboardData } from "../controller/transactionController.js";

router.post("/", createTransaction);
router.get("/", getTransaction);
router.get("/dashboardData", getDashboardData);