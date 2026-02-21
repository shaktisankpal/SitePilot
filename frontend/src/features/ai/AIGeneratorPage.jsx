import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { fetchWebsites } from "../../store/slices/websiteSlice.js";
import toast from "react-hot-toast";
import {
    Wand2, Sparkles, Loader2, CheckCircle,
    Code2, Eye, ChevronDown, ChevronRight, LayoutTemplate
} from "lucide-react";
import { SECTION_MAP } from "../publicSite/PublicSiteRenderer.jsx";
import { updateTenantBranding } from "../../store/slices/authSlice.js";

const FEATURES = [
    "Hero Banner", "Service Cards", "Team Section", "Gallery", "Testimonials",
    "FAQ", "Pricing Table", "Contact Form", "Newsletter", "Blog Preview",
    "Stats Counter", "Call to Action",
];
const TONES = ["Professional", "Friendly", "Bold", "Minimalist", "Playful", "Luxury"];
const AUDIENCES = ["General Public", "Businesses", "Developers", "Creatives", "Students", "Executives"];

const inputStyle = {
    width: "100%", padding: "14px 18px", borderRadius: 14,
    background: "var(--bg-input)", border: "1px solid var(--border-color)",
    color: "var(--text-primary)", fontSize: 15, outline: "none",
    transition: "all 0.2s ease", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)",
};

