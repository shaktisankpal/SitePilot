import express from "express";
import { generateLayout, getAILogs } from "./ai.controller.js";
import { authChain, requireRole } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate-website", authChain, requireRole("OWNER", "ADMIN", "DEVELOPER"), generateLayout);
router.get("/logs", authChain, requireRole("OWNER", "ADMIN"), getAILogs);

export default router;
