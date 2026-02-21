import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { requestLogger } from "./middleware/logger.middleware.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { initializeSockets } from "./sockets/collaboration.socket.js";

// Routes
import authRoutes from "./modules/auth/auth.routes.js";
import tenantRoutes from "./modules/tenant/tenant.routes.js";
import websiteRoutes from "./modules/website/website.routes.js";
import builderRoutes from "./modules/builder/builder.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import domainRoutes from "./modules/domain/domain.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import publishRoutes from "./agents/routes/publish.js";
import formsRoutes from "./modules/forms/forms.routes.js";

// Public routes
import {
    resolveHostname,
    getPublicPage,
    getPublicSite,
} from "./modules/domain/domain.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);

// Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

initializeSockets(io);

// Security middleware
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: { success: false, message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);

// Stricter limit for AI endpoints
const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { success: false, message: "AI rate limit exceeded" },
});
app.use("/api/ai", aiLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logger
app.use(requestLogger);

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
    res.json({ success: true, service: "SitePilot API", timestamp: new Date().toISOString() });
});

// Public API routes (no auth)
app.get("/api/public/resolve", resolveHostname);
app.get("/api/public/sites/:tenantSlug", getPublicSite);
app.get("/api/public/sites/:tenantSlug/pages/:slug", getPublicPage);
app.use("/api/public/forms", formsRoutes);

// Protected API routes
app.use("/api/auth", authRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/websites", websiteRoutes);
app.use("/api/builder/websites/:websiteId/pages", builderRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/publish", publishRoutes);
app.use("/api/forms", formsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    httpServer.listen(PORT, () => {
        console.log(`🚀 SitePilot API running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
        console.log(`📡 Socket.io active`);
    });
};

startServer();
