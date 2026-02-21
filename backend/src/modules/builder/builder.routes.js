import express from "express";
import {
    getPages,
    getPage,
    createPage,
    deletePage,
    updateSections,
    updateSectionProps,
    saveDraft,
} from "./builder.controller.js";
import { authChain, requireRole } from "../../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// All builder routes require auth
router.get("/", authChain, getPages);
router.get("/:pageId", authChain, getPage);
router.post("/", authChain, requireRole("OWNER", "ADMIN", "DEVELOPER"), createPage);
router.delete("/:pageId", authChain, requireRole("OWNER", "ADMIN"), deletePage);
router.put("/:pageId/sections", authChain, requireRole("OWNER", "ADMIN", "EDITOR", "DEVELOPER"), updateSections);
router.patch("/:pageId/sections/:sectionId", authChain, requireRole("OWNER", "ADMIN", "EDITOR", "DEVELOPER"), updateSectionProps);
router.post("/:pageId/save-draft", authChain, requireRole("OWNER", "ADMIN", "EDITOR", "DEVELOPER"), saveDraft);

export default router;