export default function AIGeneratorPage() {
    const dispatch = useDispatch();
    const { websites } = useSelector((s) => s.website);
    const { tenant } = useSelector((s) => s.auth);
    const [form, setForm] = useState({
        businessType: "", tone: "Professional", targetAudience: "General Public",
        features: ["Hero Banner", "Contact Form"], websiteId: "",
        primaryColor: tenant?.branding?.primaryColor || "#6366f1",
        secondaryColor: tenant?.branding?.secondaryColor || "#8b5cf6",
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [activePageIdx, setActivePageIdx] = useState(0);

    const toggleFeature = (f) => {
        setForm((p) => ({
            ...p,
            features: p.features.includes(f) ? p.features.filter((x) => x !== f) : [...p.features, f],
        }));
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!form.businessType) return toast.error("Please describe your business");
        if (form.features.length === 0) return toast.error("Select at least one feature");
        setLoading(true); setResult(null);
        try {
            const res = await api.post("/ai/generate-website", form);
            setResult(res.data);
            toast.success("Layout generated! ✨");
            if (form.websiteId) {
                dispatch(fetchWebsites());
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "AI generation failed");
        } finally { setLoading(false); }
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px 60px" }}>
                {/* Header */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                            boxShadow: "0 0 20px rgba(99,102,241,0.2)",
                        }}>
                            <Wand2 size={24} color="white" />
                        </div>
                        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>AI Playground</h1>
                    </div>
                    <p style={{ fontSize: 16, color: "var(--text-secondary)", paddingLeft: 64 }}>
                        Powered by Google Gemini — Generate a complete, stunning website layout in seconds.
                    </p>
                </div>

                {/* Two Column Layout */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                    {/* Left: Form */}
                    <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {/* Architect Details Card */}
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24, padding: 32 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                                <div style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "white" }}>
                                    <LayoutTemplate size={20} />
                                </div>
                                <h3 style={{ fontWeight: 800, fontSize: 20, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Architect Details</h3>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                                        Describe Your Concept *
                                    </label>
                                    <textarea value={form.businessType} onChange={(e) => setForm((p) => ({ ...p, businessType: e.target.value }))}
                                        placeholder="e.g. A futuristic startup building smart AI agents with a sleek, dark aesthetic..."
                                        rows={4} required style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }} />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div style={{ position: "relative" }}>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Tone</label>
                                        <select value={form.tone} onChange={(e) => setForm((p) => ({ ...p, tone: e.target.value }))}
                                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                                            {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <div style={{ position: "absolute", right: 16, bottom: 16, pointerEvents: "none", opacity: 0.4 }}><ChevronDown size={16} /></div>
                                    </div>
                                    <div style={{ position: "relative" }}>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Audience</label>
                                        <select value={form.targetAudience} onChange={(e) => setForm((p) => ({ ...p, targetAudience: e.target.value }))}
                                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                                            {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                        <div style={{ position: "absolute", right: 16, bottom: 16, pointerEvents: "none", opacity: 0.4 }}><ChevronDown size={16} /></div>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Primary Color</label>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-input)", border: "1px solid var(--border-color)", borderRadius: 14, padding: "8px" }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                                                <input type="color" value={form.primaryColor} onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))}
                                                    style={{ position: "absolute", inset: -8, width: 48, height: 48, cursor: "pointer", border: "none" }} />
                                            </div>
                                            <input type="text" value={form.primaryColor} onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))}
                                                style={{ border: "none", background: "transparent", color: "var(--text-primary)", fontSize: 15, outline: "none", width: "100%", fontFamily: "monospace" }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Secondary Color</label>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-input)", border: "1px solid var(--border-color)", borderRadius: 14, padding: "8px" }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                                                <input type="color" value={form.secondaryColor} onChange={(e) => setForm((p) => ({ ...p, secondaryColor: e.target.value }))}
                                                    style={{ position: "absolute", inset: -8, width: 48, height: 48, cursor: "pointer", border: "none" }} />
                                            </div>
                                            <input type="text" value={form.secondaryColor} onChange={(e) => setForm((p) => ({ ...p, secondaryColor: e.target.value }))}
                                                style={{ border: "none", background: "transparent", color: "var(--text-primary)", fontSize: 15, outline: "none", width: "100%", fontFamily: "monospace" }} />
                                        </div>
                                    </div>
                                </div>

                                {websites.length > 0 && (
                                    <div style={{ position: "relative" }}>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Apply Directly (Optional)</label>
                                        <select value={form.websiteId} onChange={(e) => setForm((p) => ({ ...p, websiteId: e.target.value }))}
                                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                                            <option value="">— Preview Sandbox Only —</option>
                                            {websites.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
                                        </select>
                                        <div style={{ position: "absolute", right: 16, bottom: 16, pointerEvents: "none", opacity: 0.4 }}><ChevronDown size={16} /></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Feature Selection */}
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24, padding: 32 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                                <h3 style={{ fontWeight: 800, fontSize: 20, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Required Blocks</h3>
                                <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: 100, color: "var(--color-primary)" }}>
                                    {form.features.length} selected
                                </span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                {FEATURES.map((f) => {
                                    const sel = form.features.includes(f);
                                    return (
                                        <button key={f} type="button" onClick={() => toggleFeature(f)} style={{
                                            display: "flex", alignItems: "center", gap: 7,
                                            padding: "9px 18px", borderRadius: 100, fontSize: 14, fontWeight: 700,
                                            background: sel ? "var(--color-primary)" : "var(--bg-input)",
                                            border: sel ? "1px solid transparent" : "1px solid var(--border-color)",
                                            color: sel ? "white" : "var(--text-secondary)",
                                            cursor: "pointer", transition: "all 0.15s ease",
                                            boxShadow: sel ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                                        }}>
                                            {sel && <CheckCircle size={14} strokeWidth={3} />}
                                            {f}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button type="submit" disabled={loading} style={{
                            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            padding: "20px 0", borderRadius: 16, fontSize: 16, fontWeight: 800, border: "none",
                            background: loading ? "var(--bg-input)" : "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                            color: loading ? "var(--text-muted)" : "white",
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: loading ? "none" : "0 8px 20px rgba(99,102,241,0.4)",
                        }}>
                            {loading ? <><Loader2 size={20} className="animate-spin" /> Cooking Layout...</> : <><Sparkles size={20} strokeWidth={2.5} /> Generate Website Layout</>}
                        </button>
                    </form>

                    {/* Right: Preview */}
                    <div>
                        {!result && !loading && (
                            <div style={{
                                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                                borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                padding: 48, minHeight: 600, textAlign: "center",
                            }}>
                                <div style={{ padding: 28, borderRadius: "50%", background: "rgba(255,255,255,0.04)", marginBottom: 24, color: "rgba(255,255,255,0.15)" }}>
                                    <Wand2 size={56} strokeWidth={1.5} />
                                </div>
                                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Awaiting Instructions</h2>
                                <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 340, lineHeight: 1.5 }}>
                                    Describe your concept, select blocks, and watch our AI generate your layout.
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div style={{
                                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                                borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                padding: 48, minHeight: 600, textAlign: "center", position: "relative", overflow: "hidden",
                            }}>
                                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, var(--color-primary) 0%, transparent 60%)", opacity: 0.15 }} />
                                <div style={{
                                    width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                                    boxShadow: "0 0 40px var(--color-primary)", marginBottom: 28,
                                    animation: "pulse-glow 2s ease-in-out infinite", position: "relative", zIndex: 1,
                                }}>
                                    <Sparkles size={36} color="white" className="animate-spin" style={{ animationDuration: "3s" }} />
                                </div>
                                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "var(--text-primary)", position: "relative", zIndex: 1 }}>Engineering Layout...</h2>
                                <p style={{ fontSize: 15, color: "var(--text-secondary)", position: "relative", zIndex: 1 }}>Gemini AI is structuring your pages.</p>
                            </div>
                        )}

                        {result && (
                            <div style={{
                                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                                borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", height: "100%", minHeight: 600
                            }}>
                                {/* Success banner */}
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    marginBottom: 20, background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 16,
                                    border: "1px solid rgba(255,255,255,0.06)", flexShrink: 0
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", padding: 8, borderRadius: "50%" }}>
                                            <CheckCircle size={20} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Generation Successful</h3>
                                            <p style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>{result.layout?.pages?.length} Pages Designed</p>
                                        </div>
                                    </div>
                                    {result.savedToWebsite && (
                                        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 800, background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "6px 12px", borderRadius: 100 }}>
                                            Saved
                                        </span>
                                    )}
                                </div>

                                {/* Tabs */}
                                <div style={{ display: "flex", gap: 8, marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16, overflowX: "auto", flexShrink: 0 }}>
                                    {result.layout?.pages?.map((page, i) => (
                                        <button key={i} onClick={() => setActivePageIdx(i)} style={{
                                            padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none",
                                            background: activePageIdx === i ? "var(--color-primary)" : "var(--bg-input)",
                                            color: activePageIdx === i ? "white" : "var(--text-secondary)",
                                            transition: "all 0.2s"
                                        }}>
                                            {page.title}
                                        </button>
                                    ))}
                                </div>

                                {/* Live Preview Full */}
                                <div style={{ flex: 1, background: "#0f0f1a", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", position: "relative" }}>
                                    <div style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
                                        <div style={{ pointerEvents: "none" }}>
                                            {result.layout?.pages[activePageIdx]?.sections.map((section, j) => {
                                                const Component = SECTION_MAP[section.type];
                                                if (!Component) return null;
                                                return <Component key={j} props={{ ...section.props, accentColor: form.primaryColor, secondaryColor: form.secondaryColor }} branding={{ font: tenant?.branding?.font || "Inter" }} />;
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {!result.savedToWebsite && (
                                    <div style={{ marginTop: 20, padding: 16, borderRadius: 16, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", textAlign: "center", flexShrink: 0 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: "#f59e0b" }}>
                                            ⚠️ Sandbox preview. Choose a project above to apply directly.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
