import { ChevronDown } from "lucide-react";

/**
 * SectionEditor
 * Renders an inline form to edit props of a given section type.
 * Includes per-component color and font customization.
 */

const FONT_OPTIONS = ["Google Sans", "Inter", "Roboto", "Outfit", "Playfair Display", "Montserrat", "Poppins", "DM Sans"];

export default function SectionEditor({ section, onChange }) {
    const { type, props } = section;

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
                        <option key={f} value={f}>{f}</option>
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
                    {renderField("Background Image URL", "backgroundImage", "text", "https://...")}
                </>;

            case "Text":
                return <>
                    {renderField("Heading", "heading", "text", "Section Title")}
                    {renderField("Content", "description", "textarea", "Write your content here...")}
                </>;

            case "Gallery":
                return <>
                    {renderField("Heading", "heading", "text", "Our Gallery")}
                    {renderArrayField("Image Descriptions", "items")}
                </>;

            case "CTA":
                return <>
                    {renderField("Heading", "heading", "text", "Ready to get started?")}
                    {renderField("Subheading", "subheading", "text", "Join us today")}
                    {renderField("Button Text", "ctaText", "text", "Sign Up")}
                    {renderField("Button Link", "ctaLink", "text", "#")}
                </>;

            case "ContactForm":
                return <>
                    {renderField("Heading", "heading", "text", "Contact Us")}
                    {renderArrayField("Form Fields", "fields")}
                </>;

            case "Footer":
                return <>
                    {renderField("Footer Text", "text", "text", "© 2026 Company. All rights reserved.")}
                </>;

            default:
                return <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "8px" }}>No editable fields for this section.</p>;
        }
    };

    return (
        <div style={{ paddingTop: 8 }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                Editing: {type}
            </p>
            {renderByType()}
            {renderStyleControls()}
        </div>
    );
}
