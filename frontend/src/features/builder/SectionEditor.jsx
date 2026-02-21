/**
 * SectionEditor
 * Renders an inline form to edit props of a given section type.
 */
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
                <div key={i} className="flex gap-1 mt-1">
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
        <div className="pt-2">
            <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                Editing: {type}
            </p>
            {renderByType()}
        </div>
    );
}
