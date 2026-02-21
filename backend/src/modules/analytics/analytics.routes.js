import express from "express";
import { getDashboardStats, getActivityLogs } from "./analytics.controller.js";
import { authChain } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", authChain, getDashboardStats);
router.get("/activity", authChain, getActivityLogs);

export default router;
