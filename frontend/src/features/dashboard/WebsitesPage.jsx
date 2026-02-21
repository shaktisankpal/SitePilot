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

const inputStyle = {
    width: "100%", padding: "14px 18px", borderRadius: 14,
    background: "var(--bg-input)", border: "1px solid var(--border-color)",
    color: "var(--text-primary)", fontSize: 15, outline: "none",
    transition: "all 0.2s ease", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)",
};

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
        <div style={{
            position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)",
        }}>
            <div style={{
                width: "100%", maxWidth: 500, padding: 40, borderRadius: 24,
                background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden",
            }}>
                {/* Top accent bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }} />

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                            <div style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)" }}>
                                <FolderDot size={24} strokeWidth={2.5} />
                            </div>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>New Project</h2>
                        </div>
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", paddingLeft: 52 }}>Create a new website project in this workspace.</p>
                    </div>
                    <button onClick={onClose} style={{ padding: 8, borderRadius: "50%", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Project Name *</label>
                        <input value={data.name} onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. My Awesome Startup" required autoFocus style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: 28 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Description</label>
                        <textarea value={data.description} onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))} placeholder="What is this website about?" rows={3} style={{ ...inputStyle, resize: "none" }} />
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button type="button" onClick={onClose} style={{
                            flex: 1, padding: 14, borderRadius: 14, background: "transparent",
                            border: "1px solid var(--border-color)", color: "var(--text-primary)", cursor: "pointer", fontSize: 15, fontWeight: 600,
                        }}>Cancel</button>
                        <button type="submit" disabled={loading} style={{
                            flex: 2, padding: 14, borderRadius: 14, background: "var(--text-primary)",
                            color: "var(--bg-base)", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            opacity: loading ? 0.7 : 1,
                        }}>
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
    const { user, tenant } = useSelector((s) => s.auth);
    const [showCreate, setShowCreate] = useState(false);

    const canCreate = ["OWNER", "ADMIN"].includes(user?.role);
    const canPublish = ["OWNER", "ADMIN"].includes(user?.role);
    const canDelete = ["OWNER", "ADMIN"].includes(user?.role);

    useEffect(() => { dispatch(fetchWebsites()); }, [dispatch]);

    const handleCreate = async (data) => {
        const res = await dispatch(createWebsite(data));
        if (createWebsite.fulfilled.match(res)) toast.success("Project created! 🎉");
        else toast.error(res.payload || "Failed to create project");
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        const res = await dispatch(deleteWebsite(id));
        if (deleteWebsite.fulfilled.match(res)) toast.success("Project deleted");
        else toast.error("Delete failed");
    };

    const handlePublish = async (id) => {
        const res = await dispatch(publishWebsite({ id }));
        if (publishWebsite.fulfilled.match(res)) toast.success("Project deployed! 🚀");
        else toast.error(res.payload || "Deployment failed");
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 40px 60px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
                    <div>
                        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 6 }}>Projects</h1>
                        <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>
                            You have <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{websites.length}</span> active project{websites.length !== 1 ? "s" : ""} in this workspace.
                        </p>
                    </div>
                    {canCreate && (
                        <button onClick={() => setShowCreate(true)} style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "14px 28px", borderRadius: 14, border: "none", cursor: "pointer",
                            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                            color: "white", fontWeight: 700, fontSize: 15,
                            boxShadow: "0 6px 20px rgba(99,102,241,0.3)",
                        }}>
                            <Plus size={18} strokeWidth={2.5} /> New Project
                        </button>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 28 }}>
                        {[...Array(3)].map((_, i) => <div key={i} className="shimmer" style={{ height: 320, borderRadius: 24 }} />)}
                    </div>
                ) : websites.length === 0 ? (
                    <div style={{
                        background: "var(--bg-card)", border: "1px dashed rgba(255,255,255,0.15)",
                        borderRadius: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        padding: "80px 20px", textAlign: "center",
                    }}>
                        <div style={{ padding: 24, borderRadius: "50%", background: "rgba(255,255,255,0.04)", marginBottom: 24 }}>
                            <FolderDot size={56} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.15)" }} />
                        </div>
                        <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>No Projects Found</h3>
                        <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 360, lineHeight: 1.6, marginBottom: 32 }}>
                            Your workspace is empty. Create your first project to start building your website.
                        </p>
                        {canCreate && (
                            <button onClick={() => setShowCreate(true)} style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "16px 32px", borderRadius: 16, border: "none", cursor: "pointer",
                                background: "rgba(255,255,255,0.9)", color: "black", fontWeight: 700, fontSize: 16,
                            }}>
                                <Plus size={20} strokeWidth={3} /> Create Project
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 28 }}>
                        {websites.map((site) => (
                            <div key={site._id} style={{
                                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                                borderRadius: 24, padding: 32, display: "flex", flexDirection: "column",
                                transition: "transform 0.3s ease", position: "relative", overflow: "hidden",
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                {/* Header */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
                                    <div style={{
                                        width: 52, height: 52, borderRadius: 16, background: "var(--bg-input)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <Globe size={26} style={{ color: "var(--color-primary)", opacity: 0.8 }} />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{
                                            fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em",
                                            padding: "5px 12px", borderRadius: 100, fontWeight: 800,
                                            display: "flex", alignItems: "center", gap: 5,
                                            background: site.status === "published" ? "rgba(16,185,129,0.12)" : "rgba(99,102,241,0.12)",
                                            color: site.status === "published" ? "#10b981" : "var(--color-primary)",
                                            border: `1px solid ${site.status === "published" ? "rgba(16,185,129,0.3)" : "rgba(99,102,241,0.3)"}`,
                                        }}>
                                            {site.status === "published" ? <CheckCircle size={11} strokeWidth={3} /> : <Clock size={11} strokeWidth={3} />}
                                            {site.status === "published" ? "Live" : "Draft"}
                                        </span>
                                        {site.status === "published" && (
                                            <a href={`/site/${tenant?.slug || ""}?websiteId=${site._id}`} target="_blank" rel="noreferrer"
                                                style={{ padding: 6, borderRadius: "50%", background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", display: "flex" }}>
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, marginBottom: 28 }}>
                                    <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {site.name}
                                    </h3>
                                    {site.description ? (
                                        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{site.description}</p>
                                    ) : (
                                        <p style={{ fontSize: 14, color: "var(--text-muted)", fontStyle: "italic", opacity: 0.5 }}>No description provided.</p>
                                    )}
                                    <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>
                                            <LinkIcon size={13} /> <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{site.defaultDomain}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: "var(--text-muted)", opacity: 0.7 }}>
                                            Created by <span style={{ fontWeight: 700 }}>{site.createdBy?.name || "You"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Link to={`/websites/${site._id}/builder`} style={{
                                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                        padding: "12px 0", borderRadius: 12, textDecoration: "none",
                                        background: "rgba(99,102,241,0.12)", color: "var(--color-primary)",
                                        border: "1px solid rgba(99,102,241,0.25)", fontSize: 14, fontWeight: 700,
                                    }}>
                                        <Pencil size={15} strokeWidth={2.5} /> Edit
                                    </Link>
                                    {canPublish && site.status !== "published" && (
                                        <button onClick={() => handlePublish(site._id)} style={{
                                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                            padding: "12px 0", borderRadius: 12, cursor: "pointer",
                                            background: "rgba(16,185,129,0.12)", color: "#10b981",
                                            border: "1px solid rgba(16,185,129,0.25)", fontSize: 14, fontWeight: 700,
                                        }}>
                                            <Rocket size={15} strokeWidth={2.5} /> Deploy
                                        </button>
                                    )}
                                    {canDelete && (
                                        <button onClick={() => handleDelete(site._id, site.name)} style={{
                                            padding: 12, borderRadius: 12, cursor: "pointer",
                                            background: "rgba(239,68,68,0.1)", color: "#f87171",
                                            border: "1px solid rgba(239,68,68,0.2)", display: "flex",
                                        }}>
                                            <Trash2 size={16} strokeWidth={2.5} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreate && <CreateWebsiteModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
        </DashboardLayout>
    );
}
