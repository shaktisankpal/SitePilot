import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { fetchWebsites } from "../../store/slices/websiteSlice.js";
import toast from "react-hot-toast";
import {
    Wand2, Sparkles, Plus, X, Loader2, CheckCircle,
    Code2, Eye, ChevronDown, ChevronRight, LayoutTemplate
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
        width: "100%", padding: "14px 18px", borderRadius: "14px",
        background: "var(--bg-input)", border: "1px solid var(--border-color)",
        color: "var(--text-primary)", fontSize: "15px", outline: "none",
        transition: "all 0.2s ease",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)"
    };

    return (
        <DashboardLayout>
            <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10 space-y-10">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <div
                            className="flex items-center justify-center rounded-[14px] shadow-sm ring-1 ring-white/5"
                            style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
                        >
                            <Wand2 size={24} className="text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>AI Playground</h1>
                    </div>
                    <p className="text-[16px] md:pl-[64px]" style={{ color: "var(--text-secondary)" }}>
                        Powered by Google Gemini — Generate a complete, stunning website layout in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Form */}
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div
                            className="glass rounded-[24px] p-8"
                            style={{ border: "1px solid var(--border-color)" }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-[12px] bg-white/5 text-white">
                                    <LayoutTemplate size={20} />
                                </div>
                                <h3 className="font-bold text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>Architect Details</h3>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[13px] font-bold uppercase tracking-wider text-white/50 mb-2">
                                        Describe Your Concept *
                                    </label>
                                    <textarea
                                        value={form.businessType}
                                        onChange={(e) => setForm((p) => ({ ...p, businessType: e.target.value }))}
                                        placeholder="e.g. A futuristic startup building smart AI agents with a sleek, dark aesthetic..."
                                        rows={4}
                                        required
                                        style={{ ...inputStyle, resize: "none", lineHeight: "1.6" }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="relative">
                                        <label className="block text-[13px] font-bold uppercase tracking-wider text-white/50 mb-2">
                                            Aesthetics Target
                                        </label>
                                        <select
                                            value={form.tone}
                                            onChange={(e) => setForm((p) => ({ ...p, tone: e.target.value }))}
                                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                                        >
                                            {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <div className="absolute right-4 bottom-4 pointer-events-none opacity-50">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-[13px] font-bold uppercase tracking-wider text-white/50 mb-2">
                                            Core Audience
                                        </label>
                                        <select
                                            value={form.targetAudience}
                                            onChange={(e) => setForm((p) => ({ ...p, targetAudience: e.target.value }))}
                                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                                        >
                                            {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                        <div className="absolute right-4 bottom-4 pointer-events-none opacity-50">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>

                                {websites.length > 0 && (
                                    <div className="relative pt-2">
                                        <label className="block text-[13px] font-bold uppercase tracking-wider text-white/50 mb-2">
                                            Apply Directly (Optional)
                                        </label>
                                        <select
                                            value={form.websiteId}
                                            onChange={(e) => setForm((p) => ({ ...p, websiteId: e.target.value }))}
                                            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                                        >
                                            <option value="">— Preview Sandbox Only —</option>
                                            {websites.map((w) => (
                                                <option key={w._id} value={w._id}>{w.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 bottom-4 pointer-events-none opacity-50">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Feature Selection */}
                        <div
                            className="glass rounded-[24px] p-8"
                            style={{ border: "1px solid var(--border-color)" }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>Required Blocks</h3>
                                <p className="text-[13px] font-bold uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-full" style={{ color: "var(--color-primary)" }}>
                                    {form.features.length} selected
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {FEATURES.map((f) => {
                                    const selected = form.features.includes(f);
                                    return (
                                        <button
                                            key={f} type="button" onClick={() => toggleFeature(f)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-bold transition-all hover:-translate-y-0.5"
                                            style={{
                                                background: selected ? "var(--color-primary)" : "var(--bg-input)",
                                                border: selected ? "1px solid transparent" : "1px solid var(--border-color)",
                                                color: selected ? "white" : "var(--text-secondary)",
                                                cursor: "pointer",
                                                boxShadow: selected ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                                            }}
                                        >
                                            {selected && <CheckCircle size={14} strokeWidth={3} />}
                                            {f}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-5 rounded-[16px] text-[16px] font-extrabold transition-all outline-none"
                            style={{
                                background: loading ? "var(--bg-input)" : "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                                color: loading ? "var(--text-muted)" : "white", border: "none",
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: loading ? "none" : "0 8px 20px rgba(99,102,241,0.4)",
                                transform: loading ? "none" : "scale(1)",
                            }}
                            onMouseDown={(e) => !loading && (e.currentTarget.style.transform = "scale(0.98)")}
                            onMouseUp={(e) => !loading && (e.currentTarget.style.transform = "scale(1)")}
                            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = "scale(1)")}
                        >
                            {loading ? (
                                <><Loader2 size={20} className="animate-spin" /> Cooking Layout...</>
                            ) : (
                                <><Sparkles size={20} strokeWidth={2.5} /> Generate Website Layout</>
                            )}
                        </button>
                    </form>

                    {/* Result preview */}
                    <div className="h-full">
                        {!result && !loading && (
                            <div
                                className="glass rounded-[24px] flex flex-col items-center justify-center p-12 h-full text-center"
                                style={{ border: "1px solid var(--border-color)", minHeight: "600px" }}
                            >
                                <div className="p-6 rounded-full bg-white/5 mb-6 text-white/20">
                                    <Wand2 size={56} strokeWidth={1.5} />
                                </div>
                                <h2 className="text-2xl font-bold mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>
                                    Awaiting Instructions
                                </h2>
                                <p className="text-[16px] max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                                    Describe your concept, select the blocks you need, and watch our AI engineer your dream layout in seconds.
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div
                                className="glass rounded-[24px] flex flex-col items-center justify-center p-12 h-full text-center relative overflow-hidden"
                                style={{ border: "1px solid var(--border-color)", minHeight: "600px" }}
                            >
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{ background: "radial-gradient(circle at center, var(--color-primary) 0%, transparent 60%)" }}
                                />
                                <div
                                    className="flex items-center justify-center relative z-10 mb-8"
                                    style={{
                                        width: "80px", height: "80px", borderRadius: "50%",
                                        background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                                        boxShadow: "0 0 40px var(--color-primary)",
                                        animation: "pulse-glow 2s ease-in-out infinite",
                                    }}
                                >
                                    <Sparkles size={36} className="text-white animate-spin" style={{ animationDuration: '3s' }} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 tracking-tight relative z-10" style={{ color: "var(--text-primary)" }}>Engineering Layout...</h2>
                                <p className="text-[15px] relative z-10" style={{ color: "var(--text-secondary)" }}>Gemini AI is analyzing requirements and structuring pages.</p>
                            </div>
                        )}

                        {result && (
                            <div
                                className="glass rounded-[24px] p-8 animate-fade-in flex flex-col h-full"
                                style={{ border: "1px solid var(--border-color)" }}
                            >
                                <div className="flex items-center justify-between mb-6 bg-white/5 p-4 rounded-[16px] border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full">
                                            <CheckCircle size={20} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[18px] tracking-tight" style={{ color: "var(--text-primary)" }}>
                                                Generation Successful
                                            </h3>
                                            <p className="text-[13px] text-emerald-400 font-medium">{result.layout?.pages?.length} Pages Designed</p>
                                        </div>
                                    </div>
                                    {result.savedToWebsite && (
                                        <span className="text-[11px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full">
                                            Saved to Project
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {result.layout?.pages?.map((page, i) => (
                                        <div
                                            key={i}
                                            className="rounded-[16px] overflow-hidden transition-all duration-300 border border-white/10"
                                            style={{ background: "rgba(255,255,255,0.02)" }}
                                        >
                                            <button
                                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                                style={{ background: "none", border: "none", cursor: "pointer" }}
                                                onClick={() => setExpandedPage(expandedPage === i ? null : i)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                                        <Eye size={16} strokeWidth={2.5} />
                                                    </div>
                                                    <span className="text-[15px] font-bold tracking-wide" style={{ color: "var(--text-primary)" }}>{page.title}</span>
                                                    <code
                                                        className="text-[12px] px-2 py-1 rounded-md font-bold"
                                                        style={{ background: "var(--bg-input)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
                                                    >
                                                        /{page.slug}
                                                    </code>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[12px] font-bold bg-white/10 px-2 py-1 rounded-md" style={{ color: "var(--text-secondary)" }}>
                                                        {page.sections.length} blocks
                                                    </span>
                                                    <div className="text-white/40">
                                                        {expandedPage === i ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                    </div>
                                                </div>
                                            </button>

                                            {expandedPage === i && (
                                                <div className="px-4 pb-4 space-y-2 animate-fade-in bg-black/20 pt-2">
                                                    {page.sections.map((section, j) => (
                                                        <div
                                                            key={j}
                                                            className="flex items-center gap-3 p-3 rounded-[12px] border border-white/5"
                                                            style={{ background: "var(--bg-card)" }}
                                                        >
                                                            <Code2 size={16} className="text-indigo-400 opacity-70" />
                                                            <span
                                                                className="text-[13px] font-bold px-2 py-1 rounded-md uppercase tracking-wider"
                                                                style={{ background: "rgba(99,102,241,0.15)", color: "var(--color-primary)" }}
                                                            >
                                                                {section.type}
                                                            </span>
                                                            {section.props?.heading && (
                                                                <span className="text-[14px] truncate font-medium opacity-80" style={{ color: "var(--text-primary)" }}>
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
                                    <div className="mt-6 p-4 rounded-[16px] bg-amber-500/10 border border-amber-500/20 text-center">
                                        <p className="text-[14px] font-medium text-amber-500">
                                            ⚠️ This is a sandbox preview. Select a target website project above to apply these changes directly to your live site.
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
