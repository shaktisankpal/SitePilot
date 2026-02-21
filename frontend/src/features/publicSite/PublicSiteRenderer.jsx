import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api.js";

export const globalResponsiveCss = `
.responsive-master-container {
    container-type: inline-size;
    container-name: site-container;
}
.responsive-master-container * {
    box-sizing: border-box !important;
}
.responsive-master-container section {
    max-width: 100cqi !important;
    overflow-x: hidden !important;
}
@container site-container (max-width: 1024px) {
    .responsive-master-container div[style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
    }
}
@container site-container (max-width: 768px) {
    .responsive-master-container section {
        padding-left: 20px !important;
        padding-right: 20px !important;
    }
    .responsive-master-container h1 {
        font-size: clamp(2.5rem, 8vw, 3rem) !important;
    }
    .responsive-master-container h2 {
        font-size: clamp(2rem, 6vw, 2.5rem) !important;
    }
    .responsive-master-container div[style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
        gap: 32px !important;
    }
    .responsive-master-container nav {
        padding-left: 20px !important;
        padding-right: 20px !important;
    }
    .responsive-master-container nav > div {
        flex-direction: column !important;
        gap: 16px !important;
        text-align: center !important;
    }
    .responsive-master-container nav > div > div {
        flex-wrap: wrap !important;
        justify-content: center !important;
    }
    .responsive-master-container footer div[style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
        text-align: center !important;
    }
}
`;

// ─── Section renderers ────────────────────────────────────────────────────────

