import { ChevronDown, Loader2 } from "lucide-react";
import api from "../../services/api.js";
import { useState } from "react";

/**
 * SectionEditor
 * Renders an inline form to edit props of a given section type.
 * Includes per-component color and font customization.
 */

const FONT_OPTIONS = ["Google Sans", "Inter", "Roboto", "Outfit", "Playfair Display", "Montserrat", "Poppins", "DM Sans"];

export default function SectionEditor({ section, onChange }) {
    const { type, props } = section;
    const [uploading, setUploading] = useState(false);

    const inputStyle = {
        width: "100%", padding: "8px 10px", borderRadius: "6px",
        background: "var(--bg-card)", border: "1px solid var(--border-color)",
        color: "var(--text-primary)", fontSize: "13px", outline: "none",
        marginTop: "4px",
    };

    const labelStyle = {
        fontSize: "11px", fontWeight: "600", color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginTop: "10px",
    };

    const handleChange = (key, value) => onChange({ [key]: value });

    const handleArrayChange = (key, index, value) => {
        const arr = [...(props[key] || [])];
        arr[index] = value;
        onChange({ [key]: arr });
    };

    const handleAddArrayItem = (key) => onChange({ [key]: [...(props[key] || []), "New Item"] });
    const handleRemoveArrayItem = (key, index) => {
        const arr = [...(props[key] || [])];
        arr.splice(index, 1);
        onChange({ [key]: arr });
    };

    const renderField = (label, key, type = "text", placeholder = "") => (
        <div key={key}>
            <label style={labelStyle}>{label}</label>
            {type === "textarea" ? (
                <textarea
                    value={props[key] || ""} rows={3}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    style={{ ...inputStyle, resize: "none" }}
                />
            ) : (
                <input
                    type={type} value={props[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder} style={inputStyle}
                />
            )}
        </div>
    );

    const renderArrayField = (label, key) => (
        <div key={key}>
            <label style={labelStyle}>{label}</label>
            {(props[key] || []).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    <input
                        value={item} onChange={(e) => handleArrayChange(key, i, e.target.value)}
                        style={{ ...inputStyle, marginTop: 0, flex: 1 }}
                    />
                    <button
                        onClick={() => handleRemoveArrayItem(key, i)}
                        style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "6px", color: "#f87171", cursor: "pointer", padding: "0 8px", fontSize: "14px" }}
                    >×</button>
                </div>
            ))}
            <button
                onClick={() => handleAddArrayItem(key)}
                style={{ marginTop: "6px", fontSize: "12px", color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
                + Add item
            </button>
        </div>
    );

    const handleImageUpload = async (key, file) => {
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                // If it starts with /uploads, prepend the backend URL if we need to, 
                // but the sitepilot router usually handles relative paths via proxy or base url.
                // Let's use the full absolute URL for the image
                const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                const base = backendUrl.replace("/api", "");
                handleChange(key, base + res.data.url);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const renderImageField = (label, key) => (
        <div key={key} style={{ marginTop: 10 }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <input
                    type="text" value={props[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder="https://..." style={{ ...inputStyle, flex: 1, marginTop: 0 }}
                />
                <label style={{
                    background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "6px", color: "var(--color-primary)", cursor: uploading ? "wait" : "pointer", padding: "0 10px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap"
                }}>
                    {uploading ? <Loader2 size={12} className="animate-spin" /> : "Upload"}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(key, e.target.files[0])} style={{ display: "none" }} disabled={uploading} />
                </label>
            </div>
            {props[key] && props[key].length > 10 && (props[key].startsWith("http") || props[key].startsWith("data:")) && (
                <div style={{ marginTop: 8, borderRadius: 6, overflow: "hidden", height: 100, border: "1px solid var(--border-color)", background: "#000" }}>
                    <img src={props[key]} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
                </div>
            )}
        </div>
    );

    const renderColorField = (label, key, defaultVal = "#6366f1") => (
        <div key={key}>
            <label style={labelStyle}>{label}</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: props[key] || defaultVal,
                    position: "relative", overflow: "hidden", cursor: "pointer",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow: `0 2px 8px ${props[key] || defaultVal}40`,
                }}>
                    <input type="color" value={props[key] || defaultVal}
                        onChange={(e) => handleChange(key, e.target.value)}
                        style={{ position: "absolute", inset: -8, width: 60, height: 60, cursor: "pointer", opacity: 0 }}
                    />
                </div>
                <input
                    value={props[key] || defaultVal}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={defaultVal}
                    style={{ ...inputStyle, marginTop: 0, flex: 1, fontFamily: "monospace", fontSize: 12 }}
                />
            </div>
        </div>
    );

    const renderFontField = () => (
        <div key="fontFamily">
            <label style={labelStyle}>Font Family</label>
            <div style={{ position: "relative", marginTop: 4 }}>
                <select
                    value={props.fontFamily || "Google Sans"}
                    onChange={(e) => handleChange("fontFamily", e.target.value)}
                    style={{
                        ...inputStyle, marginTop: 0, appearance: "none", cursor: "pointer",
                        fontFamily: props.fontFamily || "Google Sans",
                        paddingRight: 28,
                    }}
                >
                    {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f} style={{ background: "var(--bg-surface)", color: "var(--text-primary)" }}>{f}</option>
                    ))}
                </select>
                <div style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    pointerEvents: "none", opacity: 0.4,
                }}>
                    <ChevronDown size={12} />
                </div>
            </div>
        </div>
    );

    const renderVariantField = () => {
        const variants = {
            Navbar: ["Glassy Island", "Full Width Solid", "Minimal Transparent"],
            Hero: ["Split Text Left", "Centered Image Bg", "Split Text Right"],
            Text: ["Centered Standard", "Left Aligned Big", "Card Based"],
            Gallery: ["Bento Grid", "Masonry Column", "Horizontal Flex"],
            CTA: ["Centered Large", "Floating Pill", "Split Screen CTA"],
            ContactForm: ["Left Text Right Form", "Centered Card", "Minimal Left Form"],
            Footer: ["Simple Centered", "Multi-Column Mock", "Ultra Minimal"],
            Button: ["Primary Pill", "Secondary Outline", "Ghost Action"],
            Image: ["Rounded Shadow", "Full Bleed Edge", "Circle Cropped"],
            Spacer: ["Standard", "Large", "Divider Line"]
        };
        const opts = variants[type] || ["Default", "Variant 2", "Variant 3"];
        return (
            <div key="variant" style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <label style={{ ...labelStyle, color: "var(--color-primary)", marginTop: 0 }}>Choose Design Template</label>
                <div style={{ position: "relative", marginTop: 8 }}>
                    <select
                        value={props.variant || opts[0]}
                        onChange={(e) => handleChange("variant", e.target.value)}
                        style={{ ...inputStyle, marginTop: 0, appearance: "none", cursor: "pointer", paddingRight: 28, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)", fontSize: "14px", fontWeight: "600" }}
                    >
                        {opts.map((v) => <option key={v} value={v} style={{ background: "var(--bg-surface)", color: "var(--text-primary)" }}>{v}</option>)}
                    </select>
                    <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.8, color: "var(--color-primary)" }}>
                        <ChevronDown size={14} />
                    </div>
                </div>
            </div>
        );
    };

    /** Styling section common to all section types */
    const renderStyleControls = () => (
        <div style={{
            marginTop: 16, paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
            <p style={{
                fontSize: "10px", fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)",
                marginBottom: 6, display: "flex", alignItems: "center", gap: 6,
            }}>
                🎨 Style Controls
            </p>
            {renderColorField("Background", "bgColor", "#0a0a14")}
            {renderColorField("Text Color", "textColor", "#f0f0ff")}
            {renderColorField("Accent Color", "accentColor", "#6366f1")}
            {renderColorField("Secondary Color", "secondaryColor", "#8b5cf6")}
            {renderFontField()}
        </div>
    );

    const renderByType = () => {
        switch (type) {
            case "Navbar":
                return <>
                    {renderField("Brand Name", "brand", "text", "My Brand")}
                    {renderArrayField("Nav Links", "links")}
                </>;

            case "Hero":
                return <>
                    {renderField("Heading", "heading", "text", "Welcome to our site")}
                    {renderField("Subheading", "subheading", "text", "Your tagline")}
                    {renderField("CTA Button Text", "ctaText", "text", "Get Started")}
                    {renderField("CTA Link", "ctaLink", "text", "#")}
                    {renderImageField("Background Image", "backgroundImage")}
                </>;

            case "Text":
                return <>
                    {renderField("Heading", "heading", "text", "Section Title")}
                    {renderField("Content", "description", "textarea", "Write your content here...")}
                    {renderImageField("Background Image", "backgroundImage")}
                </>;

            case "Gallery":
                return <>
                    {renderField("Heading", "heading", "text", "Our Gallery")}
                    {renderArrayField("Image URLs or Descriptions", "items")}
                    {renderImageField("Background Image", "backgroundImage")}
                </>;

            case "CTA":
                return <>
                    {renderField("Heading", "heading", "text", "Ready to get started?")}
                    {renderField("Subheading", "subheading", "text", "Join us today")}
                    {renderField("Button Text", "ctaText", "text", "Sign Up")}
                    {renderField("Button Link", "ctaLink", "text", "#")}
                    {renderImageField("Background Image", "backgroundImage")}
                </>;

            case "ContactForm":
                return <>
                    {renderField("Heading", "heading", "text", "Contact Us")}
                    {renderArrayField("Form Fields", "fields")}
                    {renderImageField("Background Image", "backgroundImage")}
                </>;

            case "Footer":
                return <>
                    {renderField("Footer Text", "text", "text", "© 2026 Company. All rights reserved.")}
                    {renderImageField("Background Image", "backgroundImage")}
                </>;

            case "Button":
                return <>
                    {renderField("Text", "text", "text", "Click Me")}
                    {renderField("Link", "link", "text", "#")}
                </>;

            case "Image":
                return <>
                    {renderImageField("Source URL", "src")}
                    {renderField("Alt text", "alt", "text", "Image")}
                </>;

            case "Spacer":
                return <>
                    {renderField("Height (e.g. 40px, 5vh)", "height", "text", "80px")}
                </>;

            default:
                return <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "8px" }}>No editable fields for this section.</p>;
        }
    };

    return (
        <div style={{ paddingTop: 8 }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                Editing: {type}
            </p>
            {renderVariantField()}
            {renderByType()}
            {renderStyleControls()}
        </div>
    );
}
