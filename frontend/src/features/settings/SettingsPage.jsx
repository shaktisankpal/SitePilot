import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe, updateTenantBranding } from "../../store/slices/authSlice.js";
import api from "../../services/api.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import toast from "react-hot-toast";
import {
    Palette, Users, Globe, Plus, Trash2, Shield,
    Save, Crown, Pencil, Code2, CheckCircle2, LayoutTemplate, ChevronDown
} from "lucide-react";

const ROLE_COLORS = {
    OWNER: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.25)" },
    ADMIN: { bg: "rgba(99,102,241,0.12)", color: "#818cf8", border: "rgba(99,102,241,0.25)" },
    EDITOR: { bg: "rgba(16,185,129,0.12)", color: "#34d399", border: "rgba(16,185,129,0.25)" },
    DEVELOPER: { bg: "rgba(236,72,153,0.12)", color: "#f472b6", border: "rgba(236,72,153,0.25)" },
};
const ROLE_ICONS = { OWNER: Crown, ADMIN: Shield, EDITOR: Pencil, DEVELOPER: Code2 };

const inputStyle = {
    width: "100%", padding: "14px 18px", borderRadius: 14,
    background: "var(--bg-input)", border: "1px solid var(--border-color)",
    color: "var(--text-primary)", fontSize: 15, outline: "none",
    transition: "all 0.2s ease", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)",
};

