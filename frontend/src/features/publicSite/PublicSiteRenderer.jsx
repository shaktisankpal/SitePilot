import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api.js";

// ─── Section renderers ────────────────────────────────────────────────────────

const NavbarSection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "rgba(15, 15, 26, 0.9)";
    const textColor = props.textColor || "#c0c0e0";
    const font = props.fontFamily || branding?.font;
    return (
        <nav style={{
            position: "sticky", top: 0, zIndex: 100,
            background: bg, backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "0 32px",
            fontFamily: font ? `"${font}", sans-serif` : undefined,
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto", height: "64px" }}>
                <span style={{ fontWeight: "700", fontSize: "20px", color: accent }}>
                    {props.brand || "Brand"}
                </span>
                <div style={{ display: "flex", gap: "28px" }}>
                    {(props.links || []).map((link, i) => (
                        <a key={i} href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                            style={{ color: textColor, textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

const HeroSection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const secondary = props.secondaryColor || branding?.secondaryColor || "#8b5cf6";
    const bg = props.bgColor;
    const textColor = props.textColor || "#f0f0ff";
    const font = props.fontFamily || branding?.font;
    return (
        <section style={{
            minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "80px 32px",
            background: bg
                ? bg
                : props.backgroundImage
                    ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${props.backgroundImage}) center/cover`
                    : `radial-gradient(ellipse at 50% 0%, ${accent}30 0%, transparent 70%)`,
            fontFamily: font ? `"${font}", sans-serif` : undefined,
        }}>
            <div style={{ maxWidth: "800px" }}>
                <h1 style={{
                    fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: "900", lineHeight: "1.2",
                    marginBottom: "24px",
                    background: `linear-gradient(135deg, ${accent}, ${secondary}, #ec4899)`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                    {props.heading || "Welcome"}
                </h1>
                {props.subheading && (
                    <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: textColor === "#f0f0ff" ? "#a0a0c0" : textColor, marginBottom: "40px", lineHeight: "1.7", opacity: 0.85 }}>
                        {props.subheading}
                    </p>
                )}
                {props.ctaText && (
                    <a href={props.ctaLink || "#"}
                        style={{
                            display: "inline-flex", alignItems: "center", padding: "16px 40px",
                            borderRadius: "12px", fontSize: "16px", fontWeight: "600", textDecoration: "none",
                            background: `linear-gradient(135deg, ${accent}, ${secondary})`,
                            color: "white", boxShadow: `0 8px 30px ${accent}40`,
                        }}
                    >
                        {props.ctaText} →
                    </a>
                )}
            </div>
        </section>
    );
};

const TextSection = ({ props, branding }) => {
    const bg = props.bgColor || "transparent";
    const textColor = props.textColor || "#f0f0ff";
    const font = props.fontFamily || branding?.font;
    return (
        <section style={{
            padding: "80px 32px", maxWidth: "800px", margin: "0 auto",
            background: bg,
            fontFamily: font ? `"${font}", sans-serif` : undefined,
        }}>
            {props.heading && (
                <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "20px", color: textColor }}>
                    {props.heading}
                </h2>
            )}
            {props.description && (
                <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: textColor, opacity: 0.75 }}>
                    {props.description}
                </p>
            )}
        </section>
    );
};

const GallerySection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const secondary = props.secondaryColor || branding?.secondaryColor || "#8b5cf6";
    const bg = props.bgColor || "transparent";
    const textColor = props.textColor || "#f0f0ff";
    const font = props.fontFamily || branding?.font;
    return (
        <section style={{
            padding: "80px 32px", maxWidth: "1200px", margin: "0 auto",
            background: bg,
            fontFamily: font ? `"${font}", sans-serif` : undefined,
        }}>
            {props.heading && (
                <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "40px", textAlign: "center", color: textColor }}>
                    {props.heading}
                </h2>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
                {(props.items || []).map((item, i) => (
                    <div key={i} style={{
                        height: "200px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
                        background: `linear-gradient(135deg, ${accent}20, ${secondary}20)`,
                        border: `1px solid ${accent}30`,
                        color: textColor, fontSize: "14px", fontWeight: "500", opacity: 0.75,
                    }}>
                        {item}
                    </div>
                ))}
            </div>
        </section>
    );
};

const CTASection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const secondary = props.secondaryColor || branding?.secondaryColor || "#8b5cf6";
    const bg = props.bgColor || `linear-gradient(135deg, ${accent}15, ${secondary}15)`;
    const textColor = props.textColor || "#f0f0ff";
    const font = props.fontFamily || branding?.font;
    return (
        <section style={{
            padding: "80px 32px", textAlign: "center",
            background: bg,
            fontFamily: font ? `"${font}", sans-serif` : undefined,
        }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                {props.heading && <h2 style={{ fontSize: "2.2rem", fontWeight: "800", color: textColor, marginBottom: "12px" }}>{props.heading}</h2>}
                {props.subheading && <p style={{ color: textColor, opacity: 0.65, fontSize: "1.1rem", marginBottom: "32px" }}>{props.subheading}</p>}
                {props.ctaText && (
                    <a href={props.ctaLink || "#"}
                        style={{
                            display: "inline-flex", padding: "14px 36px", borderRadius: "12px",
                            background: `linear-gradient(135deg, ${accent}, ${secondary})`,
                            color: "white", fontWeight: "600", fontSize: "15px", textDecoration: "none",
                            boxShadow: `0 6px 25px ${accent}40`,
                        }}
                    >
                        {props.ctaText}
                    </a>
                )}
            </div>
        </section>
    );
};

const ContactFormSection = ({ props, branding, websiteId }) => {
    const fields = props.fields || ["name", "email", "message"];
    const initialFormData = fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {});
    
    const [formData, setFormData] = useState(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const secondary = props.secondaryColor || branding?.secondaryColor || "#8b5cf6";
    const bg = props.bgColor || "transparent";
    const textColor = props.textColor || "#f0f0ff";
    const font = props.fontFamily || branding?.font;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        if (!websiteId) {
            setError("Website ID not found. Please refresh the page.");
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`/api/public/forms/submit/${websiteId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitted(true);
                setFormData(initialFormData);
            } else {
                setError(result.message || "Submission failed");
            }
        } catch (err) {
            setError("Failed to submit form. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <section id="contact" style={{
                padding: "80px 32px", maxWidth: "640px", margin: "0 auto",
                background: bg,
                fontFamily: font ? `"${font}", sans-serif` : undefined,
            }}>
                <div style={{
                    textAlign: "center", padding: "60px 40px", borderRadius: "16px",
                    background: `linear-gradient(135deg, ${accent}15, ${secondary}15)`,
                    border: `1px solid ${accent}30`,
                }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: textColor, marginBottom: "12px" }}>
                        Your details have been confirmed!
                    </h3>
                    <p style={{ color: textColor, opacity: 0.7 }}>
                        We'll get back to you soon.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" style={{
            padding: "80px 32px", maxWidth: "640px", margin: "0 auto",
            background: bg,
            fontFamily: font ? `"${font}", sans-serif` : undefined,
        }}>
            {props.heading && <h2 style={{ fontSize: "2rem", fontWeight: "700", color: textColor, marginBottom: "32px", textAlign: "center" }}>{props.heading}</h2>}
            
            {error && (
                <div style={{
                    padding: "12px 16px", borderRadius: "8px", marginBottom: "16px",
                    background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444", fontSize: "14px",
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {fields.map((field) => {
                    const fieldName = field.toLowerCase();
                    const isTextarea = fieldName.includes("message") || fieldName.includes("comment") || fieldName.includes("details");
                    const inputType = fieldName.includes("email") ? "email" : fieldName.includes("phone") ? "tel" : "text";
                    
                    return isTextarea ? (
                        <textarea
                            key={fieldName}
                            name={fieldName}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            rows={5}
                            value={formData[fieldName] || ""}
                            onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                            style={{
                                padding: "14px", borderRadius: "12px",
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                color: textColor, fontSize: "14px", outline: "none", resize: "none",
                            }}
                        />
                    ) : (
                        <input
                            key={fieldName}
                            type={inputType}
                            name={fieldName}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={formData[fieldName] || ""}
                            onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                            style={{
                                padding: "14px", borderRadius: "12px",
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                color: textColor, fontSize: "14px", outline: "none",
                            }}
                        />
                    );
                })}
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        padding: "14px", borderRadius: "12px",
                        background: submitting ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg, ${accent}, ${secondary})`,
                        color: "white", fontWeight: "600", fontSize: "15px", border: "none",
                        cursor: submitting ? "not-allowed" : "pointer",
                        opacity: submitting ? 0.6 : 1,
                    }}
                >
                    {submitting ? "Sending..." : "Send Message"}
                </button>
            </form>
        </section>
    );
};

