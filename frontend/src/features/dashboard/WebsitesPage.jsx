import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchWebsites, createWebsite, deleteWebsite, publishWebsite } from "../../store/slices/websiteSlice.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import toast from "react-hot-toast";
import {
    Globe, Plus, Pencil, Trash2, Rocket, ExternalLink,
    CheckCircle, Clock, X, Loader2, Link as LinkIcon, FolderDot
} from "lucide-react";

const CreateWebsiteModal = ({ onClose, onCreate }) => {
    const [data, setData] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onCreate(data);
        setLoading(false);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
        >
            <div
                className="glass w-full relative overflow-hidden"
                style={{
                    maxWidth: "500px", padding: "40px", borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset"
                }}
            >
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }} />

                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-[12px] bg-white/5 text-white/80">
                                <FolderDot size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>New Project</h2>
                        </div>
                        <p className="text-[14px] text-white/50 pl-[52px]">Launch a new website instance in this workspace.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors" style={{ border: "none", cursor: "pointer", color: "var(--text-muted)", background: "none" }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-[13px] font-bold uppercase tracking-wider text-white/50 px-1">
                            Project Name *
                        </label>
                        <input
                            value={data.name} onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. My Awesome Startup" required autoFocus
                            style={{
                                width: "100%", padding: "14px 18px", borderRadius: "14px",
                                background: "var(--bg-input)", border: "1px solid var(--border-color)",
                                color: "var(--text-primary)", fontSize: "15px", outline: "none",
                                transition: "all 0.2s ease", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)"
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[13px] font-bold uppercase tracking-wider text-white/50 px-1">
                            Brief Description
                        </label>
                        <textarea
                            value={data.description} onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))}
                            placeholder="What is the purpose of this website?" rows={3}
                            style={{
                                width: "100%", padding: "14px 18px", borderRadius: "14px",
                                background: "var(--bg-input)", border: "1px solid var(--border-color)",
                                color: "var(--text-primary)", fontSize: "15px", outline: "none", resize: "none",
                                transition: "all 0.2s ease", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)"
                            }}
                        />
                    </div>
                    <div className="flex gap-3 pt-6">
                        <button type="button" onClick={onClose}
                            className="hover:bg-white/5 transition-colors"
                            style={{
                                flex: 1, padding: "14px", borderRadius: "14px",
                                background: "transparent", border: "1px solid var(--border-color)",
                                color: "var(--text-primary)", cursor: "pointer", fontSize: "15px", fontWeight: "600"
                            }}
                        >Discard</button>
                        <button type="submit" disabled={loading}
                            className="transition-transform hover:-translate-y-0.5"
                            style={{
                                flex: 2, padding: "14px", borderRadius: "14px",
                                background: "var(--text-primary)",
                                color: "var(--bg-base)", border: "none", cursor: "pointer", fontSize: "15px",
                                fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                opacity: loading ? 0.7 : 1, boxShadow: loading ? "none" : "0 8px 16px rgba(255,255,255,0.1)"
                            }}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} strokeWidth={2.5} /> Create Project</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function WebsitesPage() {
    const dispatch = useDispatch();
    const { websites, loading } = useSelector((s) => s.website);
    const { user } = useSelector((s) => s.auth);
    const [showCreate, setShowCreate] = useState(false);

    const canCreate = ["OWNER", "ADMIN"].includes(user?.role);
    const canPublish = ["OWNER", "ADMIN"].includes(user?.role);
    const canDelete = ["OWNER", "ADMIN"].includes(user?.role);

    useEffect(() => { dispatch(fetchWebsites()); }, [dispatch]);

    const handleCreate = async (data) => {
        const res = await dispatch(createWebsite(data));
        if (createWebsite.fulfilled.match(res)) {
            toast.success("Project created! 🎉");
        } else {
            toast.error(res.payload || "Failed to create project");
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
        const res = await dispatch(deleteWebsite(id));
        if (deleteWebsite.fulfilled.match(res)) toast.success("Project deleted");
        else toast.error("Delete failed");
    };

    const handlePublish = async (id) => {
        const res = await dispatch(publishWebsite(id));
        if (publishWebsite.fulfilled.match(res)) toast.success("Project deployed! 🚀");
        else toast.error(res.payload || "Deployment failed");
    };

    return (
        <DashboardLayout>
            <div className="w-full max-w-[1400px] mx-auto p-6 md:p-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Projects</h1>
                        <p className="text-[16px]" style={{ color: "var(--text-secondary)" }}>
                            You have <span className="font-bold text-white/80">{websites.length}</span> active project{websites.length !== 1 ? "s" : ""} in this workspace.
                        </p>
                    </div>
                    {canCreate && (
                        <button
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-[14px] text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group"
                            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", fontWeight: "700", fontSize: "15px", border: "none", cursor: "pointer" }}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <Plus size={18} strokeWidth={2.5} className="relative z-10" />
                            <span className="relative z-10">New Project</span>
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="shimmer rounded-[24px]" style={{ height: "300px" }} />
                        ))}
                    </div>
                ) : websites.length === 0 ? (
                    <div
                        className="glass rounded-[32px] flex flex-col items-center justify-center py-24 px-4 text-center"
                        style={{ border: "1px dashed rgba(255,255,255,0.15)" }}
                    >
                        <div className="p-6 rounded-full bg-white/5 mb-6 text-white/20">
                            <FolderDot size={56} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>No Projects Found</h3>
                        <p className="mb-8 text-[15px] max-w-sm mx-auto" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            Your workspace is empty. Create your first project to start building your website.
                        </p>
                        {canCreate && (
                            <button
                                onClick={() => setShowCreate(true)}
                                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-[16px] text-black transition-transform hover:-translate-y-0.5 shadow-xl"
                                style={{
                                    background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "16px"
                                }}
                            >
                                <Plus size={20} strokeWidth={3} /> Initialize Project
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {websites.map((site) => (
                            <div
                                key={site._id}
                                className="glass rounded-[24px] p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden"
                                style={{ border: "1px solid var(--border-color)", background: "var(--bg-card)" }}
                            >
                                <div
                                    className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-[0.03] pointer-events-none"
                                    style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
                                />

                                {/* Status Header */}
                                <div className="flex items-start justify-between mb-8 relative z-10">
                                    <div
                                        className="flex items-center justify-center rounded-[16px] shadow-sm ring-1 ring-white/5"
                                        style={{ width: "56px", height: "56px", background: "var(--bg-input)" }}
                                    >
                                        <Globe size={28} className="opacity-80" style={{ color: "var(--color-primary)" }} />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className="text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full font-extrabold flex items-center gap-1.5"
                                            style={{
                                                background: site.status === "published" ? "color-mix(in srgb, #10b981 12%, transparent)" : "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                                                color: site.status === "published" ? "#10b981" : "var(--color-primary)",
                                                border: `1px solid color-mix(in srgb, ${site.status === "published" ? "#10b981" : "var(--color-primary)"} 30%, transparent)`,
                                            }}
                                        >
                                            {site.status === "published" ? <CheckCircle size={12} strokeWidth={3} /> : <Clock size={12} strokeWidth={3} />}
                                            {site.status === "published" ? "Live" : "Draft"}
                                        </span>

                                        {site.status === "published" && (
                                            <a
                                                href={`/site/${site.defaultDomain?.split(".")[0]}`}
                                                target="_blank" rel="noreferrer"
                                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                                style={{ color: "var(--text-primary)" }}
                                                title="View live site"
                                            >
                                                <ExternalLink size={16} strokeWidth={2.5} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-grow relative z-10 mb-8">
                                    <h3 className="font-extrabold text-2xl tracking-tight mb-2 truncate" style={{ color: "var(--text-primary)" }}>
                                        {site.name}
                                    </h3>
                                    {site.description ? (
                                        <p className="text-[14px] leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                                            {site.description}
                                        </p>
                                    ) : (
                                        <p className="text-[14px] italic opacity-50" style={{ color: "var(--text-muted)" }}>
                                            No description provided.
                                        </p>
                                    )}
                                    <div className="mt-5 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: "var(--text-muted)" }}>
                                            <LinkIcon size={14} /> <span className="truncate">{site.defaultDomain}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[12px] opacity-70" style={{ color: "var(--text-muted)" }}>
                                            Created by <span className="font-bold">{site.createdBy?.name || "You"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 relative z-10">
                                    <Link
                                        to={`/websites/${site._id}/builder`}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-[14px] font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0"
                                        style={{
                                            background: "color-mix(in srgb, var(--color-primary) 15%, transparent)", color: "var(--color-primary)",
                                            textDecoration: "none", border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)"
                                        }}
                                    >
                                        <Pencil size={16} strokeWidth={2.5} /> Enter Builder
                                    </Link>

                                    {canPublish && site.status !== "published" && (
                                        <button
                                            onClick={() => handlePublish(site._id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-[14px] font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0"
                                            style={{
                                                background: "color-mix(in srgb, #10b981 15%, transparent)", color: "#10b981",
                                                border: "1px solid color-mix(in srgb, #10b981 30%, transparent)", cursor: "pointer",
                                            }}
                                        >
                                            <Rocket size={16} strokeWidth={2.5} /> Deploy
                                        </button>
                                    )}

                                    {canDelete && (
                                        <button
                                            onClick={() => handleDelete(site._id, site.name)}
                                            className="p-3 rounded-[12px] transition-colors hover:bg-red-500/20"
                                            style={{
                                                background: "rgba(239,68,68,0.1)", color: "#f87171",
                                                border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer",
                                            }}
                                            title="Delete Project"
                                        >
                                            <Trash2 size={18} strokeWidth={2.5} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreate && (
                <CreateWebsiteModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
            )}
        </DashboardLayout>
    );
}