export default function SettingsPage() {
    const dispatch = useDispatch();
    const { user, tenant } = useSelector((s) => s.auth);
    const [activeTab, setActiveTab] = useState("branding");
    const [users, setUsers] = useState([]);
    const [domains, setDomains] = useState([]);
    const [branding, setBranding] = useState(tenant?.branding || {});
    const [inviteForm, setInviteForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });
    const [newDomain, setNewDomain] = useState("");
    const [saving, setSaving] = useState(false);

    const isOwner = user?.role === "OWNER";
    const isAdmin = ["OWNER", "ADMIN"].includes(user?.role);

    useEffect(() => {
        if (isAdmin) {
            api.get("/auth/users").then((res) => setUsers(res.data.users)).catch(console.error);
            api.get("/domains").then((res) => setDomains(res.data.domains)).catch(console.error);
        }
    }, [isAdmin]);

    const handleSaveBranding = async () => {
        setSaving(true);
        try {
            await api.put("/tenant/branding", branding);
            dispatch(updateTenantBranding(branding));
            if (branding.primaryColor) document.documentElement.style.setProperty("--color-primary", branding.primaryColor);
            if (branding.secondaryColor) document.documentElement.style.setProperty("--color-secondary", branding.secondaryColor);
            toast.success("Branding updated! ✨");
        } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
        setSaving(false);
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/invite", inviteForm);
            toast.success(`${inviteForm.name} invited as ${inviteForm.role}`);
            setInviteForm({ name: "", email: "", password: "", role: "EDITOR" });
            const res = await api.get("/auth/users");
            setUsers(res.data.users);
        } catch (err) { toast.error(err.response?.data?.message || "Invite failed"); }
    };

    const handleRemoveUser = async (userId, name) => {
        if (!confirm(`Remove ${name} from workspace?`)) return;
        try {
            await api.delete(`/auth/users/${userId}`);
            setUsers((u) => u.filter((x) => x._id !== userId));
            toast.success("User removed");
        } catch (err) { toast.error(err.response?.data?.message || "Remove failed"); }
    };

    const handleRoleChange = async (userId, role) => {
        try {
            await api.put(`/auth/users/${userId}/role`, { role });
            setUsers((u) => u.map((x) => x._id === userId ? { ...x, role } : x));
            toast.success("Role updated");
        } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
    };

    const handleAddDomain = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/domains", { domain: newDomain });
            setDomains((d) => [...d, res.data.domain]);
            setNewDomain("");
            toast.success("Domain added!");
        } catch (err) { toast.error(err.response?.data?.message || "Failed to add domain"); }
    };

    const handleVerifyDomain = async (domainId) => {
        try {
            await api.post(`/domains/${domainId}/verify`);
            setDomains((d) => d.map((x) => x._id === domainId ? { ...x, verified: true } : x));
            toast.success("Domain verified!");
        } catch (err) { toast.error("Verification failed"); }
    };

    const tabs = [
        { id: "branding", label: "Branding Details", icon: Palette },
        ...(isAdmin ? [{ id: "team", label: "Team Members", icon: Users }] : []),
        ...(isOwner ? [{ id: "domains", label: "Custom Domains", icon: Globe }] : []),
    ];

    return (
        <DashboardLayout>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px 60px" }}>
                {/* Header */}
                <div style={{ marginBottom: 36 }}>
                    <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 6 }}>Settings</h1>
                    <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>Manage your workspace preferences, team, and domains.</p>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 40, paddingBottom: 0 }}>
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id} onClick={() => setActiveTab(id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "14px 24px",
                                fontSize: 15, fontWeight: 700, position: "relative", cursor: "pointer",
                                color: activeTab === id ? "var(--color-primary)" : "rgba(255,255,255,0.4)",
                                background: "none", border: "none", outline: "none",
                                borderBottom: activeTab === id ? "2px solid var(--color-primary)" : "2px solid transparent",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <Icon size={18} /> {label}
                        </button>
                    ))}
                </div>

                {/* ============ BRANDING TAB ============ */}
                {activeTab === "branding" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                        {/* Brand Identity Card */}
                        <div style={{
                            background: "var(--bg-card)", border: "1px solid var(--border-color)",
                            borderRadius: 24, padding: 36, display: "flex", flexDirection: "column", justifyContent: "space-between",
                        }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
                                    <div style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "white" }}>
                                        <Palette size={22} strokeWidth={2.5} />
                                    </div>
                                    <h3 style={{ fontWeight: 800, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Brand Identity</h3>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                                    {/* Primary Color */}
                                    <div style={{ paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Primary Color</label>
                                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                            <div style={{
                                                width: 64, height: 64, borderRadius: 16, flexShrink: 0, cursor: "pointer",
                                                background: branding.primaryColor || "#6366f1", position: "relative", overflow: "hidden",
                                                border: "2px solid rgba(255,255,255,0.1)", boxShadow: `0 4px 16px ${branding.primaryColor || "#6366f1"}40`,
                                            }}>
                                                <input type="color" value={branding.primaryColor || "#6366f1"}
                                                    onChange={(e) => setBranding((p) => ({ ...p, primaryColor: e.target.value }))}
                                                    style={{ position: "absolute", inset: -10, width: 120, height: 120, cursor: "pointer", opacity: 0 }}
                                                />
                                            </div>
                                            <input value={branding.primaryColor || "#6366f1"}
                                                onChange={(e) => setBranding((p) => ({ ...p, primaryColor: e.target.value }))}
                                                placeholder="#6366f1"
                                                style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 16, letterSpacing: 1 }}
                                            />
                                        </div>
                                    </div>

                                    {/* Secondary Color */}
                                    <div style={{ paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Secondary Color</label>
                                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                            <div style={{
                                                width: 64, height: 64, borderRadius: 16, flexShrink: 0, cursor: "pointer",
                                                background: branding.secondaryColor || "#8b5cf6", position: "relative", overflow: "hidden",
                                                border: "2px solid rgba(255,255,255,0.1)", boxShadow: `0 4px 16px ${branding.secondaryColor || "#8b5cf6"}40`,
                                            }}>
                                                <input type="color" value={branding.secondaryColor || "#8b5cf6"}
                                                    onChange={(e) => setBranding((p) => ({ ...p, secondaryColor: e.target.value }))}
                                                    style={{ position: "absolute", inset: -10, width: 120, height: 120, cursor: "pointer", opacity: 0 }}
                                                />
                                            </div>
                                            <input value={branding.secondaryColor || "#8b5cf6"}
                                                onChange={(e) => setBranding((p) => ({ ...p, secondaryColor: e.target.value }))}
                                                placeholder="#8b5cf6"
                                                style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 16, letterSpacing: 1 }}
                                            />
                                        </div>
                                    </div>

                                    {/* Font Family */}
                                    <div>
                                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Font Family</label>
                                        <div style={{ position: "relative" }}>
                                            <select value={branding.font || "Google Sans"}
                                                onChange={(e) => setBranding((p) => ({ ...p, font: e.target.value }))}
                                                style={{ ...inputStyle, appearance: "none", cursor: "pointer", fontFamily: branding.font || "Google Sans" }}
                                            >
                                                {["Google Sans", "Inter", "Roboto", "Outfit", "Playfair Display", "Montserrat", "Poppins"].map((f) => (
                                                    <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                                                ))}
                                            </select>
                                            <div style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.4 }}>
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isOwner && (
                                <button onClick={handleSaveBranding} disabled={saving} style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                    width: "100%", marginTop: 36, padding: "18px 0", borderRadius: 16,
                                    fontSize: 16, fontWeight: 800, cursor: "pointer",
                                    background: "var(--text-primary)", color: "var(--bg-base)", border: "none",
                                    opacity: saving ? 0.7 : 1, boxShadow: "0 8px 24px rgba(255,255,255,0.12)",
                                    transition: "all 0.2s ease",
                                }}>
                                    <Save size={20} /> {saving ? "Applying Changes..." : "Save Identity"}
                                </button>
                            )}
                        </div>

                        {/* Live Preview Card */}
                        <div style={{
                            background: "var(--bg-card)", border: "1px solid var(--border-color)",
                            borderRadius: 24, padding: 36, display: "flex", flexDirection: "column",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                                <div style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "white" }}>
                                    <LayoutTemplate size={22} strokeWidth={2.5} />
                                </div>
                                <h3 style={{ fontWeight: 800, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Live Preview</h3>
                            </div>

                            <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", flex: 1 }}>
                                {/* Mock navbar */}
                                <div style={{
                                    padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
                                    background: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.05)",
                                }}>
                                    <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: branding.primaryColor || "#6366f1" }}>
                                        {tenant?.name}
                                    </span>
                                    <div style={{ display: "flex", gap: 20 }}>
                                        {["Features", "Pricing", "Contact"].map((l) => (
                                            <span key={l} style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>{l}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Hero mock */}
                                <div style={{
                                    padding: "60px 32px", textAlign: "center", minHeight: 340,
                                    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                                    background: `radial-gradient(circle at 50% -20%, ${branding.primaryColor || "#6366f1"}25 0%, var(--bg-surface) 100%)`,
                                }}>
                                    <div style={{
                                        fontSize: 40, lineHeight: 1.1, fontWeight: 800, marginBottom: 20, maxWidth: "85%",
                                        background: `linear-gradient(135deg, ${branding.primaryColor || "#6366f1"}, ${branding.secondaryColor || "#8b5cf6"})`,
                                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                        fontFamily: `"${branding.font || "Google Sans"}", sans-serif`, letterSpacing: "-0.03em",
                                    }}>
                                        Create the extraordinary with {tenant?.name}
                                    </div>
                                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 32, maxWidth: "75%", lineHeight: 1.6 }}>
                                        Build stunning, high-performance websites generated seamlessly through artificial intelligence.
                                    </p>
                                    <div style={{
                                        display: "inline-block", padding: "14px 32px", borderRadius: 100, fontSize: 15, fontWeight: 700,
                                        background: `linear-gradient(135deg, ${branding.primaryColor || "#6366f1"}, ${branding.secondaryColor || "#8b5cf6"})`,
                                        color: "white", boxShadow: `0 10px 30px ${branding.primaryColor || "#6366f1"}35`,
                                    }}>
                                        Start Building Now
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ TEAM TAB ============ */}
                {activeTab === "team" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        {/* Invite Card */}
                        {isAdmin && (
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24, padding: 36 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                                    <div style={{ padding: 10, borderRadius: 12, background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
                                        <Users size={22} strokeWidth={2.5} />
                                    </div>
                                    <h3 style={{ fontWeight: 800, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Invite Member</h3>
                                </div>
                                <form onSubmit={handleInvite} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 16, alignItems: "end" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Full Name</label>
                                        <input value={inviteForm.name} onChange={(e) => setInviteForm((p) => ({ ...p, name: e.target.value }))}
                                            placeholder="John Doe" required style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Email Address</label>
                                        <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))}
                                            placeholder="john@example.com" required style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Password</label>
                                        <input type="password" value={inviteForm.password} onChange={(e) => setInviteForm((p) => ({ ...p, password: e.target.value }))}
                                            placeholder="••••••••" required minLength={6} style={inputStyle} />
                                    </div>
                                    <div style={{ display: "flex", gap: 10, height: 50 }}>
                                        <div style={{ position: "relative" }}>
                                            <select value={inviteForm.role} onChange={(e) => setInviteForm((p) => ({ ...p, role: e.target.value }))}
                                                style={{ ...inputStyle, width: 130, height: "100%", appearance: "none", cursor: "pointer", paddingRight: 36 }}>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="EDITOR">EDITOR</option>
                                                <option value="DEVELOPER">DEVELOPER</option>
                                            </select>
                                            <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.4 }}>
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                        <button type="submit" style={{
                                            width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                                            background: "var(--text-primary)", color: "var(--bg-base)", border: "none", cursor: "pointer", flexShrink: 0,
                                        }}>
                                            <Plus size={20} strokeWidth={3} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Active Directory */}
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24, padding: 36 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                                <div style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" }}>
                                    <Shield size={22} strokeWidth={2.5} />
                                </div>
                                <h3 style={{ fontWeight: 800, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                                    Active Directory <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18, marginLeft: 8 }}>({users.length})</span>
                                </h3>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {users.map((u) => {
                                    const RoleIcon = ROLE_ICONS[u.role] || Shield;
                                    const rs = ROLE_COLORS[u.role] || {};
                                    return (
                                        <div key={u._id} style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.02)",
                                            border: "1px solid transparent", transition: "all 0.15s ease",
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "transparent"; }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                <div style={{
                                                    width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                                                    background: "var(--bg-input)", border: "1px solid var(--border-color)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    color: "var(--text-primary)", fontSize: 18, fontWeight: 800,
                                                }}>
                                                    {u.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{u.name}</p>
                                                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{u.email}</p>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                <span style={{
                                                    display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800,
                                                    textTransform: "uppercase", letterSpacing: "0.06em",
                                                    padding: "6px 14px", borderRadius: 100,
                                                    background: rs.bg, color: rs.color, border: `1px solid ${rs.border}`,
                                                }}>
                                                    <RoleIcon size={12} strokeWidth={3} /> {u.role}
                                                </span>

                                                {isOwner && u.role !== "OWNER" && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div style={{ position: "relative" }}>
                                                            <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                                style={{ fontSize: 13, fontWeight: 700, padding: "10px 32px 10px 14px", borderRadius: 12, background: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)", cursor: "pointer", outline: "none", appearance: "none" }}>
                                                                <option value="ADMIN">ADMIN</option>
                                                                <option value="EDITOR">EDITOR</option>
                                                                <option value="DEVELOPER">DEVELOPER</option>
                                                            </select>
                                                            <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.4 }}>
                                                                <ChevronDown size={12} />
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleRemoveUser(u._id, u.name)} style={{
                                                            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                                            borderRadius: 12, color: "#f87171", cursor: "pointer", padding: 10, display: "flex",
                                                        }}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ DOMAINS TAB ============ */}
                {activeTab === "domains" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        {/* Add Domain */}
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24, padding: 36 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                                <div style={{ padding: 10, borderRadius: 12, background: "rgba(16,185,129,0.12)", color: "#34d399" }}>
                                    <Globe size={22} strokeWidth={2.5} />
                                </div>
                                <h3 style={{ fontWeight: 800, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Connectivity</h3>
                            </div>
                            <form onSubmit={handleAddDomain} style={{ display: "flex", gap: 16, alignItems: "end" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Connect Custom Domain</label>
                                    <input value={newDomain} onChange={(e) => setNewDomain(e.target.value)}
                                        placeholder="www.yourstartup.com" required style={inputStyle} />
                                </div>
                                <button type="submit" style={{
                                    height: 50, padding: "0 28px", borderRadius: 14,
                                    background: "var(--text-primary)", color: "var(--bg-base)", border: "none",
                                    cursor: "pointer", fontWeight: 700, fontSize: 15, flexShrink: 0,
                                }}>
                                    Add Domain
                                </button>
                            </form>
                        </div>

                        {/* Domains List */}
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24, padding: 36 }}>
                            <h3 style={{ fontWeight: 800, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: 24 }}>Active Domains</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {domains.map((d) => (
                                    <div key={d._id} style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.02)",
                                        border: "1px solid transparent", transition: "all 0.15s ease",
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "transparent"; }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                            <div style={{ padding: 10, borderRadius: 12, background: d.verified ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)" }}>
                                                <Globe size={20} style={{ color: d.verified ? "#10b981" : "var(--text-muted)" }} />
                                            </div>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>{d.domain}</span>
                                                    {d.isDefault && (
                                                        <span style={{ background: "rgba(255,255,255,0.08)", fontSize: 10, textTransform: "uppercase", fontWeight: 800, padding: "3px 8px", borderRadius: 100, color: "rgba(255,255,255,0.5)" }}>Primary</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                            <span style={{
                                                display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800,
                                                textTransform: "uppercase", letterSpacing: "0.06em", padding: "6px 14px", borderRadius: 100,
                                                background: d.verified ? "rgba(16,185,129,0.12)" : "rgba(251,191,36,0.12)",
                                                color: d.verified ? "#10b981" : "#fbbf24",
                                                border: `1px solid ${d.verified ? "rgba(16,185,129,0.25)" : "rgba(251,191,36,0.25)"}`,
                                            }}>
                                                {d.verified && <CheckCircle2 size={13} />}
                                                {d.verified ? "Verified" : "Pending Setup"}
                                            </span>
                                            {!d.verified && !d.isDefault && (
                                                <button onClick={() => handleVerifyDomain(d._id)} style={{
                                                    fontSize: 14, color: "var(--color-primary)", background: "none",
                                                    border: "none", cursor: "pointer", fontWeight: 700,
                                                }}>
                                                    Verify Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {domains.length === 0 && (
                                    <div style={{ textAlign: "center", padding: "48px 0" }}>
                                        <Globe size={40} style={{ color: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }} />
                                        <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>No custom domains configured.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