const FooterSection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "rgba(0,0,0,0.3)";
    const textColor = props.textColor || "#606090";
    const font = props.fontFamily || branding?.font;
    return (
        <footer style={{
            padding: "32px", textAlign: "center", color: textColor, fontSize: "14px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: bg,
            fontFamily: font ? `"${font}", sans-serif` : undefined,
        }}>
            {props.text || `© ${new Date().getFullYear()} All rights reserved.`}
            <span style={{ marginLeft: "16px", color: accent }}>
                Built with SitePilot
            </span>
        </footer>
    );
};

// Section registry
export const SECTION_MAP = {
    Navbar: NavbarSection,
    Hero: HeroSection,
    Text: TextSection,
    Gallery: GallerySection,
    CTA: CTASection,
    ContactForm: ContactFormSection,
    Footer: FooterSection,
};

// ─── Main Public Site Renderer ────────────────────────────────────────────────
export default function PublicSiteRenderer() {
    const { tenantSlug, pageSlug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [siteData, setSiteData] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const slug = tenantSlug || window.location.hostname.split(".")[0];
        const websiteId = searchParams.get("websiteId");
        const url = websiteId ? `/public/sites/${slug}?websiteId=${websiteId}` : `/public/sites/${slug}`;
        
        console.log("🔍 Fetching site from:", url);
        console.log("   Tenant slug:", slug);
        console.log("   Website ID param:", websiteId);
        
        api.get(url)
            .then((res) => {
                console.log("✅ API Response:", res.data);
                console.log("   Pages count:", res.data.pages?.length);
                console.log("   Website object:", res.data.website);
                console.log("   Website._id:", res.data.website?._id);
                console.log("   Type of _id:", typeof res.data.website?._id);
                
                setSiteData(res.data);
                const home = res.data.pages.find((p) => p.isHomePage) || res.data.pages[0];
                setCurrentPage(home);
            })
            .catch((err) => {
                console.error("❌ API Error:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Site not found");
            })
            .finally(() => setLoading(false));
    }, [tenantSlug, searchParams]);

    useEffect(() => {
        if (!siteData || !pageSlug) return;
        const found = siteData.pages.find((p) => p.slug === pageSlug);
        if (found) setCurrentPage(found);
    }, [pageSlug, siteData]);

    // Apply branding CSS variables
    useEffect(() => {
        if (siteData?.tenant?.branding) {
            const { primaryColor, secondaryColor, font } = siteData.tenant.branding;
            if (primaryColor) document.documentElement.style.setProperty("--color-primary", primaryColor);
            if (secondaryColor) document.documentElement.style.setProperty("--color-secondary", secondaryColor);
            if (font) document.documentElement.style.setProperty("--font-family", `"${font}", sans-serif`);
        }
    }, [siteData]);

    if (loading) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", border: "3px solid #6366f1", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <p style={{ color: "#a0a0c0" }}>Loading site...</p>
            </div>
        </div>
    );

    if (error) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a" }}>
            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#6366f1", marginBottom: "16px" }}>404</h1>
                <p style={{ color: "#a0a0c0", marginBottom: "24px" }}>{error}</p>
                <a href="/" style={{ color: "#6366f1", textDecoration: "none" }}>← Go home</a>
            </div>
        </div>
    );

    const branding = siteData?.tenant?.branding;
    const sections = currentPage?.layoutConfig?.sections || [];
    
    // Get websiteId from URL query param (most reliable) or fallback to page data
    const websiteIdFromUrl = searchParams.get("websiteId");
    const websiteId = websiteIdFromUrl || 
                      siteData?.website?._id || 
                      currentPage?.websiteId || 
                      siteData?.pages?.[0]?.websiteId;

    console.log("✅ Website ID:", websiteId, "(from URL:", websiteIdFromUrl, ")");

    return (
        <div style={{ minHeight: "100vh", background: "#0f0f1a", fontFamily: `"${branding?.font || "Google Sans"}", "DM Sans", sans-serif`, color: "#f0f0ff" }}>
            {/* Page navigation (multi-page) */}
            {siteData?.pages?.length > 1 && (
                <div style={{
                    display: "flex", gap: "4px", padding: "8px 32px",
                    background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}>
                    {siteData.pages.map((page) => (
                        <button key={page._id}
                            onClick={() => setCurrentPage(page)}
                            style={{
                                padding: "4px 14px", borderRadius: "6px", fontSize: "12px",
                                background: currentPage?._id === page._id ? `${branding?.primaryColor || "#6366f1"}20` : "transparent",
                                border: currentPage?._id === page._id ? `1px solid ${branding?.primaryColor || "#6366f1"}50` : "1px solid transparent",
                                color: currentPage?._id === page._id ? branding?.primaryColor || "#6366f1" : "#606090",
                                cursor: "pointer",
                            }}
                        >
                            {page.title}
                        </button>
                    ))}
                </div>
            )}

            {/* Render sections */}
            {sections
                .sort((a, b) => a.order - b.order)
                .map((section) => {
                    const Component = SECTION_MAP[section.type];
                    if (!Component) return null;
                    return <Component key={section.id} props={section.props || {}} branding={branding} websiteId={websiteId} />;
                })}

            {sections.length === 0 && (
                <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ color: "#606090" }}>This page has no content yet.</p>
                </div>
            )}
        </div>
    );
}
