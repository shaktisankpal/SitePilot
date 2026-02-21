import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe, updateTenantBranding } from "../../store/slices/authSlice.js";
import api from "../../services/api.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import toast from "react-hot-toast";
import {
    Palette, Users, Globe, Plus, Trash2, Shield,
    Save, Crown, Pencil, Code2, CheckCircle2, LayoutTemplate
} from "lucide-react";

const ROLE_COLORS = {
    OWNER: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
    ADMIN: { bg: "rgba(99,102,241,0.15)", color: "#818cf8", border: "rgba(99,102,241,0.3)" },
    EDITOR: { bg: "rgba(16,185,129,0.15)", color: "#34d399", border: "rgba(16,185,129,0.3)" },
    DEVELOPER: { bg: "rgba(236,72,153,0.15)", color: "#f472b6", border: "rgba(236,72,153,0.3)" },
};

const ROLE_ICONS = { OWNER: Crown, ADMIN: Shield, EDITOR: Pencil, DEVELOPER: Code2 };

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
            // Apply CSS vars live
            if (branding.primaryColor) document.documentElement.style.setProperty("--color-primary", branding.primaryColor);
            if (branding.secondaryColor) document.documentElement.style.setProperty("--color-secondary", branding.secondaryColor);
            toast.success("Branding updated! ✨", { style: { background: 'var(--bg-card)', color: "var(--text-primary)", border: "1px solid var(--border-color)" } });
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
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
        } catch (err) {
            toast.error(err.response?.data?.message || "Invite failed");
        }
    };

    const handleRemoveUser = async (userId, name) => {
        if (!confirm(`Remove ${name} from workspace?`)) return;
        try {
            await api.delete(`/auth/users/${userId}`);
            setUsers((u) => u.filter((x) => x._id !== userId));
            toast.success("User removed");
        } catch (err) {
            toast.error(err.response?.data?.message || "Remove failed");
        }
    };

    const handleRoleChange = async (userId, role) => {
        try {
            await api.put(`/auth/users/${userId}/role`, { role });
            setUsers((u) => u.map((x) => x._id === userId ? { ...x, role } : x));
            toast.success("Role updated");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    const handleAddDomain = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/domains", { domain: newDomain });
            setDomains((d) => [...d, res.data.domain]);
            setNewDomain("");
            toast.success("Domain added! Check verification instructions.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add domain");
        }
    };

    const handleVerifyDomain = async (domainId) => {
        try {
            await api.post(`/domains/${domainId}/verify`);
            setDomains((d) => d.map((x) => x._id === domainId ? { ...x, verified: true } : x));
            toast.success("Domain verified!");
        } catch (err) {
            toast.error("Verification failed");
        }
    };

    const tabs = [
        { id: "branding", label: "Branding Details", icon: Palette },
        ...(isAdmin ? [{ id: "team", label: "Team Members", icon: Users }] : []),
        ...(isOwner ? [{ id: "domains", label: "Custom Domains", icon: Globe }] : []),
    ];

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
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Settings</h1>
                    <p className="text-[16px]" style={{ color: "var(--text-secondary)" }}>Manage your workspace preferences, team, and domains.</p>
                </div>

                {/* Modern Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-0.5">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id} onClick={() => setActiveTab(id)}
                            className="flex items-center gap-2.5 px-6 py-3.5 text-[15px] font-semibold transition-all relative outline-none"
                            style={{
                                color: activeTab === id ? "var(--color-primary)" : "var(--text-secondary)",
                                background: "none", border: "none", cursor: "pointer",
                            }}
                        >
                            <Icon size={18} />
                            {label}
                            {activeTab === id && (
                                <div
                                    className="absolute bottom-0 left-0 w-full h-[2px] rounded-t-full"
                                    style={{ background: "var(--color-primary)" }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-8">
                    {/* Branding Tab */}
                    {activeTab === "branding" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass rounded-[24px] p-8 md:p-10 flex flex-col justify-between" style={{ border: "1px solid var(--border-color)" }}>
                                <div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2.5 rounded-[12px] bg-white/5" style={{ color: "var(--text-primary)" }}>
                                            <Palette size={22} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="font-bold text-2xl tracking-tight" style={{ color: "var(--text-primary)" }}>Brand Identity</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4 border-b border-white/5 pb-6">
                                            <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/50">
                                                Primary Color
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-16 h-16 rounded-[14px] ring-2 ring-white/10 flex-shrink-0 cursor-pointer overflow-hidden relative"
                                                    style={{ background: branding.primaryColor || "#6366f1" }}
                                                >
                                                    <input type="color" value={branding.primaryColor || "#6366f1"}
                                                        onChange={(e) => setBranding((p) => ({ ...p, primaryColor: e.target.value }))}
                                                        className="absolute inset-[-10px] w-32 h-32 cursor-pointer opacity-0"
                                                    />
                                                </div>
                                                <input value={branding.primaryColor || "#6366f1"} onChange={(e) => setBranding((p) => ({ ...p, primaryColor: e.target.value }))}
                                                    placeholder="#6366f1" style={{ ...inputStyle, fontFamily: "monospace", fontSize: "16px", letterSpacing: "1px" }} />
                                            </div>
                                        </div>

                                        <div className="space-y-4 border-b border-white/5 pb-6">
                                            <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/50">
                                                Secondary Color
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-16 h-16 rounded-[14px] ring-2 ring-white/10 flex-shrink-0 cursor-pointer overflow-hidden relative"
                                                    style={{ background: branding.secondaryColor || "#8b5cf6" }}
                                                >
                                                    <input type="color" value={branding.secondaryColor || "#8b5cf6"}
                                                        onChange={(e) => setBranding((p) => ({ ...p, secondaryColor: e.target.value }))}
                                                        className="absolute inset-[-10px] w-32 h-32 cursor-pointer opacity-0"
                                                    />
                                                </div>
                                                <input value={branding.secondaryColor || "#8b5cf6"} onChange={(e) => setBranding((p) => ({ ...p, secondaryColor: e.target.value }))}
                                                    placeholder="#8b5cf6" style={{ ...inputStyle, fontFamily: "monospace", fontSize: "16px", letterSpacing: "1px" }} />
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/50">
                                                Font Family
                                            </label>
                                            <div className="relative">
                                                <select value={branding.font || "Google Sans"} onChange={(e) => setBranding((p) => ({ ...p, font: e.target.value }))}
                                                    style={{ ...inputStyle, appearance: "none", cursor: "pointer", fontFamily: branding.font || "Google Sans" }}>
                                                    {["Google Sans", "Inter", "Roboto", "Outfit", "Playfair Display", "Montserrat", "Poppins"].map((f) => (
                                                        <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isOwner && (
                                    <button onClick={handleSaveBranding} disabled={saving}
                                        className="flex items-center justify-center gap-2 w-full mt-10 py-4 rounded-[14px] text-[16px] font-bold transition-all hover:-translate-y-0.5 active:translate-y-0"
                                        style={{
                                            background: "var(--text-primary)",
                                            color: "var(--bg-base)", border: "none", cursor: "pointer",
                                            opacity: saving ? 0.7 : 1,
                                            boxShadow: "0 8px 24px rgba(255,255,255,0.15)"
                                        }}
                                    >
                                        <Save size={20} /> {saving ? "Applying Changes..." : "Save Identity"}
                                    </button>
                                )}
                            </div>

                            {/* Live Preview */}
                            <div className="glass rounded-[24px] p-8 md:p-10" style={{ border: "1px solid var(--border-color)" }}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2.5 rounded-[12px] bg-white/5" style={{ color: "var(--text-primary)" }}>
                                        <LayoutTemplate size={22} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="font-bold text-2xl tracking-tight" style={{ color: "var(--text-primary)" }}>Live Preview</h3>
                                </div>

                                <div className="rounded-[18px] overflow-hidden shadow-2xl transition-all duration-500" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <div style={{
                                        padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
                                        background: "rgba(0,0,0,0.6)", borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    }}>
                                        <span style={{ fontWeight: "800", fontSize: "16px", letterSpacing: "-0.02em", color: branding.primaryColor || "#6366f1" }}>
                                            {tenant?.name}
                                        </span>
                                        <div style={{ display: "flex", gap: "20px", display: "none", '@media (min-width: 640px)': { display: "flex" } }}>
                                            {["Features", "Pricing", "Contact"].map((l) => (
                                                <span key={l} style={{ fontSize: "13px", fontWeight: "500", color: "rgba(255,255,255,0.6)" }}>{l}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: "60px 24px", textAlign: "center", minHeight: "360px",
                                        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                                        background: `radial-gradient(circle at 50% -20%, ${branding.primaryColor || "#6366f1"}30 0%, var(--bg-surface) 100%)`,
                                    }}>
                                        <div style={{
                                            fontSize: "42px", lineHeight: "1.1", fontWeight: "800", marginBottom: "16px", maxWidth: "80%",
                                            background: `linear-gradient(135deg, ${branding.primaryColor || "#6366f1"}, ${branding.secondaryColor || "#8b5cf6"})`,
                                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                            fontFamily: `"${branding.font || "Google Sans"}", sans-serif`,
                                            letterSpacing: "-0.03em"
                                        }}>
                                            Create the extraordinary with {tenant?.name}
                                        </div>
                                        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", marginBottom: "32px", maxWidth: "70%", lineHeight: "1.5" }}>
                                            Build stunning, high-performance websites generated seamlessly through artificial intelligence.
                                        </p>
                                        <div style={{
                                            display: "inline-block", padding: "14px 32px", borderRadius: "100px", fontSize: "15px", fontWeight: "700",
                                            background: `linear-gradient(135deg, ${branding.primaryColor || "#6366f1"}, ${branding.secondaryColor || "#8b5cf6"})`,
                                            color: "white", boxShadow: `0 10px 30px ${branding.primaryColor || "#6366f1"}40`
                                        }}>
                                            Start Building Now
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Team Tab */}
                    {activeTab === "team" && (
                        <div className="space-y-8">
                            {isAdmin && (
                                <div className="glass rounded-[24px] p-8" style={{ border: "1px solid var(--border-color)" }}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 rounded-[12px] bg-indigo-500/20 text-indigo-400">
                                            <Users size={22} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="font-bold text-2xl tracking-tight" style={{ color: "var(--text-primary)" }}>Invite Member</h3>
                                    </div>
                                    <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                        <div className="md:col-span-3 space-y-2">
                                            <label className="text-xs font-semibold uppercase text-white/50 px-1">Full Name</label>
                                            <input value={inviteForm.name} onChange={(e) => setInviteForm((p) => ({ ...p, name: e.target.value }))}
                                                placeholder="John Doe" required style={inputStyle} />
                                        </div>
                                        <div className="md:col-span-3 space-y-2">
                                            <label className="text-xs font-semibold uppercase text-white/50 px-1">Email Address</label>
                                            <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))}
                                                placeholder="john@example.com" required style={inputStyle} />
                                        </div>
                                        <div className="md:col-span-3 space-y-2">
                                            <label className="text-xs font-semibold uppercase text-white/50 px-1">Password</label>
                                            <input type="password" value={inviteForm.password} onChange={(e) => setInviteForm((p) => ({ ...p, password: e.target.value }))}
                                                placeholder="••••••••" required minLength={6} style={inputStyle} />
                                        </div>
                                        <div className="md:col-span-3 flex gap-3 h-[50px]">
                                            <select value={inviteForm.role} onChange={(e) => setInviteForm((p) => ({ ...p, role: e.target.value }))}
                                                style={{ ...inputStyle, flex: 1, appearance: "none", cursor: "pointer", height: "100%" }}>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="EDITOR">EDITOR</option>
                                                <option value="DEVELOPER">DEVELOPER</option>
                                            </select>
                                            <button type="submit"
                                                className="flex items-center justify-center transition-transform hover:scale-105"
                                                style={{
                                                    width: "50px", height: "50px", borderRadius: "14px",
                                                    background: "var(--text-primary)",
                                                    color: "var(--bg-base)", border: "none", cursor: "pointer", flexShrink: 0
                                                }}>
                                                <Plus size={20} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="glass rounded-[24px] p-8" style={{ border: "1px solid var(--border-color)" }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 rounded-[12px] bg-white/5 text-white/80">
                                        <Shield size={22} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="font-bold text-2xl tracking-tight" style={{ color: "var(--text-primary)" }}>Active Directory <span className="text-white/40 text-lg ml-2">({users.length})</span></h3>
                                </div>
                                <div className="space-y-4">
                                    {users.map((u) => {
                                        const RoleIcon = ROLE_ICONS[u.role] || Shield;
                                        const roleStyle = ROLE_COLORS[u.role] || {};
                                        return (
                                            <div key={u._id} className="flex flex-col sm:flex-row sm:items-center p-4 rounded-[16px] transition-colors hover:bg-white/5 border border-transparent hover:border-white/10"
                                                style={{ background: "rgba(255,255,255,0.02)" }}>
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="flex items-center justify-center rounded-full font-bold text-lg"
                                                        style={{ width: "48px", height: "48px", background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)", flexShrink: 0 }}>
                                                        {u.name[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[16px]" style={{ color: "var(--text-primary)" }}>{u.name}</p>
                                                        <p className="text-[14px] opacity-60">{u.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0 w-full sm:w-auto pl-16 sm:pl-0">
                                                    <span className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full font-bold tracking-wider"
                                                        style={{ background: roleStyle.bg, color: roleStyle.color, border: `1px solid ${roleStyle.border}` }}>
                                                        <RoleIcon size={12} strokeWidth={3} />{u.role}
                                                    </span>

                                                    {isOwner && u.role !== "OWNER" && (
                                                        <div className="flex items-center gap-3">
                                                            <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                                style={{ fontSize: "13px", fontWeight: "600", padding: "8px 12px", borderRadius: "10px", background: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)", cursor: "pointer", outline: "none" }}>
                                                                <option value="ADMIN">ADMIN</option>
                                                                <option value="EDITOR">EDITOR</option>
                                                                <option value="DEVELOPER">DEVELOPER</option>
                                                            </select>
                                                            <button onClick={() => handleRemoveUser(u._id, u.name)}
                                                                className="transition-colors hover:bg-red-500/20"
                                                                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", color: "#f87171", cursor: "pointer", padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

                    {/* Domains Tab */}
                    {activeTab === "domains" && (
                        <div className="space-y-8">
                            <div className="glass rounded-[24px] p-8" style={{ border: "1px solid var(--border-color)" }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 rounded-[12px] bg-emerald-500/20 text-emerald-400">
                                        <Globe size={22} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="font-bold text-2xl tracking-tight" style={{ color: "var(--text-primary)" }}>Connectivity</h3>
                                </div>
                                <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-xs font-semibold uppercase text-white/50 px-1">Connect Custom Domain</label>
                                        <input value={newDomain} onChange={(e) => setNewDomain(e.target.value)}
                                            placeholder="www.yourstartup.com" required style={{ ...inputStyle }} />
                                    </div>
                                    <div className="flex items-end">
                                        <button type="submit"
                                            className="w-full sm:w-auto transition-transform hover:-translate-y-0.5"
                                            style={{ height: "50px", padding: "0 28px", borderRadius: "14px", background: "var(--text-primary)", color: "var(--bg-base)", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "15px" }}>
                                            Add Domain
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="glass rounded-[24px] p-8" style={{ border: "1px solid var(--border-color)" }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <h3 className="font-bold text-2xl tracking-tight" style={{ color: "var(--text-primary)" }}>Active Domains</h3>
                                </div>
                                <div className="space-y-4">
                                    {domains.map((d) => (
                                        <div key={d._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[16px] transition-colors border border-transparent hover:border-white/10 hover:bg-white/5"
                                            style={{ background: "rgba(255,255,255,0.02)" }}>
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 rounded-[10px]" style={{ background: d.verified ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)" }}>
                                                    <Globe size={20} style={{ color: d.verified ? "#10b981" : "var(--text-muted)" }} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>{d.domain}</span>
                                                        {d.isDefault && <span className="bg-white/10 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full text-white/70">Primary</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-4 sm:mt-0 pl-16 sm:pl-0">
                                                <span className={`text-[12px] px-3 py-1.5 rounded-full font-bold tracking-wide uppercase flex items-center gap-1.5`}
                                                    style={{
                                                        background: d.verified ? "rgba(16,185,129,0.15)" : "rgba(251,191,36,0.15)",
                                                        color: d.verified ? "#10b981" : "#fbbf24",
                                                        border: `1px solid ${d.verified ? "rgba(16,185,129,0.3)" : "rgba(251,191,36,0.3)"}`,
                                                    }}>
                                                    {d.verified && <CheckCircle2 size={14} />}
                                                    {d.verified ? "Verified" : "Pending Setup"}
                                                </span>
                                                {!d.verified && !d.isDefault && (
                                                    <button onClick={() => handleVerifyDomain(d._id)}
                                                        className="hover:underline font-semibold"
                                                        style={{ fontSize: "14px", color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}>
                                                        Verify Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {domains.length === 0 && (
                                        <div className="text-center py-10 opacity-50">
                                            <Globe size={40} className="mx-auto mb-4 opacity-50" />
                                            <p className="text-[15px] font-medium">No custom domains configured.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
