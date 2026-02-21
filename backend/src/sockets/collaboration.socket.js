import jwt from "jsonwebtoken";
import Page from "../modules/builder/page.model.js";
import ChatMessage from "../modules/builder/chatMessage.model.js";

// Track active editors per page: Map<pageId, Map<socketId, { userId, userName, color }>>
const activeEditors = new Map();

const COLORS = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

let colorIndex = 0;
const getNextColor = () => COLORS[colorIndex++ % COLORS.length];

export const initializeSockets = (io) => {
    // JWT auth middleware for Socket.io
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        if (!token) return next(new Error("Authentication required"));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            socket.tenantId = decoded.tenantId;
            socket.role = decoded.role;
            next();
        } catch {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 Socket connected: ${socket.id} (user: ${socket.userId})`);

        /**
         * JOIN PAGE — editor joins a specific page editing session
         */
        socket.on("join:page", ({ pageId, userName }) => {
            if (!pageId) return;

            const roomKey = `${socket.tenantId}:page:${pageId}`;
            socket.join(roomKey);
            socket.currentRoom = roomKey;
            socket.currentPageId = pageId;
            socket.currentUserName = userName || "Anonymous";

            if (!activeEditors.has(pageId)) {
                activeEditors.set(pageId, new Map());
            }

            const color = getNextColor();
            socket.currentColor = color;
            activeEditors.get(pageId).set(socket.id, {
                userId: socket.userId,
                userName: userName || "Anonymous",
                color,
                socketId: socket.id,
            });

            // Broadcast updated active editors list to room
            const editors = [...activeEditors.get(pageId).values()];
            io.to(roomKey).emit("editors:update", { pageId, editors });

            console.log(`👥 User ${socket.userId} joined page ${pageId}`);
        });

        /**
         * LEAVE PAGE
         */
        socket.on("leave:page", ({ pageId }) => {
            handleLeaveRoom(socket, pageId, io);
        });

        /**
         * CONTENT UPDATE — broadcast to all editors in same page
         */
        socket.on("content:update", ({ pageId, sections, userId }) => {
            if (!pageId || !sections) return;

            const roomKey = `${socket.tenantId}:page:${pageId}`;

            // Broadcast to all OTHER editors in the room (not sender)
            socket.to(roomKey).emit("content:update", {
                pageId,
                sections,
                updatedBy: socket.userId,
                timestamp: Date.now(),
            });
        });

        /**
         * AUTO-SAVE — save draft to DB every 10 seconds
         */
        socket.on("autosave", async ({ pageId, layoutConfig }) => {
            if (!pageId || !layoutConfig) return;

            try {
                await Page.findOneAndUpdate(
                    {
                        _id: pageId,
                        tenantId: socket.tenantId,
                    },
                    { $set: { layoutConfig, status: "draft" } }
                );

                const roomKey = `${socket.tenantId}:page:${pageId}`;
                io.to(roomKey).emit("autosave:success", {
                    pageId,
                    savedAt: new Date().toISOString(),
                });
            } catch (err) {
                socket.emit("autosave:error", { pageId, message: err.message });
            }
        });

        /**
         * TYPING INDICATOR
         */
        socket.on("typing:start", ({ pageId, sectionId, userName }) => {
            const roomKey = `${socket.tenantId}:page:${pageId}`;
            socket.to(roomKey).emit("typing:update", {
                userId: socket.userId,
                userName,
                sectionId,
                typing: true,
            });
        });

        socket.on("typing:stop", ({ pageId, sectionId }) => {
            const roomKey = `${socket.tenantId}:page:${pageId}`;
            socket.to(roomKey).emit("typing:update", {
                userId: socket.userId,
                sectionId,
                typing: false,
            });
        });

        // ─── CHAT MESSAGES ────────────────────────────────────────────────
        /**
         * chat:send — user sends a chat message
         */
        socket.on("chat:send", async ({ pageId, message }) => {
            if (!pageId || !message?.trim()) return;

            const roomKey = `${socket.tenantId}:page:${pageId}`;
            const userName = socket.currentUserName || "Anonymous";
            const color = socket.currentColor || "#6366f1";

            try {
                // Look up websiteId from the page
                const page = await Page.findById(pageId).select("websiteId").lean();

                // Save to DB
                const chatMsg = await ChatMessage.create({
                    tenantId: socket.tenantId,
                    websiteId: page?.websiteId || null,
                    pageId,
                    userId: socket.userId,
                    userName,
                    message: message.trim(),
                    color,
                });

                // Broadcast to the entire room (including sender)
                io.to(roomKey).emit("chat:message", {
                    _id: chatMsg._id,
                    pageId,
                    userId: socket.userId,
                    userName,
                    message: chatMsg.message,
                    color,
                    createdAt: chatMsg.createdAt,
                });
            } catch (err) {
                socket.emit("chat:error", { message: err.message });
            }
        });

        /**
         * chat:history — fetch recent messages for this page
         */
        socket.on("chat:history", async ({ pageId, limit }) => {
            if (!pageId) return;
            try {
                const messages = await ChatMessage.find({
                    pageId,
                    tenantId: socket.tenantId,
                })
                    .sort({ createdAt: -1 })
                    .limit(limit || 50)
                    .lean();

                socket.emit("chat:history", {
                    pageId,
                    messages: messages.reverse(), // oldest first
                });
            } catch (err) {
                socket.emit("chat:error", { message: err.message });
            }
        });

        /**
         * DISCONNECT
         */
        socket.on("disconnect", () => {
            if (socket.currentPageId) {
                handleLeaveRoom(socket, socket.currentPageId, io);
            }
            console.log(`🔌 Socket disconnected: ${socket.id}`);
        });
    });
};

function handleLeaveRoom(socket, pageId, io) {
    const roomKey = `${socket.tenantId}:page:${pageId}`;
    socket.leave(roomKey);

    if (activeEditors.has(pageId)) {
        activeEditors.get(pageId).delete(socket.id);
        if (activeEditors.get(pageId).size === 0) {
            activeEditors.delete(pageId);
        } else {
            const editors = [...activeEditors.get(pageId).values()];
            io.to(roomKey).emit("editors:update", { pageId, editors });
        }
    }
}
