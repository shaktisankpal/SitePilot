import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { fetchWebsites } from "../../store/slices/websiteSlice.js";
import toast from "react-hot-toast";
import {
    Wand2, Sparkles, Plus, X, Loader2, CheckCircle,
    Code2, Eye, ChevronDown, ChevronRight,
} from "lucide-react";

const FEATURES = [
    "Hero Banner", "Service Cards", "Team Section", "Gallery", "Testimonials",
    "FAQ", "Pricing Table", "Contact Form", "Newsletter", "Blog Preview",
    "Stats Counter", "Call to Action",
];

const TONES = ["Professional", "Friendly", "Bold", "Minimalist", "Playful", "Luxury"];
const AUDIENCES = ["General Public", "Businesses", "Developers", "Creatives", "Students", "Executives"];

export default function AIGeneratorPage() {
    const dispatch = useDispatch();
    const { websites } = useSelector((s) => s.website);
    const [form, setForm] = useState({
        businessType: "",
        tone: "Professional",
        targetAudience: "General Public",
        features: ["Hero Banner", "Contact Form"],
        websiteId: "",
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [expandedPage, setExpandedPage] = useState(null);

    const toggleFeature = (f) => {
        setForm((p) => ({
            ...p,
            features: p.features.includes(f)
                ? p.features.filter((x) => x !== f)
                : [...p.features, f],
        }));
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!form.businessType) return toast.error("Please describe your business");
        if (form.features.length === 0) return toast.error("Select at least one feature");

        setLoading(true);
        setResult(null);
        try {
            const res = await api.post("/ai/generate-website", form);
            setResult(res.data);
            toast.success("Layout generated! ✨");
            if (form.websiteId) dispatch(fetchWebsites());
        } catch (err) {
            toast.error(err.response?.data?.message || "AI generation failed");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)",
        background: "var(--bg-input)", border: "1px solid var(--border-color)",
        color: "var(--text-primary)", fontSize: "14px", outline: "none",
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="flex items-center justify-center rounded-xl"
                            style={{ width: "40px", height: "40px", background: "var(--bg-input)", border: "1px solid var(--border-color)" }}
                        >
                            <Wand2 size={20} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>AI Layout Generator</h1>
                    </div>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginLeft: "52px" }}>
                        Powered by Gemini AI — Generate a complete website layout in seconds
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6 md:px-8 pb-8">
                {/* Form */}
                <form onSubmit={handleGenerate} className="space-y-5">
                    <div
                        className="glass rounded-2xl p-5"
                        style={{ border: "1px solid var(--border-color)" }}
                    >
                        <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Business Details</h3>

                        <div className="space-y-4">
                            <div>
                                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                                    What is your business? *
                                </label>
                                <textarea
                                    value={form.businessType}
                                    onChange={(e) => setForm((p) => ({ ...p, businessType: e.target.value }))}
                                    placeholder="e.g. A modern coffee shop that sells specialty brews and pastries in a cozy urban setting"
                                    rows={3}
                                    required
                                    style={{ ...inputStyle, resize: "none" }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                                        Tone
                                    </label>
                                    <select
                                        value={form.tone}
                                        onChange={(e) => setForm((p) => ({ ...p, tone: e.target.value }))}
                                        style={{ ...inputStyle, appearance: "none" }}
                                    >
                                        {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                                        Target Audience
                                    </label>
                                    <select
                                        value={form.targetAudience}
                                        onChange={(e) => setForm((p) => ({ ...p, targetAudience: e.target.value }))}
                                        style={{ ...inputStyle, appearance: "none" }}
                                    >
                                        {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>

                            {websites.length > 0 && (
                                <div>
                                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                                        Apply to Website (optional)
                                    </label>
                                    <select
                                        value={form.websiteId}
                                        onChange={(e) => setForm((p) => ({ ...p, websiteId: e.target.value }))}
                                        style={{ ...inputStyle, appearance: "none" }}
                                    >
                                        <option value="">— Preview only —</option>
                                        {websites.map((w) => (
                                            <option key={w._id} value={w._id}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feature Selection */}
                    <div
                        className="glass rounded-2xl p-5"
                        style={{ border: "1px solid var(--border-color)" }}
                    >
                        <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Required Sections</h3>
                        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                            {form.features.length} selected
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {FEATURES.map((f) => {
                                const selected = form.features.includes(f);
                                return (
                                    <button
                                        key={f} type="button" onClick={() => toggleFeature(f)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                                        style={{
                                            background: selected ? "rgba(99,102,241,0.2)" : "var(--bg-input)",
                                            border: selected ? "1px solid rgba(99,102,241,0.5)" : "1px solid var(--border-color)",
                                            color: selected ? "var(--color-primary)" : "var(--text-secondary)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {selected && <CheckCircle size={12} />}
                                        {f}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base transition-colors"
                        style={{
                            background: loading ? "var(--bg-input)" : "var(--text-primary)",
                            color: loading ? "var(--text-muted)" : "var(--bg-base)", border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: "none",
                        }}
                    >
                        {loading ? (
                            <><Loader2 size={18} className="animate-spin" /> Generating with Gemini AI...</>
                        ) : (
                            <><Sparkles size={18} /> Generate Layout</>
                        )}
                    </button>
                </form>

                {/* Result preview */}
                <div>
                    {!result && !loading && (
                        <div
                            className="glass rounded-2xl flex flex-col items-center justify-center py-20"
                            style={{ border: "1px solid var(--border-color)", minHeight: "300px" }}
                        >
                            <Wand2 size={48} style={{ color: "var(--text-muted)", marginBottom: "16px", opacity: 0.5 }} />
                            <p className="text-lg font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                                Your AI layout will appear here
                            </p>
                            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                                Fill in the form and click Generate
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div
                            className="glass rounded-2xl flex flex-col items-center justify-center py-20"
                            style={{ border: "1px solid var(--border-color)", minHeight: "300px" }}
                        >
                            <div
                                style={{
                                    width: "60px", height: "60px", borderRadius: "50%", marginBottom: "20px",
                                    background: "var(--bg-input)", border: "1px solid var(--border-color)",
                                    animation: "pulse-glow 2s ease-in-out infinite",
                                }}
                                className="flex items-center justify-center"
                            >
                                <Sparkles size={28} className="text-white" />
                            </div>
                            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Gemini AI is working...</p>
                            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Crafting your perfect layout</p>
                        </div>
                    )}

                    {result && (
                        <div
                            className="glass rounded-2xl p-5 animate-fade-in"
                            style={{ border: "1px solid var(--border-color)" }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle size={18} style={{ color: "#10b981" }} />
                                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                                    Generated {result.layout?.pages?.length} pages
                                    {result.savedToWebsite && <span style={{ color: "#10b981", marginLeft: "8px", fontSize: "12px" }}>• Saved to website</span>}
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {result.layout?.pages?.map((page, i) => (
                                    <div
                                        key={i}
                                        className="rounded-xl overflow-hidden"
                                        style={{ border: "1px solid var(--border-color)", background: "var(--bg-input)" }}
                                    >
                                        <button
                                            className="w-full flex items-center justify-between p-3"
                                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)" }}
                                            onClick={() => setExpandedPage(expandedPage === i ? null : i)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Eye size={14} style={{ color: "var(--color-primary)" }} />
                                                <span className="text-sm font-medium">{page.title}</span>
                                                <code
                                                    className="text-xs px-1.5 py-0.5 rounded"
                                                    style={{ background: "rgba(99,102,241,0.15)", color: "var(--color-primary)" }}
                                                >
                                                    /{page.slug}
                                                </code>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                                    {page.sections.length} sections
                                                </span>
                                                {expandedPage === i ? <ChevronDown size={14} style={{ color: "var(--text-muted)" }} /> : <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />}
                                            </div>
                                        </button>

                                        {expandedPage === i && (
                                            <div className="px-3 pb-3 space-y-2 animate-fade-in">
                                                {page.sections.map((section, j) => (
                                                    <div
                                                        key={j}
                                                        className="flex items-center gap-2 p-2 rounded-lg"
                                                        style={{ background: "var(--bg-card)" }}
                                                    >
                                                        <Code2 size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                                                        <span
                                                            className="text-xs font-medium px-2 py-0.5 rounded"
                                                            style={{ background: "rgba(99,102,241,0.2)", color: "var(--color-primary)" }}
                                                        >
                                                            {section.type}
                                                        </span>
                                                        {section.props?.heading && (
                                                            <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                                                                {section.props.heading}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!result.savedToWebsite && (
                                <p className="text-xs mt-4 text-center" style={{ color: "var(--text-muted)" }}>
                                    Select a website in the form to apply this layout directly
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
