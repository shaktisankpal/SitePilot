import Website from "../website/website.model.js";
import Page from "../builder/page.model.js";
import AIUsageLog from "../ai/aiUsageLog.model.js";
import ActivityLog from "./activityLog.model.js";
import Deployment from "../deployment/deployment.model.js";
import User from "../auth/user.model.js";

/**
 * GET /api/analytics/dashboard
 * Returns dashboard stats for current tenant
 */
export const getDashboardStats = async (req, res) => {
    const tenantId = req.tenantId;

    const [websiteCount, pageCount, aiUsageCount, deploymentCount, userCount, recentActivity, recentDeployments] =
        await Promise.all([
            Website.countDocuments({ tenantId }),
            Page.countDocuments({ tenantId }),
            AIUsageLog.countDocuments({ tenantId }),
            Deployment.countDocuments({ tenantId }),
            User.countDocuments({ tenantId, isActive: true }),
            ActivityLog.find({ tenantId })
                .populate("userId", "name email")
                .sort({ createdAt: -1 })
                .limit(20)
                .lean(),
            Deployment.find({ tenantId })
                .populate("deployedBy", "name email")
                .populate("websiteId", "name")
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
        ]);

    res.json({
        success: true,
        stats: {
            websiteCount,
            pageCount,
            aiUsageCount,
            deploymentCount,
            userCount,
        },
        recentActivity,
        recentDeployments,
    });
};

/**
 * GET /api/analytics/activity
 */
export const getActivityLogs = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
        ActivityLog.find({ ...req.tenantFilter })
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        ActivityLog.countDocuments({ ...req.tenantFilter }),
    ]);

    res.json({ success: true, logs, total, page: parseInt(page), limit: parseInt(limit) });
};
