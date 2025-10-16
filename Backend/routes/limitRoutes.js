import express from "express";
import { createLimit, getLimits } from "../controller/limitController.js";
import { verifyUser } from "../middleware/verifyUser.js";

export const limitRouter = express.Router();

limitRouter.post("/", verifyUser, createLimit);
limitRouter.get("/", verifyUser, getLimits);