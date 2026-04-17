import Tenant from "./tenant.model.js";
import Website from "../website/website.model.js";
import { logActivity } from "../../middleware/logger.middleware.js";

/**
 * GET /api/tenant
 * Get current tenant settings
 */
export const getTenant = async (req, res) => {
    const tenant = await Tenant.findById(req.tenantId).lean();
    res.json({ success: true, tenant });
};

/**
 * PUT /api/tenant/branding
 * OWNER updates branding (colors, font, logo)
 */
export const updateBranding = async (req, res) => {
    const { primaryColor, secondaryColor, font, logo } = req.body;

    // Basic contrast validation helper
    const validateColor = (hex) => /^#[0-9A-Fa-f]{6}$/.test(hex);

    if (primaryColor && !validateColor(primaryColor)) {
        return res.status(400).json({ success: false, message: "Invalid primaryColor hex format" });
    }
    if (secondaryColor && !validateColor(secondaryColor)) {
        return res.status(400).json({ success: false, message: "Invalid secondaryColor hex format" });
    }

    const tenant = await Tenant.findById(req.tenantId);
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" });

    tenant.branding = {
        ...tenant.branding,
        ...(primaryColor && { primaryColor }),
        ...(secondaryColor && { secondaryColor }),
        ...(font && { font }),
        ...(logo !== undefined && { logo }),
    };
    await tenant.save();

    await logActivity({
        tenantId: req.tenantId,
        userId: req.user._id,
        action: "BRANDING_UPDATED",
        resource: "Tenant",
        resourceId: tenant._id,
        ip: req.ip,
    });

    res.json({ success: true, branding: tenant.branding });
};

/**
 * POST /api/tenant/logo
 * Upload tenant logo via multer
 */
export const uploadLogo = async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const logoUrl = `/uploads/${req.file.filename}`;
    const tenant = await Tenant.findById(req.tenantId);
    tenant.branding.logo = logoUrl;
    await tenant.save();

    res.json({ success: true, logo: logoUrl });
};

/**
 * PUT /api/tenant
 * OWNER updates workspace name and slug
 */
export const updateTenant = async (req, res) => {
    const { name, slug } = req.body;

    if (!name?.trim() || !slug?.trim()) {
        return res.status(400).json({ success: false, message: "Name and Slug are required" });
    }

    // Format slug
    const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const tenant = await Tenant.findById(req.tenantId);
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" });

    // Check slug uniqueness if it's changing
    if (formattedSlug !== tenant.slug) {
        const existing = await Tenant.findOne({ slug: formattedSlug });
        if (existing) {
            return res.status(409).json({ success: false, message: "This slug is already taken by another workspace" });
        }
    }

    const oldSlug = tenant.slug;
    tenant.name = name.trim();
    tenant.slug = formattedSlug;
    await tenant.save();

    // ── Cascade: rewrite website defaultDomains if slug changed ──────────
    let updatedWebsiteCount = 0;
    if (formattedSlug !== oldSlug) {
        const websites = await Website.find({ tenantId: req.tenantId });
        for (const site of websites) {
            if (site.defaultDomain && site.defaultDomain.includes(`.${oldSlug}.`)) {
                site.defaultDomain = site.defaultDomain.replace(`.${oldSlug}.`, `.${formattedSlug}.`);
                await site.save();
                updatedWebsiteCount++;
            }
        }
        console.log(`🔄 [Tenant] Cascaded slug rename: updated ${updatedWebsiteCount} website(s) from '${oldSlug}' → '${formattedSlug}'`);
    }

    await logActivity({
        tenantId: req.tenantId,
        userId: req.user._id,
        action: "TENANT_IDENTITY_UPDATED",
        resource: "Tenant",
        resourceId: tenant._id,
        details: { name: tenant.name, slug: tenant.slug, websitesUpdated: updatedWebsiteCount },
        ip: req.ip,
    });

    res.json({ success: true, tenant, websitesUpdated: updatedWebsiteCount });
};
