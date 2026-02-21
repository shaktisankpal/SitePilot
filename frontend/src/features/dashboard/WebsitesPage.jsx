import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchWebsites, createWebsite, deleteWebsite, publishWebsite } from "../../store/slices/websiteSlice.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import toast from "react-hot-toast";
import {
    Globe, Plus, Pencil, Trash2, Rocket, ExternalLink,
    CheckCircle, Clock, X, Loader2,
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        >
            <div
                className="glass animate-fade-in w-full"
                style={{ maxWidth: "460px", padding: "32px", borderRadius: "var(--radius-lg)" }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>New Website</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                            Website Name *
                        </label>
                        <input
                            value={data.name} onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
                            placeholder="My Awesome Website" required
                            style={{
                                width: "100%", padding: "11px 14px", borderRadius: "var(--radius-sm)",
                                background: "var(--bg-input)", border: "1px solid var(--border-color)",
                                color: "var(--text-primary)", fontSize: "14px", outline: "none",
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                            Description
                        </label>
                        <textarea
                            value={data.description} onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))}
                            placeholder="What is this website about?" rows={3}
                            style={{
                                width: "100%", padding: "11px 14px", borderRadius: "var(--radius-sm)",
                                background: "var(--bg-input)", border: "1px solid var(--border-color)",
                                color: "var(--text-primary)", fontSize: "14px", outline: "none", resize: "none",
                            }}
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            style={{
                                flex: 1, padding: "11px", borderRadius: "var(--radius-sm)",
                                background: "var(--bg-input)", border: "1px solid var(--border-color)",
                                color: "var(--text-primary)", cursor: "pointer", fontSize: "14px",
                            }}
                        >Cancel</button>
                        <button type="submit" disabled={loading}
                            style={{
                                flex: 1, padding: "11px", borderRadius: "100px",
                                background: "var(--text-primary)",
                                color: "var(--bg-base)", border: "none", cursor: "pointer", fontSize: "14px",
                                fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                            }}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Create</>}
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
            toast.success("Website created! 🎉");
        } else {
            toast.error(res.payload || "Failed to create website");
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        const res = await dispatch(deleteWebsite(id));
        if (deleteWebsite.fulfilled.match(res)) toast.success("Website deleted");
        else toast.error("Delete failed");
    };

    const handlePublish = async (id) => {
        const res = await dispatch(publishWebsite(id));
        if (publishWebsite.fulfilled.match(res)) toast.success("Website published! 🚀");
        else toast.error(res.payload || "Publish failed");
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Websites</h1>
                        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{websites.length} website{websites.length !== 1 ? "s" : ""} in your workspace</p>
                    </div>
                    {canCreate && (
                        <button
                            onClick={() => setShowCreate(true)}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "8px",
                                padding: "10px 20px", borderRadius: "100px",
                                background: "var(--text-primary)",
                                color: "var(--bg-base)", border: "none", cursor: "pointer",
                                fontWeight: "600", fontSize: "13px",
                            }}
                        >
                            <Plus size={16} /> New Website
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="shimmer rounded-2xl" style={{ height: "200px" }} />
                        ))}
                    </div>
                ) : websites.length === 0 ? (
                    <div
                        className="glass rounded-2xl flex flex-col items-center justify-center py-20"
                        style={{ border: "1px solid var(--border-color)" }}
                    >
                        <Globe size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No websites yet</h3>
                        <p className="mb-6" style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Create your first website to get started</p>
                        {canCreate && (
                            <button
                                onClick={() => setShowCreate(true)}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: "8px",
                                    padding: "10px 24px", borderRadius: "100px",
                                    background: "var(--text-primary)",
                                    color: "var(--bg-base)", border: "none", cursor: "pointer", fontWeight: "600",
                                }}
                            >
                                <Plus size={16} /> Create Website
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {websites.map((site) => (
                            <div
                                key={site._id}
                                className="glass rounded-2xl p-5 animate-fade-in"
                                style={{ border: "1px solid var(--border-color)", transition: "var(--transition)" }}
                            >
                                {/* Status badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span
                                        className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                                        style={{
                                            background: site.status === "published" ? "rgba(16,185,129,0.15)" : "rgba(99,102,241,0.15)",
                                            color: site.status === "published" ? "#10b981" : "var(--color-primary)",
                                            border: `1px solid ${site.status === "published" ? "rgba(16,185,129,0.3)" : "rgba(99,102,241,0.3)"}`,
                                        }}
                                    >
                                        {site.status === "published" ? <CheckCircle size={11} /> : <Clock size={11} />}
                                        {site.status}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        {site.status === "published" && (
                                            <a
                                                href={`/site/${site.defaultDomain?.split(".")[0]}`}
                                                target="_blank" rel="noreferrer"
                                                className="p-1.5 rounded-lg hover:bg-white/5"
                                                style={{ color: "var(--text-muted)" }}
                                                title="View live site"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Site icon */}
                                <div
                                    className="flex items-center justify-center rounded-xl mb-4"
                                    style={{
                                        height: "80px",
                                        background: "var(--bg-input)",
                                        border: "1px solid var(--border-color)",
                                    }}
                                >
                                    <Globe size={32} style={{ color: "var(--color-primary)", opacity: 0.7 }} />
                                </div>

                                <h3 className="font-semibold text-base mb-1 truncate" style={{ color: "var(--text-primary)" }}>
                                    {site.name}
                                </h3>
                                {site.description && (
                                    <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                                        {site.description}
                                    </p>
                                )}
                                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                                    {site.defaultDomain} • by {site.createdBy?.name || "You"}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        to={`/websites/${site._id}/builder`}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium"
                                        style={{
                                            background: "rgba(99,102,241,0.15)", color: "var(--color-primary)",
                                            border: "1px solid rgba(99,102,241,0.3)", textDecoration: "none",
                                        }}
                                    >
                                        <Pencil size={13} /> Edit
                                    </Link>

                                    {canPublish && site.status !== "published" && (
                                        <button
                                            onClick={() => handlePublish(site._id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium"
                                            style={{
                                                background: "rgba(16,185,129,0.15)", color: "#10b981",
                                                border: "1px solid rgba(16,185,129,0.3)", cursor: "pointer",
                                            }}
                                        >
                                            <Rocket size={13} /> Publish
                                        </button>
                                    )}

                                    {canDelete && (
                                        <button
                                            onClick={() => handleDelete(site._id, site.name)}
                                            className="p-2 rounded-lg"
                                            style={{
                                                background: "rgba(239,68,68,0.1)", color: "#f87171",
                                                border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer",
                                            }}
                                        >
                                            <Trash2 size={14} />
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