const NavbarSection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#000000";
    const bg = props.bgColor || "rgba(255, 255, 255, 0.9)";
    const textColor = props.textColor || "#111827";
    const font = props.fontFamily || branding?.font;
    const isDark = textColor === "#ffffff" || textColor === "#f0f0ff" || textColor?.toLowerCase()?.includes("fff");
    const variant = props.variant || "Glassy Island";

    const baseFont = font ? `"${font}", sans-serif` : "system-ui, sans-serif";

    if (variant === "Full Width Solid") {
        return (
            <nav style={{ position: "sticky", top: 0, zIndex: 100, background: bg, borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`, padding: "20px 48px", fontFamily: baseFont }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
                    <span style={{ fontWeight: "900", fontSize: "24px", color: accent }}>{props.brand || "Brand"}</span>
                    <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
                        {(props.links || []).map((l, i) => <a key={i} href={`#${l.toLowerCase().replace(/\s/g, "-")}`} style={{ color: textColor, textDecoration: "none", fontSize: "15px", fontWeight: "600", opacity: 0.9 }}>{l}</a>)}
                        <button style={{ background: accent, color: "#fff", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: `0 4px 12px ${accent}40` }}>Get Started</button>
                    </div>
                </div>
            </nav>
        );
    }

    if (variant === "Minimal Transparent") {
        return (
            <nav style={{ padding: "32px 48px", background: "transparent", fontFamily: baseFont, position: "absolute", top: 0, left: 0, right: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
                    <span style={{ fontWeight: "800", fontSize: "20px", color: textColor, letterSpacing: "2px", textTransform: "uppercase" }}>{props.brand || "Brand"}</span>
                    <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
                        {(props.links || []).map((l, i) => <a key={i} href={`#${l.toLowerCase().replace(/\s/g, "-")}`} style={{ color: textColor, textDecoration: "none", fontSize: "13px", fontWeight: "700", opacity: 0.8, textTransform: "uppercase", letterSpacing: "1px" }}>{l}</a>)}
                    </div>
                </div>
            </nav>
        );
    }

    // Default: Glassy Island
    return (
        <div style={{ padding: "16px", position: "sticky", top: 0, zIndex: 100 }}>
            <nav style={{ background: bg, backdropFilter: "blur(20px)", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`, borderRadius: "100px", padding: "16px 32px", fontFamily: baseFont, maxWidth: "1000px", margin: "0 auto", boxShadow: `0 20px 40px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)"}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "800", fontSize: "22px", color: accent, letterSpacing: "-0.02em" }}>{props.brand || "Brand"}</span>
                    <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
                        {(props.links || []).map((link, i) => <a key={i} href={`#${link.toLowerCase().replace(/\s/g, "-")}`} style={{ color: textColor, textDecoration: "none", fontSize: "14px", fontWeight: "600", opacity: 0.8 }}>{link}</a>)}
                        <button style={{ background: accent, color: "#fff", border: "none", padding: "12px 28px", borderRadius: "50px", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: `0 8px 16px ${accent}40` }}>Get Started</button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

const HeroSection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#ffffff";
    const textColor = props.textColor || "#111827";
    const font = props.fontFamily || branding?.font;
    const isDark = textColor === "#ffffff" || textColor === "#f0f0ff" || textColor?.toLowerCase()?.includes("fff");
    const variant = props.variant || "Split Text Left";
    const baseFont = font ? `"${font}", sans-serif` : "system-ui, sans-serif";

    if (variant === "Centered Image Bg") {
        return (
            <section style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "120px 32px", minHeight: "80vh", background: "#000", overflow: "hidden", fontFamily: baseFont, textAlign: "center" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${props.backgroundImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1500&q=80"})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.5 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }} />
                <div style={{ position: "relative", zIndex: 2, maxWidth: "800px" }}>
                    <h1 style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)", fontWeight: "900", color: "#fff", marginBottom: "24px", letterSpacing: "-0.03em", lineHeight: "1.05", textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>{props.heading || "Revolutionary Design"}</h1>
                    {props.subheading && <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", marginBottom: "40px", lineHeight: "1.6" }}>{props.subheading}</p>}
                    {props.ctaText && <a href={props.ctaLink || "#"} style={{ display: "inline-block", padding: "18px 48px", borderRadius: "8px", background: accent, color: "white", fontWeight: "700", fontSize: "16px", textDecoration: "none", boxShadow: `0 8px 32px ${accent}60` }}>{props.ctaText}</a>}
                </div>
            </section>
        );
    }

    if (variant === "Split Text Right") {
        return (
            <section style={{ display: "flex", alignItems: "center", padding: "80px 32px", background: bg, minHeight: "85vh", fontFamily: baseFont }}>
                <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                        <img src={props.backgroundImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"} alt="Hero" style={{ width: "100%", height: "auto", borderRadius: "32px", boxShadow: `0 24px 48px ${isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)"}`, objectFit: "cover", aspectRatio: "4/5" }} />
                    </div>
                    <div>
                        <div style={{ display: "inline-block", padding: "8px 16px", borderRadius: "8px", background: `${accent}15`, color: accent, fontWeight: "700", fontSize: "12px", marginBottom: "24px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Featured Update</div>
                        <h1 style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px", color: textColor }}>{props.heading || "Revolutionary Design"}</h1>
                        {props.subheading && <p style={{ fontSize: "1.25rem", color: textColor, marginBottom: "40px", lineHeight: "1.6", opacity: 0.7 }}>{props.subheading}</p>}
                        {props.ctaText && <a href={props.ctaLink || "#"} style={{ display: "inline-flex", padding: "16px 36px", borderRadius: "8px", fontSize: "16px", fontWeight: "700", textDecoration: "none", background: textColor, color: bg, boxShadow: `0 8px 24px rgba(0,0,0,0.2)` }}>{props.ctaText}</a>}
                    </div>
                </div>
            </section>
        );
    }

    // Default: Split Text Left
    return (
        <section style={{ display: "flex", alignItems: "center", padding: "80px 32px", background: bg, minHeight: "85vh", fontFamily: baseFont }}>
            <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
                <div style={{ zIndex: 2 }}>
                    <div style={{ display: "inline-block", padding: "8px 16px", borderRadius: "50px", background: `${accent}15`, color: accent, fontWeight: "700", fontSize: "12px", marginBottom: "24px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Top Tier Design</div>
                    <h1 style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px", color: textColor, letterSpacing: "-0.03em" }}>{props.heading || "Revolutionary Design"}</h1>
                    {props.subheading && <p style={{ fontSize: "1.25rem", color: textColor, marginBottom: "40px", lineHeight: "1.6", opacity: 0.7, maxWidth: "500px" }}>{props.subheading}</p>}
                    {props.ctaText && <a href={props.ctaLink || "#"} style={{ display: "inline-flex", padding: "16px 36px", borderRadius: "50px", fontSize: "16px", fontWeight: "700", textDecoration: "none", background: accent, color: "white", boxShadow: `0 8px 24px ${accent}40` }}>{props.ctaText}</a>}
                </div>
                <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "120%", height: "120%", background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`, zIndex: 0, filter: "blur(40px)" }} />
                    <img src={props.backgroundImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"} alt="Hero" style={{ width: "100%", height: "auto", borderRadius: "32px", position: "relative", zIndex: 1, boxShadow: `0 24px 48px ${isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)"}`, objectFit: "cover", aspectRatio: "4/5" }} />
                </div>
            </div>
        </section>
    );
};

const TextSection = ({ props, branding }) => {
    const bg = props.bgColor || "#f9fafb";
    const textColor = props.textColor || "#111827";
    const font = props.fontFamily || branding?.font;
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const variant = props.variant || "Centered Standard";
    const baseFont = font ? `"${font}", sans-serif` : "system-ui, sans-serif";

    if (variant === "Left Aligned Big") {
        return (
            <section style={{ padding: "100px 32px", background: bg, fontFamily: baseFont }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "flex-start" }}>
                    {props.heading && <h2 style={{ fontSize: "3.5rem", fontWeight: "900", color: textColor, letterSpacing: "-0.03em", lineHeight: "1.1" }}>{props.heading}</h2>}
                    {props.description && <p style={{ fontSize: "1.25rem", lineHeight: "1.8", color: textColor, opacity: 0.8 }}>{props.description}</p>}
                </div>
            </section>
        );
    }
    if (variant === "Card Based") {
        return (
            <section style={{ padding: "80px 32px", background: "transparent", fontFamily: baseFont }}>
                <div style={{ maxWidth: "900px", margin: "0 auto", background: bg, padding: "60px", borderRadius: "32px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", textAlign: "center" }}>
                    <div style={{ width: "48px", height: "4px", background: accent, margin: "0 auto 24px", borderRadius: "2px" }} />
                    {props.heading && <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: textColor, marginBottom: "24px", letterSpacing: "-0.02em" }}>{props.heading}</h2>}
                    {props.description && <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: textColor, opacity: 0.75 }}>{props.description}</p>}
                </div>
            </section>
        );
    }
    // Default: Centered Standard
    return (
        <section style={{ padding: "120px 32px", background: bg, fontFamily: baseFont }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
                {props.heading && <h2 style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "24px", color: textColor, letterSpacing: "-0.02em" }}>{props.heading}</h2>}
                {props.description && <p style={{ fontSize: "1.25rem", lineHeight: "1.8", color: textColor, opacity: 0.75 }}>{props.description}</p>}
            </div>
        </section>
    );
};

const GallerySection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#ffffff";
    const textColor = props.textColor || "#111827";
    const font = props.fontFamily || branding?.font;
    const isDark = textColor === "#ffffff" || textColor === "#f0f0ff" || textColor?.toLowerCase()?.includes("fff");
    const variant = props.variant || "Bento Grid";
    const baseFont = font ? `"${font}", sans-serif` : "system-ui, sans-serif";

    if (variant === "Horizontal Flex") {
        return (
            <section style={{ padding: "80px 32px", background: bg, fontFamily: baseFont, overflow: "hidden" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    {props.heading && <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: textColor, marginBottom: "40px" }}>{props.heading}</h2>}
                    <div style={{ display: "flex", gap: "24px", overflowX: "auto", paddingBottom: "24px" }}>
                        {(props.items || []).map((item, i) => (
                            <div key={i} style={{ minWidth: "300px", background: isDark ? "rgba(255,255,255,0.05)" : "#f9fafb", padding: "32px", borderRadius: "24px", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}` }}>
                                <div style={{ fontSize: "2rem", marginBottom: "16px" }}>✨</div>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: textColor, marginBottom: "8px" }}>{item}</h3>
                                <p style={{ color: textColor, opacity: 0.6 }}>Modern solutions for today's complex challenges.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (variant === "Masonry Column") {
        return (
            <section style={{ padding: "100px 32px", background: bg, fontFamily: baseFont }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    {props.heading && <h2 style={{ fontSize: "3rem", fontWeight: "800", color: textColor, marginBottom: "48px", textAlign: "center" }}>{props.heading}</h2>}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
                        {(props.items || []).map((item, i) => (
                            <div key={i} style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#ffffff", padding: "40px 32px", borderRadius: "16px", borderTop: `4px solid ${accent}`, boxShadow: `0 12px 24px ${isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.05)"}` }}>
                                <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: textColor, marginBottom: "12px" }}>{item}</h3>
                                <p style={{ color: textColor, opacity: 0.7, lineHeight: "1.6" }}>Delivering unmatched durability and visual aesthetics across the board.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Default: Bento Grid
    return (
        <section style={{ padding: "100px 32px", background: bg, fontFamily: baseFont }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {props.heading && <h2 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "48px", color: textColor, letterSpacing: "-0.02em" }}>{props.heading}</h2>}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gridAutoRows: "280px", gap: "24px" }}>
                    {(props.items || []).map((item, i) => {
                        const getGridStyles = (idx) => {
                            if (idx % 5 === 0) return { gridColumn: "span 2", gridRow: "span 2" };
                            if (idx % 3 === 0) return { gridColumn: "span 2", gridRow: "span 1" };
                            return { gridColumn: "span 1", gridRow: "span 1" };
                        };
                        return (
                            <div key={i} style={{ ...getGridStyles(i), borderRadius: "32px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "32px", position: "relative", overflow: "hidden", background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, boxShadow: `0 12px 32px ${isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.03)"}` }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at top right, ${accent}15, transparent 70%)` }} />
                                <h3 style={{ color: textColor, fontSize: "1.5rem", fontWeight: "700", position: "relative", zIndex: 1 }}>{item}</h3>
                                <p style={{ color: textColor, opacity: 0.6, fontSize: "1rem", marginTop: "8px", position: "relative", zIndex: 1 }}>Exceptional quality and design.</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const CTASection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#ffffff";
    const textColor = props.textColor || "#111827";
    const font = props.fontFamily || branding?.font;
    const isDark = textColor === "#ffffff" || textColor === "#f0f0ff" || textColor?.toLowerCase()?.includes("fff");
    const variant = props.variant || "Centered Large";
    const baseFont = font ? `"${font}", sans-serif` : "system-ui, sans-serif";

    if (variant === "Floating Pill") {
        return (
            <section style={{ padding: "60px 32px", background: bg, fontFamily: baseFont }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 40px", borderRadius: "100px", background: accent, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", boxShadow: `0 20px 40px ${accent}40` }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#fff", margin: 0 }}>{props.heading || "Ready to dive in?"}</h2>
                    {props.ctaText && <a href={props.ctaLink || "#"} style={{ display: "inline-flex", padding: "12px 32px", borderRadius: "50px", background: "#fff", color: accent, fontWeight: "800", fontSize: "14px", textDecoration: "none" }}>{props.ctaText}</a>}
                </div>
            </section>
        );
    }

    if (variant === "Split Screen CTA") {
        return (
            <section style={{ padding: "0", background: bg, fontFamily: baseFont }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    <div style={{ padding: "120px 80px", background: accent, color: "#fff" }}>
                        {props.heading && <h2 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "20px", lineHeight: "1.1" }}>{props.heading}</h2>}
                        {props.subheading && <p style={{ fontSize: "1.25rem", opacity: 0.8 }}>{props.subheading}</p>}
                    </div>
                    <div style={{ padding: "120px 80px", display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? "rgba(0,0,0,0.2)" : "#f9fafb" }}>
                        {props.ctaText && <a href={props.ctaLink || "#"} style={{ display: "inline-flex", padding: "24px 64px", borderRadius: "12px", background: textColor, color: bg, fontWeight: "800", fontSize: "20px", textDecoration: "none", boxShadow: `0 12px 24px rgba(0,0,0,0.15)` }}>{props.ctaText}</a>}
                    </div>
                </div>
            </section>
        );
    }

    // Default: Centered Large
    return (
        <section style={{ padding: "80px 32px", background: bg, fontFamily: baseFont }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 48px", borderRadius: "40px", background: isDark ? "rgba(255,255,255,0.03)" : "#f4f4f5", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at center, ${accent}20 0%, transparent 70%)` }} />
                <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}>
                    {props.heading && <h2 style={{ fontSize: "3.5rem", fontWeight: "800", color: textColor, marginBottom: "20px", letterSpacing: "-0.03em", lineHeight: "1.1" }}>{props.heading}</h2>}
                    {props.subheading && <p style={{ color: textColor, opacity: 0.7, fontSize: "1.25rem", marginBottom: "40px", lineHeight: "1.6" }}>{props.subheading}</p>}
                    {props.ctaText && <a href={props.ctaLink || "#"} style={{ display: "inline-flex", padding: "18px 48px", borderRadius: "50px", background: accent, color: "white", fontWeight: "700", fontSize: "16px", textDecoration: "none", boxShadow: `0 12px 24px ${accent}40`, transition: "transform 0.2s" }}>{props.ctaText}</a>}
                </div>
            </div>
        </section>
    );
};

const ContactFormSection = ({ props, branding, websiteId }) => {
    const fields = props.fields || ["name", "email", "message"];
    const [formData, setFormData] = useState(fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {}));
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#ffffff";
    const textColor = props.textColor || "#111827";
    const font = props.fontFamily || branding?.font;
    const isDark = textColor === "#ffffff" || textColor === "#f0f0ff" || textColor?.toLowerCase()?.includes("fff");
    const variant = props.variant || "Left Text Right Form";
    const baseFont = font ? `"${font}", sans-serif` : "system-ui, sans-serif";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true); setError(null);
        if (!websiteId) { setError("Website ID not found. Please refresh."); setSubmitting(false); return; }
        try {
            const response = await fetch(`/api/public/forms/submit/${websiteId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            const result = await response.json();
            if (result.success) setSubmitted(true);
            else setError(result.message || "Submission failed");
        } catch (err) { setError("Failed to submit form. Please try again."); } finally { setSubmitting(false); }
    };

    if (submitted) {
        return (
            <section style={{ padding: "80px 32px", background: bg, fontFamily: baseFont }}>
                <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "60px 48px", borderRadius: "32px", background: isDark ? "rgba(255,255,255,0.03)" : "#f4f4f5", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: accent, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 24px" }}>✓</div>
                    <h3 style={{ fontSize: "2rem", fontWeight: "800", color: textColor, marginBottom: "16px" }}>Message Received</h3>
                    <p style={{ color: textColor, opacity: 0.7 }}>We'll get back to you shortly.</p>
                </div>
            </section>
        );
    }

    const renderForm = () => (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
            {fields.map((field) => {
                const fname = field.toLowerCase();
                const isTextarea = fname.includes("message") || fname.includes("comment");
                const type = fname.includes("email") ? "email" : "text";
                const styles = { padding: "16px 20px", borderRadius: "12px", width: "100%", background: isDark ? "rgba(255,255,255,0.05)" : "#ffffff", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, color: textColor, fontSize: "15px", outline: "none" };
                return isTextarea
                    ? <textarea key={fname} name={fname} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} rows={5} value={formData[fname] || ""} onChange={(e) => setFormData({ ...formData, [fname]: e.target.value })} style={{ ...styles, resize: "none" }} />
                    : <input key={fname} type={type} name={fname} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={formData[fname] || ""} onChange={(e) => setFormData({ ...formData, [fname]: e.target.value })} style={styles} />;
            })}
            <button type="submit" disabled={submitting} style={{ padding: "18px", borderRadius: "12px", background: submitting ? "gray" : accent, color: "white", fontWeight: "700", fontSize: "16px", border: "none", cursor: submitting ? "not-allowed" : "pointer" }}>{submitting ? "Sending..." : "Submit Inquiry"}</button>
        </form>
    );

    if (variant === "Centered Card") {
        return (
            <section style={{ padding: "100px 32px", background: bg, fontFamily: baseFont }}>
                <div style={{ maxWidth: "600px", margin: "0 auto", background: isDark ? "rgba(255,255,255,0.03)" : "#f4f4f5", padding: "60px", borderRadius: "40px", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                    <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: textColor, marginBottom: "40px", textAlign: "center", letterSpacing: "-0.02em" }}>{props.heading || "Contact Us"}</h2>
                    {error && <div style={{ padding: "16px", borderRadius: "16px", marginBottom: "24px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontWeight: "600" }}>{error}</div>}
                    {renderForm()}
                </div>
            </section>
        );
    }

    // Default: Left Text Right Form
    return (
        <section style={{ padding: "100px 32px", background: bg, fontFamily: baseFont }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
                <div>
                    <h2 style={{ fontSize: "3.5rem", fontWeight: "900", color: textColor, marginBottom: "24px", letterSpacing: "-0.03em" }}>{props.heading || "Let's Talk"}</h2>
                    <p style={{ fontSize: "1.25rem", color: textColor, opacity: 0.7, lineHeight: "1.6" }}>We'd love to hear from you. Fill out the form and our team will respond within 24 hours.</p>
                </div>
                <div style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#f9fafb", padding: "40px", borderRadius: "32px", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                    {error && <div style={{ padding: "16px", borderRadius: "16px", marginBottom: "24px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontWeight: "600" }}>{error}</div>}
                    {renderForm()}
                </div>
            </div>
        </section>
    );
};

const FooterSection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#000000";
    const textColor = props.textColor || "#9ca3af";
    const font = props.fontFamily || branding?.font;
    const isDark = textColor === "#ffffff" || textColor === "#f0f0ff" || textColor?.toLowerCase()?.includes("fff");
    const variant = props.variant || "Simple Centered";
    const baseFont = font ? `"${font}", sans-serif` : "system-ui, sans-serif";

    if (variant === "Multi-Column Mock") {
        return (
            <footer style={{ padding: "80px 32px 40px", background: bg, fontFamily: baseFont, borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "60px" }}>
                    <div>
                        <h3 style={{ fontSize: "20px", fontWeight: "800", color: textColor, marginBottom: "16px" }}>Company</h3>
                        <p style={{ color: textColor, opacity: 0.6, lineHeight: "1.6", maxWidth: "300px" }}>Building the future of digital experiences with uncompromising quality.</p>
                    </div>
                    <div><h4 style={{ color: textColor, fontWeight: "700", marginBottom: "16px" }}>Product</h4><p style={{ color: textColor, opacity: 0.6 }}>Features</p><p style={{ color: textColor, opacity: 0.6 }}>Pricing</p></div>
                    <div><h4 style={{ color: textColor, fontWeight: "700", marginBottom: "16px" }}>Resources</h4><p style={{ color: textColor, opacity: 0.6 }}>Blog</p><p style={{ color: textColor, opacity: 0.6 }}>Docs</p></div>
                    <div><h4 style={{ color: textColor, fontWeight: "700", marginBottom: "16px" }}>Legal</h4><p style={{ color: textColor, opacity: 0.6 }}>Privacy</p><p style={{ color: textColor, opacity: 0.6 }}>Terms</p></div>
                </div>
                <div style={{ textAlign: "center", color: textColor, opacity: 0.5, fontSize: "14px", paddingTop: "40px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                    {props.text || `© ${new Date().getFullYear()} All rights reserved.`}
                </div>
            </footer>
        );
    }

    if (variant === "Ultra Minimal") {
        return (
            <footer style={{ padding: "40px 32px", background: bg, fontFamily: baseFont, textAlign: "left" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", color: textColor, opacity: 0.6, fontSize: "14px", fontWeight: "500" }}>
                    <span>{props.text || `© ${new Date().getFullYear()} All rights reserved.`}</span>
                    <span>Designed with intention.</span>
                </div>
            </footer>
        );
    }

    // Default: Simple Centered
    return (
        <footer style={{ padding: "48px 32px", textAlign: "center", color: textColor, fontSize: "15px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, background: bg, fontFamily: baseFont, opacity: 0.9 }}>
            {props.text || `© ${new Date().getFullYear()} All rights reserved.`}
            <span style={{ marginLeft: "16px", fontWeight: "600", color: accent }}>Built with SitePilot</span>
        </footer>
    );
};

const ButtonSection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "transparent";
    const textColor = props.textColor || "#ffffff";
    const align = props.align || "center";
    const variant = props.variant || "Primary Pill";

    let btnStyles = { display: "inline-flex", padding: "16px 40px", borderRadius: "50px", background: accent, color: textColor, fontWeight: "700", fontSize: "16px", textDecoration: "none", boxShadow: `0 8px 16px ${accent}40`, transition: "all 0.2s" };

    if (variant === "Secondary Outline") btnStyles = { ...btnStyles, background: "transparent", color: accent, border: `2px solid ${accent}`, boxShadow: "none" };
    else if (variant === "Ghost Action") btnStyles = { ...btnStyles, background: "transparent", color: textColor, boxShadow: "none", opacity: 0.8, border: `1px solid transparent` };

    return (
        <section style={{ padding: "32px", background: bg, textAlign: align }}>
            <a href={props.link || "#"} style={btnStyles}>{props.text || "Click Me"}</a>
        </section>
    );
};

const SpacerSection = ({ props }) => {
    const bg = props.bgColor || "transparent";
    const height = props.height || "80px";
    const variant = props.variant || "Standard";

    let actualHeight = height;
    if (variant === "Large") actualHeight = "160px";

    if (variant === "Divider Line") {
        return (
            <section style={{ padding: `${actualHeight} 32px`, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: "1200px", height: "1px", background: "currentColor", opacity: 0.1 }} />
            </section>
        );
    }

    return <section style={{ height: actualHeight, background: bg }} />;
};

const ImageSection = ({ props }) => {
    const bg = props.bgColor || "transparent";
    const align = props.align || "center";
    const variant = props.variant || "Rounded Shadow";

    let imgStyle = { maxWidth: "100%", height: "auto", borderRadius: "24px", boxShadow: "0 12px 32px rgba(0,0,0,0.1)", objectFit: "cover" };

    if (variant === "Full Bleed Edge") imgStyle = { ...imgStyle, borderRadius: "0", boxShadow: "none", width: "100%" };
    else if (variant === "Circle Cropped") imgStyle = { ...imgStyle, borderRadius: "50%", aspectRatio: "1/1", width: "400px", margin: "0 auto", display: "block" };

    return (
        <section style={{ padding: variant === "Full Bleed Edge" ? "0" : "40px 32px", background: bg, textAlign: align }}>
            <img src={props.src || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80"} alt={props.alt || "Image"} style={imgStyle} />
        </section>
    );
};

// Section registry
export const SECTION_MAP = { Navbar: NavbarSection, Hero: HeroSection, Text: TextSection, Gallery: GallerySection, CTA: CTASection, ContactForm: ContactFormSection, Footer: FooterSection, Button: ButtonSection, Spacer: SpacerSection, Image: ImageSection };

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
        let slug = tenantSlug;
        if (!slug) slug = window.location.hostname;
        const websiteId = searchParams.get("websiteId");
        const url = websiteId ? `/public/sites/${slug}?websiteId=${websiteId}` : `/public/sites/${slug}`;

        api.get(url)
            .then((res) => {
                setSiteData(res.data);
                const home = res.data.pages.find((p) => p.isHomePage) || res.data.pages[0];
                setCurrentPage(home);
            })
            .catch((err) => setError(err.response?.data?.message || "Site not found"))
            .finally(() => setLoading(false));
    }, [tenantSlug, searchParams]);

    useEffect(() => {
        if (!siteData || !pageSlug) return;
        const found = siteData.pages.find((p) => p.slug === pageSlug);
        if (found) setCurrentPage(found);
    }, [pageSlug, siteData]);

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
    const websiteIdFromUrl = searchParams.get("websiteId");
    const websiteId = websiteIdFromUrl || siteData?.website?._id || currentPage?.websiteId || siteData?.pages?.[0]?.websiteId;

    return (
        <div className="responsive-master-container" style={{ minHeight: "100vh", background: "#0f0f1a", fontFamily: `"${branding?.font || "Google Sans"}", "DM Sans", sans-serif`, color: "#f0f0ff", overflowX: "hidden" }}>
            <style>{globalResponsiveCss}</style>
            {siteData?.pages?.length > 1 && (
                <div style={{ display: "flex", gap: "4px", padding: "8px 32px", background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {siteData.pages.map((page) => (
                        <button key={page._id} onClick={() => setCurrentPage(page)} style={{ padding: "4px 14px", borderRadius: "6px", fontSize: "12px", background: currentPage?._id === page._id ? `${branding?.primaryColor || "#6366f1"}20` : "transparent", border: currentPage?._id === page._id ? `1px solid ${branding?.primaryColor || "#6366f1"}50` : "1px solid transparent", color: currentPage?._id === page._id ? branding?.primaryColor || "#6366f1" : "#606090", cursor: "pointer" }}>{page.title}</button>
                    ))}
                </div>
            )}
            {sections.sort((a, b) => a.order - b.order).map((section) => {
                const Component = SECTION_MAP[section.type];
                if (!Component) return null;
                return <Component key={section.id} props={section.props || {}} branding={branding} websiteId={websiteId} />;
            })}
            {sections.length === 0 && <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#606090" }}>This page has no content yet.</p></div>}
        </div>
    );
}
