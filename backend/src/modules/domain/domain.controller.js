import Domain from "./domain.model.js";
import Tenant from "../tenant/tenant.model.js";
import Website from "../website/website.model.js";
import Page from "../builder/page.model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * GET /api/domains
 * List domains for the current tenant
 */
export const getDomains = async (req, res) => {
    const domains = await Domain.find({ ...req.tenantFilter }).lean();
    res.json({ success: true, domains });
};

/**
 * POST /api/domains
 * Add a custom domain to a website
 */
export const addDomain = async (req, res) => {
    const { domain, websiteId } = req.body;
    if (!domain) return res.status(400).json({ success: false, message: "domain is required" });

    const existing = await Domain.findOne({ domain: domain.toLowerCase() });
    if (existing) {
        return res.status(409).json({ success: false, message: "Domain already registered" });
    }

    const domainDoc = await Domain.create({
        tenantId: req.tenantId,
        websiteId: websiteId || null,
        domain: domain.toLowerCase(),
        verificationToken: uuidv4(),
        verified: false,
    });

    res.status(201).json({
        success: true,
        domain: domainDoc,
        verificationInstructions: `Add a TXT record to your DNS: sitepilot-verify=${domainDoc.verificationToken}`,
    });
};

/**
 * POST /api/domains/:id/verify
 * Simulate domain verification
 */
export const verifyDomain = async (req, res) => {
    const domain = await Domain.findOne({ _id: req.params.id, ...req.tenantFilter });
    if (!domain) return res.status(404).json({ success: false, message: "Domain not found" });

    // In production, this would do actual DNS TXT lookup
    // Simulated: mark as verified
    domain.verified = true;
    await domain.save();

    res.json({ success: true, message: "Domain verified successfully", domain });
};

/**
 * DELETE /api/domains/:id
 */
export const deleteDomain = async (req, res) => {
    const domain = await Domain.findOne({ _id: req.params.id, ...req.tenantFilter });
    if (!domain) return res.status(404).json({ success: false, message: "Domain not found" });
    if (domain.isDefault) return res.status(400).json({ success: false, message: "Cannot delete default domain" });

    await domain.deleteOne();
    res.json({ success: true, message: "Domain removed" });
};

/**
 * GET /api/public/resolve?hostname=tenantname.localhost
 * Used by frontend to resolve tenant from hostname — public endpoint
 */
export const resolveHostname = async (req, res) => {
    const { hostname } = req.query;
    if (!hostname) return res.status(400).json({ success: false, message: "hostname required" });

    // Try to resolve via domain record
    const domainDoc = await Domain.findOne({ domain: hostname.toLowerCase(), verified: true });

    let tenant = null;

    if (domainDoc) {
        tenant = await Tenant.findById(domainDoc.tenantId).lean();
    } else {
        // Try subdomain: tenantslug.localhost
        const parts = hostname.split(".");
        if (parts.length >= 2) {
            const slug = parts[0];
            tenant = await Tenant.findOne({ slug }).lean();
        }
    }

    if (!tenant || !tenant.isActive) {
        return res.status(404).json({ success: false, message: "Tenant not found for this domain" });
    }

    // Find published website
    const website = await Website.findOne({ tenantId: tenant._id, status: "published" })
        .sort({ publishedAt: -1 })
        .lean();

    if (!website) {
        return res.status(404).json({ success: false, message: "No published website found" });
    }

    // Find homepage
    const homepage = await Page.findOne({
        websiteId: website._id,
        tenantId: tenant._id,
        isHomePage: true,
        status: "published",
    }).lean();

    res.json({
        success: true,
        tenant: {
            id: tenant._id,
            name: tenant.name,
            slug: tenant.slug,
            branding: tenant.branding,
        },
        website: { id: website._id, name: website.name },
        homepage,
    });
};

/**
 * GET /api/public/sites/:tenantSlug/pages/:slug
 * Fetch a specific published page — public endpoint
 */
export const getPublicPage = async (req, res) => {
    const tenant = await Tenant.findOne({ slug: req.params.tenantSlug, isActive: true }).lean();
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" });

    const website = await Website.findOne({ tenantId: tenant._id, status: "published" })
        .sort({ publishedAt: -1 })
        .lean();

    if (!website) return res.status(404).json({ success: false, message: "No published website" });

    const page = await Page.findOne({
        tenantId: tenant._id,
        websiteId: website._id,
        slug: req.params.slug,
        status: "published",
    }).lean();

    if (!page) return res.status(404).json({ success: false, message: "Page not found" });

    res.json({ success: true, tenant: { branding: tenant.branding }, page });
};

/**
 * GET /api/public/sites/:tenantSlug
 * Full published site for public rendering
 */
export const getPublicSite = async (req, res) => {
    const tenant = await Tenant.findOne({ slug: req.params.tenantSlug, isActive: true }).lean();
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" });

    const website = await Website.findOne({ tenantId: tenant._id, status: "published" })
        .sort({ publishedAt: -1 })
        .lean();

    if (!website) return res.status(404).json({ success: false, message: "No published website" });

    const pages = await Page.find({
        tenantId: tenant._id,
        websiteId: website._id,
        status: "published",
    })
        .select("title slug isHomePage layoutConfig")
        .lean();

    res.json({
        success: true,
        tenant: { name: tenant.name, slug: tenant.slug, branding: tenant.branding },
        website: { name: website.name },
        pages,
    });
};
