import { GoogleGenerativeAI } from "@google/generative-ai";
import Joi from "joi";
import AIUsageLog from "./aiUsageLog.model.js";
import Page from "../builder/page.model.js";
import Website from "../website/website.model.js";
import Tenant from "../tenant/tenant.model.js";
import { v4 as uuidv4 } from "uuid";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
});

const VALID_SECTION_TYPES = ["Hero", "Text", "Gallery", "CTA", "ContactForm", "Navbar", "Footer"];

// Joi schema to validate Gemini output
const aiLayoutSchema = Joi.object({
    pages: Joi.array()
        .items(
            Joi.object({
                title: Joi.string().required(),
                slug: Joi.string().required(),
                sections: Joi.array()
                    .items(
                        Joi.object({
                            type: Joi.string()
                                .valid(...VALID_SECTION_TYPES)
                                .required(),
                            props: Joi.any().default({}),
                        }).unknown(true)
                    )
                    .required(),
            }).unknown(true)
        )
        .min(1)
        .required(),
}).unknown(true);

const inputSchema = Joi.object({
    businessType: Joi.string().min(2).max(200).required(),
    tone: Joi.string().min(2).max(100).required(),
    targetAudience: Joi.string().min(2).max(200).required(),
    features: Joi.array().items(Joi.string()).min(1).required(),
    websiteId: Joi.string().allow("").optional(),
    primaryColor: Joi.string().allow("").optional(),
    secondaryColor: Joi.string().allow("").optional(),
});

/**
 * POST /api/ai/generate-layout
 */
export const generateLayout = async (req, res) => {
    const { error, value } = inputSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { businessType, tone, targetAudience, features, websiteId, primaryColor, secondaryColor } = value;

    // Verify website ownership if provided
    let website = null;
    if (websiteId) {
        website = await Website.findOne({ _id: websiteId, tenantId: req.tenantId });
        if (!website) return res.status(404).json({ success: false, message: "Website not found" });
    }

    const prompt = `
You are a professional website layout designer. Generate a complete website layout structure as valid JSON.

Business Type: ${businessType}
Tone: ${tone}
Target Audience: ${targetAudience}
Key Features/Sections needed: ${features.join(", ")}

Return ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "pages": [
    {
      "title": "Page Title",
      "slug": "page-slug",
      "sections": [
        {
          "type": "SectionType",
          "props": {
            "heading": "...",
            "subheading": "...",
            "description": "...",
            "ctaText": "...",
            "ctaLink": "#",
            "items": [],
            "brand": "Business Name",
            "links": ["Home", "About", "Services", "Contact"],
            "text": "..."
          }
        }
      ]
    }
  ]
}

Allowed section types ONLY: Hero, Text, Gallery, CTA, ContactForm, Navbar, Footer
- Every page MUST start with Navbar and end with Footer
- Hero section must have: heading, subheading, ctaText, ctaLink
- Text section must have: heading, description
- Gallery section must have: heading, items (array of image descriptions)
- CTA section must have: heading, subheading, ctaText, ctaLink
- ContactForm section must have: heading, fields (array: name, email, message)
- Navbar must have: brand, links (array of strings)
- Footer must have: text (copyright text)

Generate at least 3 pages: Home, About, Contact. Add more relevant pages based on the business type.
`.trim();

    let aiResponse = null;
    let success = true;
    let errorMessage = null;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Extract JSON from response (handle potential markdown code blocks)
        let jsonStr = text;
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        } else {
            // Try to find raw JSON object
            const objMatch = text.match(/\{[\s\S]*\}/);
            if (objMatch) jsonStr = objMatch[0];
        }

        let parsed;
        try {
            parsed = JSON.parse(jsonStr.trim());
        } catch {
            throw new Error("Gemini returned invalid JSON");
        }

        // Validate structure
        const { error: valErr, value: validated } = aiLayoutSchema.validate(parsed);
        if (valErr) {
            throw new Error(`Invalid AI layout structure: ${valErr.details[0].message}`);
        }

        aiResponse = validated;

        // If websiteId provided, save pages to DB
        if (website) {
            for (const pageData of validated.pages) {
                const sectionsWithIds = pageData.sections.map((s, idx) => ({
                    id: uuidv4(),
                    type: s.type,
                    props: {
                        ...(s.props || {}),
                        accentColor: primaryColor || undefined,
                        secondaryColor: secondaryColor || undefined,
                    },
                    order: idx,
                }));

                const existing = await Page.findOne({
                    websiteId: website._id,
                    slug: pageData.slug.toLowerCase(),
                    tenantId: req.tenantId,
                });

                if (existing) {
                    existing.layoutConfig.sections = sectionsWithIds;
                    existing.title = pageData.title;
                    existing.status = "draft";
                    await existing.save();
                } else {
                    await Page.create({
                        tenantId: req.tenantId,
                        websiteId: website._id,
                        title: pageData.title,
                        slug: pageData.slug.toLowerCase(),
                        isHomePage: pageData.slug.toLowerCase() === "home",
                        layoutConfig: { sections: sectionsWithIds },
                        createdBy: req.user._id,
                    });
                }
            }
        }
    } catch (err) {
        success = false;
        errorMessage = err.message;
        console.error("Gemini Error:", err.message);
    }

    // Log AI usage regardless of success
    await AIUsageLog.create({
        tenantId: req.tenantId,
        userId: req.user._id,
        websiteId: websiteId || null,
        prompt: { businessType, tone, targetAudience, features },
        response: aiResponse,
        model: "gemini-3-flash-preview",
        success,
        errorMessage,
    });

    if (!success) {
        return res.status(502).json({ success: false, message: errorMessage });
    }

    res.json({ success: true, layout: aiResponse, savedToWebsite: !!websiteId });
};

/**
 * GET /api/ai/logs
 */
export const getAILogs = async (req, res) => {
    const logs = await AIUsageLog.find({ ...req.tenantFilter })
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
    res.json({ success: true, logs });
};
